import React, { useMemo, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  VStack,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

import BigContainer from '../../components/BigContainer';
import {
  auth,
  useCurrentUser,
  useGetCategory,
  useGetUserPosts,
} from '../../api';
import { toFirstUpperCase } from '../../utils';
import PostButton from '../../components/PostButton';

const PostPreview = ({ data, remove }) => {
  const [category] = useGetCategory(data.category);
  const [isShown, setIsShown] = useState(true);

  return (
    <Box w="100%">
      <Link to={`/post/${data.id}`}>
        <Flex
          h="87.5px"
          w="100%"
          borderWidth="1px"
          borderBottomWidth="0"
          borderTopRadius="md"
        >
          <Box w="clamp(70px, 30%, 137.5px)" h="100%" flex="0 0 auto">
            <Image
              borderTopLeftRadius="md"
              w="100%"
              h="100%"
              objectFit="cover"
              src={data.downloadURL}
            />
          </Box>

          <Flex
            flexDir="column"
            flexGrow="1"
            p="3"
            justifyContent="space-between"
            isTruncated
          >
            <Box as="h3" fontSize="xl" fontWeight="bold" isTruncated>
              {data.title}
            </Box>

            <Flex gridColumnGap="2" alignItems="center">
              <Image
                boxSize="20px"
                src={`/${category?.id}.svg`}
                alt={`${category?.id} category icon`}
              />

              <Text fontSize="sm">{toFirstUpperCase(category?.short)}</Text>
            </Flex>
          </Flex>
        </Flex>
      </Link>

      <Button
        w="100%"
        variant="outline"
        float="right"
        borderTopRadius="0"
        leftIcon={<DeleteIcon />}
        onClick={async () => {
          await data.onDelete.bind(data)();
          window.location.reload();
        }}
      >
        Избриши
      </Button>
    </Box>
  );
};

const Profile = () => {
  const history = useHistory();
  const user = useCurrentUser();

  const [posts, error] = useGetUserPosts();

  if (error) console.error(error);

  return (
    <BigContainer>
      <Heading as="h1" textAlign="center" mb="5">
        {user?.displayName}
      </Heading>

      {posts.unapproved?.length ? (
        <>
          <Heading as="h2" fontSize="xl">
            Се проверува:
          </Heading>

          <VStack gridRowGap="3" py="3">
            {posts.unapproved?.map((post, postI) => (
              <PostPreview data={post} key={post.id} />
            ))}
          </VStack>
        </>
      ) : null}

      {posts.approved?.length ? (
        <>
          <Spacer height="3" />

          <Heading as="h2" fontSize="xl">
            Објавено:
          </Heading>

          <VStack gridRowGap="3" py="3">
            {posts.approved?.map((post, postI) => (
              <PostPreview data={post} key={post.id} />
            ))}
          </VStack>
        </>
      ) : null}

      <Button
        onClick={() => auth.signOut().then(() => history.push('/'))}
        colorScheme="brand_blue"
        mx="auto"
        mt="5"
        d="block"
      >
        Одлогирај се
      </Button>

      <PostButton onClick={() => history.push('/new-post')} />
    </BigContainer>
  );
};

export default Profile;
