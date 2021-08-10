import { useState, useEffect } from 'react';
import Axios from 'axios';
import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';
import 'firebase/auth';

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
export const auth = firebase.auth();

export const functions = firebase.functions();

if (process.env.REACT_APP_IS_DEV) {
  functions.useEmulator('localhost', '5001');
}

export { firebase };

export { default as useGetUserPosts } from './useGetUserPosts';
export { default as useGetAddress } from './useGetAddress';
export { default as useGetPosts } from './useGetPosts';
export { default as useGetPost } from './useGetPost';
export { default as storePost } from './storePost';

class Post {
  constructor(
    downloadURL,
    category,
    title,
    content,
    location,
    approved,
    visible,
    id
  ) {
    this.downloadURL = downloadURL;
    this.category = category;
    this.title = title;
    this.content = content;
    this.location = {
      latitude: location.latitude,
      longitude: location.longitude,
    };
    this.approved = approved;
    this.visible = visible;
    this.id = id;
  }

  async onDelete() {
    console.log(this);

    const postRef = db.collection('posts').doc(this.id);

    await postRef.update({
      visible: false,
    });
  }
}

export const postConverter = {
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);

    return new Post(
      data.downloadURL,
      data.category,
      data.title,
      data.content,
      data.location,
      data.approved,
      data.visible,
      snapshot.id
    );
  },
};

export const useGetCategories = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(
    () =>
      (async () => {
        try {
          const { data } = await functions.httpsCallable('getCategories')();
          setCategories(data);
        } catch (error) {
          setError(error);
        }
      })(),
    []
  );

  return [categories, error];
};

export const useGetCategory = categoryId => {
  const [category, setCategory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(
    () =>
      (async () => {
        if (!categoryId) return;

        try {
          const { data } = await functions.httpsCallable('getCategories')();
          setCategory(data.find(ctg => ctg.id === categoryId));
        } catch (error) {
          setError(error);
        }
      })(),
    [categoryId]
  );

  return [category, error];
};

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unlisten = auth.onAuthStateChanged(setCurrentUser);

    return () => {
      unlisten();
    };
  }, []);

  return currentUser;
};
