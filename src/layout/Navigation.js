import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, IconButton, Button } from '@chakra-ui/react';
import { Hous, ArrowForwardIcon } from '@chakra-ui/icons';

import SignInModal from './SignInModal';
import { HomeIcon } from '../icons';
import { useCurrentUser } from '../api';

const Navigation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentUser = useCurrentUser();
  const history = useHistory();

  return (
    <>
      <Box pos="sticky" h="0" w="100%" top="0" zIndex="overlay">
        <IconButton
          onClick={() => history.push('/')}
          icon={<HomeIcon />}
          borderRadius="50%"
          colorScheme="brand_red"
          size="md"
          pos="absolute"
          top="4"
          left="4"
        />

        {!currentUser ? (
          <Button
            rightIcon={<ArrowForwardIcon />}
            onClick={() => setIsModalOpen(true)}
            colorScheme="brand_red"
            variant="solid"
            pos="absolute"
            top="4"
            right="4"
          >
            Логирај се
          </Button>
        ) : (
          <Button
            rightIcon={<ArrowForwardIcon />}
            onClick={() => history.push('/profile')}
            colorScheme="brand_red"
            variant="solid"
            pos="absolute"
            top="4"
            right="4"
          >
            Профил
          </Button>
        )}
      </Box>

      <SignInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Navigation;
