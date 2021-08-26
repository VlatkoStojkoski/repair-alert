import { useToast } from '@chakra-ui/react';

import { getErrorMessage } from '../api';

export default function useShowError() {
  const toast = useToast();

  return params => {
    const { title, error } = params.errorCode
      ? getErrorMessage(params.errorCode)
      : params;

    toast({
      title: String(title),
      description: String(error),
      status: 'error',
      duration: 7500,
      isClosable: true,
    });

    return;
  };
}
