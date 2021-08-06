const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(
    require('../config/serviceAccountKey.json')
  ),
});

const db = admin.firestore();

db.recursiveDelete(db.collection('posts'));

const bucket = admin.storage().bucket('repair-alert.appspot.com');

bucket.deleteFiles();
