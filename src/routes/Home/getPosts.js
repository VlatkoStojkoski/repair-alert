import { useEffect, useState } from 'react';
import { db } from '../../api';

class Post {
  constructor(downloadURL, type, content, location, id) {
    this.downloadURL = downloadURL;
    this.type = type;
    this.content = content;
    this.location = {
      latitude: location.latitude,
      longitude: location.longitude,
    };
    this.id = id;
  }
}

const postConverter = {
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);

    return new Post(
      data.downloadURL,
      data.type,
      data.content,
      data.location,
      snapshot.id
    );
  },
};

export default function useGetPosts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(
    () =>
      (async () => {
        try {
          const postsSnap = await db
            .collection('posts')
            .where('approved', '==', true)
            .withConverter(postConverter)
            .get();

          const postsArr = [];
          postsSnap.forEach(post => postsArr.push(post.data()));

          setPosts(postsArr);
        } catch (error) {
          setError(error);
        }
      })(),
    []
  );

  return [posts, error];
}
