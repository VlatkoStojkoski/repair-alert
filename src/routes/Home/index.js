import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

import PostButton from '../../components/PostButton';
import { useGetPosts } from '../../api';
import MapView from './MapView';

const Home = () => {
  const history = useHistory();
  const [posts] = useGetPosts();

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
