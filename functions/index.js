const functions = require('firebase-functions');

exports.getCategories = functions.https.onCall(() =>
  require('./categories.json')
);

let adminInit = false;

exports.newPost = functions
  .runWith({ memory: '2GB' })
  .https.onCall(async (data, context) => {
    const requiredFields = [
      ['image', 'слика'],
      ['title', 'наслов'],
      ['category', 'категорија'],
      ['location', 'локација'],
    ];

    const missingFields = requiredFields.filter(([field, translation]) => {
      return !data[field];
    });

    if (missingFields.length)
      throw new functions.https.HttpsError(
        'unknown',
        'Вашата објава не содржи ' +
          missingFields.map(field => field[1]).join(',')
      );

    const admin = require('firebase-admin');

    if (!adminInit) {
      admin.initializeApp();
      adminInit = true;
    }

    require('dotenv').config();

    const spawn = require('child-process-promise').spawn;
    const path = require('path');
    const os = require('os');
    const fs = require('fs/promises');

    const mime = require('mime-types');

    const mmm = require('mmmagic');
    const magic = new mmm.Magic(mmm.MAGIC_MIME_TYPE);

    const dataUriToBuffer = require('data-uri-to-buffer');
    const { nanoid } = require('nanoid');

    const {
      Client: MapClient,
    } = require('@googlemaps/google-maps-services-js');
    const mapClient = new MapClient({});

    const { image, title, category, content, location } = data;

    const detectMIMEType = buffer =>
      new Promise((res, rej) => {
        magic.detect(buffer, (err, result) => {
          if (err) rej(err);
          res(result);
        });
      });

    const resize = (inputPath, outputPath) =>
      spawn('convert', [
        inputPath,
        '-strip',
        '-interlace',
        'Plane',
        '-gaussian-blur',
        '0.05',
        '-quality',
        '75%',
        '-resize',
        '512x512',
        outputPath,
      ]);

    const uploadToBucket = (
      bucket,
      inputPath,
      destinationPath,
      downloadToken
    ) =>
      bucket.upload(inputPath, {
        destination: destinationPath,
        metadata: {
          metadata: {
            firebaseStorageDownloadTokens: downloadToken,
          },
        },
      });

    const getDownloadURL = (bucket, filePath, downloadToken) =>
      `https://firebasestorage.googleapis.com/v0/b/${bucket.name}` +
      `/o/${filePath}?alt=media&token=${downloadToken}`;

    const imageBuf = dataUriToBuffer(image);

    const MIMEType = await detectMIMEType(imageBuf);

    if (!MIMEType.startsWith('image/'))
      throw new functions.https.HttpsError('unknown', 'Invalid image format');

    const bucket = admin.storage().bucket();

    const postId = nanoid();
    const downloadToken = nanoid();

    const fileName = `${postId}.${mime.extension(MIMEType)}`;
    const tempFilePath = path.join(os.tmpdir(), fileName);

    await fs.writeFile(tempFilePath, imageBuf).catch(err => {
      throw new functions.https.HttpsError(
        'unknown',
        'Something went wrong while writing file to disk',
        { error: err.message }
      );
    });
    functions.logger.log('Image saved locally to', tempFilePath);

    await resize(tempFilePath, tempFilePath).catch(err => {
      throw new functions.https.HttpsError(
        'unknown',
        'Something went wrong while resizing the image',
        { error: err.message }
      );
    });
    functions.logger.log('Resized image created at', tempFilePath);

    await uploadToBucket(bucket, tempFilePath, fileName, downloadToken).catch(
      err => {
        throw new functions.https.HttpsError(
          'unknown',
          'Something went wrong while uploading the image',
          { error: err.message }
        );
      }
    );
    functions.logger.log('Uploaded image to', fileName);

    let {
      data: { results: addressResults },
    } = await mapClient
      .reverseGeocode({
        params: {
          latlng: `${location.lat},${location.lng}`,
          location_type: 'APPROXIMATE',
          key: 'AIzaSyBdPnmrg8YonjYq_dp2ub7vzj3vHuu-qvo',
        },
      })
      .catch(err =>
        functions.logger.error(
          'Something went wrong while converting the address',
          err.message
        )
      );

    const downloadURL = getDownloadURL(bucket, fileName, downloadToken);

    await admin
      .firestore()
      .collection('posts')
      .doc(postId)
      .set({
        category,
        location: new admin.firestore.GeoPoint(location.lat, location.lng),
        title,
        content,
        downloadURL,
        address:
          addressResults?.[1]?.formatted_address ||
          addressResults?.[0]?.formatted_address ||
          null,
        approved: true,
        visible: true,
        uid: context.auth?.uid || 'anonymous',
        postedAt: new admin.firestore.Timestamp(parseInt(Date.now() / 1000), 0),
      })
      .catch(err => {
        throw new functions.https.HttpsError(
          'unknown',
          'Something went wrong while storing the post',
          { error: err.message }
        );
      });
    functions.logger.log('Post stored to firestore db with id', postId);

    await fs.unlink(tempFilePath);

    return { postId };
  });
