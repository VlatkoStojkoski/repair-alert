import React from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { Box, IconButton } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

import Home from './Home';
import NewPost from './NewPost';
import Post from './Post';

const Routes = () => {
  const history = useHistory();

  return (
    <>
      <Box pos="sticky" h="0" w="0" top="0" zIndex="9999">
        <IconButton
          icon={<ArrowBackIcon />}
          borderRadius="50%"
          colorScheme="brand_red"
          size="md"
          onClick={() => history.goBack()}
          mt="4"
          ml="4"
        />
      </Box>
      <Switch>
        <Route exact path="/new-post">
          <NewPost />
        </Route>
        <Route path="/post">
          <Post />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
      </Switch>
    </>
  );
};

export default Routes;
