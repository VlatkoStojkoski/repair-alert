import React, { useEffect, useState } from 'react';
import { Button, Portal } from '@chakra-ui/react';
import { SmallAddIcon } from '@chakra-ui/icons';

const PostButton = props => {
  const [portalRef, setPortalRef] = useState(null);

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
        transform="translateY(-100%) translateY(-1em)"
        {...props}
      >
        <SmallAddIcon /> Објави
      </Button>
    </Portal>
  );
};

export default PostButton;
