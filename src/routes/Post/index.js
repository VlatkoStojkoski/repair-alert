import React, { useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import {
  Box,
  Button,
  IconButton,
  Collapse,
  Image,
  Text,
  VStack,
  Flex,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

import BigContainer from '../../components/BigContainer';
import { useGetCategory } from '../../api';
import useGetPost from './useGetPost';
import useGetAddress from './useGetAddress';
import { MapPinIcon } from '../../icons';

const Post = () => {
  const [isExtended, setIsExtended] = useState(false);
  const {
    params: { postId },
  } = useRouteMatch('/post/:postId');
  const [post] = useGetPost(postId);
  const [address] = useGetAddress(post?.location);
  const [category] = useGetCategory(post?.category);

  return (
    <BigContainer>
      {post && (
        <VStack gridGap="3" alignItems="normal">
          <Collapse
            startingHeight="300px"
            in={isExtended}
            style={{ position: 'relative' }}
          >
            <Image
              src={post.downloadURL}
              borderRadius="md"
              objectFit="cover"
              width="100%"
              height="100%"
            />
            <IconButton
              icon={isExtended ? <ChevronUpIcon /> : <ChevronDownIcon />}
              colorScheme="blackAlpha"
              onClick={() => setIsExtended(!isExtended)}
              mt="1rem"
              pos="absolute"
              bottom="2"
              right="2"
            />
          </Collapse>

          <Flex gridColumnGap="3" px="3" borderRadius="md">
            <Image
              w="25px"
              src={`/${category.id}.svg`}
              alt="post image"
              fill="black"
            />
            <Text fontSize="md">Оваа објава содржи {category.description}</Text>
          </Flex>

          <Flex gridColumnGap="3" px="3" borderRadius="md">
            <MapPinIcon w="25px" h="25px" color="brand_red.600" />
            <Button
              colorScheme="brand_red"
              variant="link"
              onClick={() => {
                const newWindow = window.open(
                  address?.mapsURL,
                  '_blank',
                  'noopener,noreferrer'
                );
                if (newWindow) newWindow.opener = null;
              }}
            >
              {address?.address}
            </Button>
          </Flex>

          <Text bg="gray.100" p="3" py="2" borderRadius="md">
            {post.content}
          </Text>
        </VStack>
      )}
    </BigContainer>
  );
};

export default Post;
