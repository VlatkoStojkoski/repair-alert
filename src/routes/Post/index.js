import React from 'react';
import { useRouteMatch } from 'react-router-dom';

const Post = () => {
  const {
    params: { postId },
  } = useRouteMatch('/post/:postId');

  return <div>post {postId} nigga</div>;
};

export default Post;
