import { useState, useEffect } from 'react';
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

class Post {
  constructor(downloadURL, category, content, location, id) {
    this.downloadURL = downloadURL;
    this.category = category;
    this.content = content;
    this.location = {
      latitude: location.latitude,
      longitude: location.longitude,
    };
    this.id = id;
  }
}

export const postConverter = {
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);

    return new Post(
      data.downloadURL,
      data.category,
      data.content,
      data.location,
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
          const { data } = await axios.get('/api/categories');

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
          const { data } = await axios.get('/api/categories');

          setCategory(data.find(ctg => ctg.id === categoryId));
        } catch (error) {
          setError(error);
        }
      })(),
    [categoryId]
  );

  return [category, error];
};
