import { useEffect, useState } from 'react';
import { db, postConverter } from '../../api';

export default function useGetPost(postId) {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(
    () =>
      (async () => {
        try {
          const postSnap = await db
            .collection('posts')
            .doc(postId)
            .withConverter(postConverter)
            .get();

          setPost(postSnap.data());
        } catch (error) {
          setError(error);
        }
      })(),
    []
  );

  return [post, error];
}
