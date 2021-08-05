import Axios from 'axios';

const axios = Axios.create({
  baseURL: 'http://localhost:5001/repair-alert/us-central1',
  withCredentials: false,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  },
});

axios.get('/api/').then(console.log);

export { axios };

// import firebase from 'firebase/app';
// import 'firebase/analytics';
// import 'firebase/firestore';
// import 'firebase/storage';

// const firebaseConfig = {
//   apiKey: 'AIzaSyAxMhStPfQ2hcl3gYOAetT4yxyESBEXnSw',
//   authDomain: 'repair-alert.firebaseapp.com',
//   projectId: 'repair-alert',
//   storageBucket: 'repair-alert.appspot.com',
//   messagingSenderId: '643983819941',
//   appId: '1:643983819941:web:e76cc84e45f936b43d394c',
//   measurementId: 'G-V5HHTVPW3V',
// };

// firebase.initializeApp(firebaseConfig);
// firebase.analytics();

// export const storage = firebase.storage();
// export const db = firebase.firestore();
// export default firebase;
