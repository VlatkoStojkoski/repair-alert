import Axios from 'axios';
import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/firestore';
import 'firebase/storage';

const axios = Axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

export { axios };

const firebaseConfig = {
  apiKey: 'AIzaSyAxMhStPfQ2hcl3gYOAetT4yxyESBEXnSw',
  authDomain: 'repair-alert.firebaseapp.com',
  projectId: 'repair-alert',
  storageBucket: 'repair-alert.appspot.com',
  messagingSenderId: '643983819941',
  appId: '1:643983819941:web:e76cc84e45f936b43d394c',
  measurementId: 'G-V5HHTVPW3V',
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const storage = firebase.storage();
export const db = firebase.firestore();
export { firebase };
