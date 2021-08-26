import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

import { errorCodes } from '../api';

export default function useShowError() {
  const toast = useToast();

  return params => {
    const { title, error: description } = params.errorCode
      ? errorCodes[params.errorCode]
      : params;

    toast({
      title,
      description,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });

    return;
  };
}
