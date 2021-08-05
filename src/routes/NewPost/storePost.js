import { axios } from 'api';

// import firebase, { storage, db } from 'api';

export default async function storePost(post) {
  try {
    const { data } = await axios.post('/api/post/new', post);

    console.log(data);
  } catch (error) {
    console.error(error?.response?.data || error);
  }

  // const { id: postId } = await db.collection('posts').add({
  // type: post.type,
  // content: post.content,
  // location: new firebase.firestore.GeoPoint(
  //   post.location.lat,
  //   post.location.lng
  // ),
  // });

  // const storageRef = storage.ref();

  // const imageRef = storageRef.child(`${postId}.jpg`);

  // const snapshot = await imageRef.putString(post.image, 'data_url');

  // console.log(snapshot);
}
