import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Modal,
  ModalOverlay,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  ModalContent,
  Text,
  Divider,
  Box,
} from '@chakra-ui/react';

import SignIn from '../routes/SignIn';
import SignUpModal from './SignUpModal';

const SignInModal = ({ onClose, isOpen }) => {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const history = useHistory();

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent mx="5">
          <ModalCloseButton />

          <ModalBody pb="0">
            <SignIn closeModal={onClose} />
          </ModalBody>

          <ModalFooter pt="3">
            <Box w="100%" textAlign="center">
              <Divider mb="3" />
              <Button
                onClick={() => {
                  onClose();
                  setIsSignUpOpen(true);
                }}
                colorScheme="brand_blue"
                fontWeight="bold"
              >
                Создади нова сметка
              </Button>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
      />
    </>
  );
};

export default SignInModal;
