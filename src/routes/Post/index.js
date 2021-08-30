import React, { useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import {
  Button,
  IconButton,
  Collapse,
  Image,
  Text,
  VStack,
  Flex,
  Box,
  Heading,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

import { useGetCategory, useGetPost } from '../../api';
import BigContainer from '../../components/BigContainer';
import { MapPinIcon } from '../../icons';

const Post = () => {
  const [isExtended, setIsExtended] = useState(false);
  const {
    params: { postId },
  } = useRouteMatch('/post/:postId');
  const [post] = useGetPost(postId);
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
              src={`/${category?.id}.svg`}
              alt="post category icon"
              fill="black"
            />
            <Text fontSize="md">
              Оваа објава содржи {category?.description}
            </Text>
          </Flex>

          {post.address ? (
            <Flex gridColumnGap="3" px="3" borderRadius="md">
              <MapPinIcon w="25px" h="25px" color="brand_red.600" />
              <Button
                colorScheme="brand_red"
                variant="link"
                onClick={() => {
                  const newWindow = window.open(
                    `https://www.google.com/maps?z=13&q=loc:${post.location.latitude}+${post.location.longitude}`,
                    '_blank',
                    'noopener,noreferrer'
                  );
                  if (newWindow) newWindow.opener = null;
                }}
              >
                <Text isTruncated>{post.address}</Text>
              </Button>
            </Flex>
          ) : null}

          <Box bg="gray.100" p="3" py="2" borderRadius="md">
            <Text fontWeight="bold" fontSize="xl" mb="1">
              {post.title}
            </Text>
            {post.content && <Text>{post.content}</Text>}
          </Box>
        </VStack>
      )}
    </BigContainer>
  );
};

export default Post;
