import React from 'react';
import { Box } from '@chakra-ui/react';

const BigContainer = ({ children, ...props }) => {
  return (
    <Box
      px="7"
      maxW="500px"
      minH="100%"
      h="100%"
      pt="16"
      pb="12"
      mx="auto"
      {...props}
    >
      {children}
    </Box>
  );
};

export default BigContainer;
