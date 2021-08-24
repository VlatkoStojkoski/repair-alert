import { useEffect, useState } from 'react';
import { db, postConverter } from '.';

export default function useGetPosts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(
    () =>
      (async () => {
        try {
          const postsSnap = await db
            .collection('posts')
            .where('visible', '==', true)
            .where('approved', '==', true)
            .withConverter(postConverter)
            .get();

          const postsArr = [];
          postsSnap.forEach(post => postsArr.push(post.data()));

          setPosts(postsArr);

          window.posts = postsArr;
        } catch (error) {
          setError(error);
        }
      })(),
    []
  );

  return [posts, error];
}
