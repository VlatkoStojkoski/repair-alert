import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Box, ChakraProvider } from '@chakra-ui/react';

import Routes from './routes';
import theme from './theme';

String.prototype.toFirstUpperCase = function () {
  return this[0].toUpperCase() + this.substring(1).toLowerCase();
};

ReactDOM.render(
  <Router>
    <ChakraProvider theme={theme}>
      <Box
        id="topPortal"
        h="0"
        w="max-content"
        left="50%"
        top="100%"
        pos="sticky"
        transform="translateX(-50%)"
        zIndex="9999"
      ></Box>
      <Box minH="fill_h" minW="100%">
        <Routes />
      </Box>
    </ChakraProvider>
  </Router>,
  document.getElementById('root')
);
