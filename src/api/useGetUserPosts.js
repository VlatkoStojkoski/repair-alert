import { useEffect, useState } from 'react';
import { db, postConverter, useCurrentUser } from '.';

export default function useGetUserPosts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const user = useCurrentUser();

  useEffect(
    () =>
      (async () => {
        if (!user) return;

        try {
          const postsSnap = await db
            .collection('posts')
            .where('visible', '==', true)
            .where('uid', '==', user.uid)
            .withConverter(postConverter)
            .get();

          const postsArr = [];
          postsSnap.forEach(post => postsArr.push(post.data()));

          setPosts({
            approved: postsArr.filter(post => post.approved),
            unapproved: postsArr.filter(post => !post.approved),
          });
        } catch (error) {
          setError(error);
        }
      })(),
    [user]
  );

  return [posts, error];
}
