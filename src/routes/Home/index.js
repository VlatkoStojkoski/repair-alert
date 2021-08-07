import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

import MapView from './MapView';
import PostButton from '../../components/PostButton';
import useGetPosts from './useGetPosts';

const Home = () => {
  const history = useHistory();
  const [posts, error] = useGetPosts();

  return (
    <>
      <Box pos="relative">
        <MapView data={posts} />
      </Box>
      <PostButton onClick={() => history.push('/new-post')} />
    </>
  );
};

export default Home;
