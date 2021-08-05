import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

import MapView from './MapView';
import PostButton from '../../components/PostButton';

const Home = () => {
  const history = useHistory();

  return (
    <>
      <Box pos="relative">
        <MapView />
      </Box>
      <PostButton onClick={() => history.push('/new-post')} />
    </>
  );
};

export default Home;
