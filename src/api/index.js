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
functions.useEmulator('localhost', 5001);

export { firebase };

export { default as useGetUserPosts } from './useGetUserPosts';
export { default as useGetPosts } from './useGetPosts';
export { default as useGetPost } from './useGetPost';
export { default as storePost } from './storePost';

class Post {
  constructor({
    downloadURL,
    category,
    title,
    content,
    location,
    address,
    approved,
    visible,
    id,
  }) {
    this.downloadURL = downloadURL;
    this.category = category;
    this.title = title;
    this.content = content;
    this.location = {
      latitude: location.latitude,
      longitude: location.longitude,
    };
    this.address = address;
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
    const {
      downloadURL,
      category,
      title,
      content,
      location,
      address,
      approved,
      visible,
    } = snapshot.data(options);

    return new Post({
      downloadURL,
      category,
      title,
      content,
      location,
      address: address && address.replace('North Macedonia', 'Macedonia'),
      approved,
      visible,
      id: snapshot.id,
    });
  },
};

export const useGetCategories = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(
    () =>
      (async () => {
        try {
          let { data } = await functions.httpsCallable('getCategories')();
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
  const [categories, error] = useGetCategories();

  const [category, setCategory] = useState(null);

  useEffect(
    () =>
      (async () => {
        if (!categoryId || !categories.length) return;

        setCategory(categories.find(ctg => ctg.id === categoryId));
      })(),
    [categoryId, categories]
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

export { default as errorCodes } from './errorCodes';
