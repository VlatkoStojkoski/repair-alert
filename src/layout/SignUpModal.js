import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalCloseButton,
  ModalBody,
  ModalContent,
} from '@chakra-ui/react';

import SignUp from '../routes/SignUp';

const SignUpModal = ({ onClose, isOpen }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />

    <ModalContent mx="5">
      <ModalCloseButton />

      <ModalBody pb="4">
        <SignUp closeModal={onClose} />
      </ModalBody>
    </ModalContent>
  </Modal>
);

export default SignUpModal;
