import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Button,
  ModalContent,
  Box,
  PinInput,
  PinInputField,
  HStack,
  Text,
} from '@chakra-ui/react';

import { auth } from '../api';
import SignIn from '../routes/SignIn';

const SignInModal = ({ onClose, isOpen }) => {
  const history = useHistory();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent mx="1em">
        <ModalCloseButton />

        <ModalBody>
          <SignIn closeModal={onClose} />
        </ModalBody>

        <ModalFooter>
          <Text textAlign="center" color="gray.800" fontSize="sm">
            * Доколку немате кориснички профил, можете да се регистрирате{' '}
            <Button
              onClick={() => {
                onClose();
                history.push('/signup');
              }}
              colorScheme="brand_red"
              variant="link"
              fontWeight="bold"
            >
              овде
            </Button>
          </Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SignInModal;
