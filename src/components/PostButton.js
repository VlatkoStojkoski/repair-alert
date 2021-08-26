import React, { useEffect, useState } from 'react';
import { Button, Portal } from '@chakra-ui/react';
import { SmallAddIcon } from '@chakra-ui/icons';

import { useCurrentUser } from '../api';

const PostButton = props => {
  const [portalRef, setPortalRef] = useState(null);
  const currentUser = useCurrentUser();

  useEffect(() => {
    setPortalRef({
      current: document.querySelector('#topPortal'),
    });
  }, []);

  return (
    <Portal containerRef={portalRef}>
      <Button
        colorScheme="brand_red"
        px="6"
        borderRadius="xl"
        size="lg"
        float="left"
        transform="translateY(-100%) translateY(-1em)"
        disabled={!currentUser}
        {...props}
      >
        <SmallAddIcon /> Објави
      </Button>
    </Portal>
  );
};

export default PostButton;
