const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(cors());
app.use(morgan('combined'));

app.get('/', (req, res) => {
  const date = new Date();
  const hours = (date.getHours() % 12) + 1; // London is UTC + 1hr;
  res.json({ bongs: 'BONG '.repeat(hours) });
});

app.get('/categories', (req, res) => {
  const categories = require('./categories.json');
  res.json(categories);
});

app.post(
  '/post/new',
  async ({ body: { image, category, content, location } }, res) => {
    const spawn = require('child-process-promise').spawn;
    const path = require('path');
    const os = require('os');
    const fs = require('fs/promises');

    const mime = require('mime-types');

    const mmm = require('mmmagic');
    const magic = new mmm.Magic(mmm.MAGIC_MIME_TYPE);

    const dataUriToBuffer = require('data-uri-to-buffer');
    const { nanoid } = require('nanoid');

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
          content,
          downloadURL,
          approved: true,
        });
      functions.logger.log('Post stored to firestore db with id', postId);

      // Once the resized image has been uploaded delete the local file to free up disk space.
      await fs.unlink(tempFilePath);

      return res.json({ postId, downloadURL });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  }
);

exports.api = functions.https.onRequest(app);
