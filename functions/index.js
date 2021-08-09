const functions = require('firebase-functions');

exports.getCategories = functions.https.onCall(() =>
  require('./categories.json')
);

let adminInit = false;

exports.newPost = functions.https.onCall(async (data, context) => {
  const admin = require('firebase-admin');

  if (!adminInit) {
    admin.initializeApp();
    adminInit = true;
  }

  const spawn = require('child-process-promise').spawn;
  const path = require('path');
  const os = require('os');
  const fs = require('fs/promises');

  const mime = require('mime-types');

  const mmm = require('mmmagic');
  const magic = new mmm.Magic(mmm.MAGIC_MIME_TYPE);

  const dataUriToBuffer = require('data-uri-to-buffer');
  const { nanoid } = require('nanoid');

  const { image, title, category, content, location } = data;

  const detectMIMEType = buffer =>
    new Promise((res, rej) => {
      magic.detect(buffer, (err, result) => {
        if (err) rej(err);
        res(result);
      });
    });

  try {
    const imageBuf = await dataUriToBuffer(image);

    const MIMEType = await detectMIMEType(imageBuf);

    if (!MIMEType.startsWith('image/'))
      throw Error({ code: 'invalid-image', message: 'Invalid image format' });

    const postId = nanoid();

    const fileName = `${postId}.${mime.extension(MIMEType)}`;

    const bucket = admin.storage().bucket();
    const tempFilePath = path.join(os.tmpdir(), fileName);

    // Write the image to a temporary file
    await fs.writeFile(tempFilePath, imageBuf);
    functions.logger.log('Image saved locally to', tempFilePath);

    // Generate a resized image using ImageMagick.
    await spawn('convert', [
      tempFilePath,
      '-strip',
      '-interlace',
      'Plane',
      '-gaussian-blur',
      '0.05',
      '-quality',
      '75%',
      '-resize',
      '512x512',
      tempFilePath,
    ]);
    functions.logger.log('Resized image created at', tempFilePath);

    const downloadToken = nanoid();
    // Uploading the resized image.
    await bucket.upload(tempFilePath, {
      destination: fileName,
      metadata: {
        metadata: {
          firebaseStorageDownloadTokens: downloadToken,
        },
      },
    });
    functions.logger.log('Uploaded image to', fileName);

    const downloadURL =
      `https://firebasestorage.googleapis.com/v0/b/${bucket.name}` +
      `/o/${fileName}?alt=media&token=${downloadToken}`;

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
        approved: true,
        visible: true,
        uid: context.auth.uid,
        postedAt: new admin.firestore.Timestamp(parseInt(Date.now() / 1000), 0),
      });
    functions.logger.log('Post stored to firestore db with id', postId);

    // Once the resized image has been uploaded delete the local file to free up disk space.
    await fs.unlink(tempFilePath);

    return { postId, downloadURL };
  } catch (err) {
    const error =
      err.code && err.message ? [err.code, err.message] : ['internal', err];

    functions.logger.error('An error has occured:', error);

    throw new functions.https.HttpsError(...error);
  }
});
