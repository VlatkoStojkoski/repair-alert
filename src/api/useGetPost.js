import { useEffect, useState } from 'react';
import { db, postConverter } from './';

export default function useGetPost(postId) {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(
    () =>
      (async () => {
        if (!postId) return;

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
    [postId]
  );

  return [post, error];
}
