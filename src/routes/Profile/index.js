import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  VStack,
  Spacer,
  Text,
  IconButton,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

import BigContainer from '../../components/BigContainer';
import { auth, useCurrentUser, useGetCategory } from '../../api';

const PostPreview = ({ data: { downloadURL, categoryId, title } }) => {
  const [category] = useGetCategory(categoryId);

  return (
    <Box w="100%">
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
            src={downloadURL}
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
            {title}
          </Box>

          <Flex gridColumnGap="2" alignItems="center">
            <Image
              boxSize="20px"
              src={`/${category.id}.svg`}
              alt={`${category.id} category icon`}
            />

            <Text fontSize="sm">{category.short?.toFirstUpperCase()}</Text>
          </Flex>
        </Flex>
      </Flex>

      <Button
        w="100%"
        variant="outline"
        float="right"
        borderTopRadius="0"
        leftIcon={<DeleteIcon />}
      >
        Избриши
      </Button>
    </Box>
  );
};

const Profile = () => {
  const history = useHistory();
  const user = useCurrentUser();

  return (
    <BigContainer>
      <Heading as="h1" textAlign="center" mb="5">
        {user?.displayName}
      </Heading>

      <Heading as="h2" fontSize="xl">
        Се проверува:
      </Heading>

      <VStack gridRowGap="3" py="3">
        <PostPreview
          data={{
            downloadURL:
              'https://firebasestorage.googleapis.com/v0/b/repair-alert.appspot.com/o/-WK7noJyw9oHFTWkROiL1.jpeg?alt=media&token=rtRmg9yRP9Q0yrWkezMHL',
            categoryId: 'road-damage',
            title: 'Objava 2',
          }}
        />
      </VStack>

      <Spacer height="3" />

      <Heading as="h2" fontSize="xl">
        Објавено:
      </Heading>

      <VStack gridRowGap="3" py="3">
        <PostPreview
          data={{
            downloadURL:
              'https://firebasestorage.googleapis.com/v0/b/repair-alert.appspot.com/o/-WK7noJyw9oHFTWkROiL1.jpeg?alt=media&token=rtRmg9yRP9Q0yrWkezMHL',
            categoryId: 'road-damage',
            title: 'Objava 2',
          }}
        />
        <PostPreview
          data={{
            downloadURL:
              'https://firebasestorage.googleapis.com/v0/b/repair-alert.appspot.com/o/-WK7noJyw9oHFTWkROiL1.jpeg?alt=media&token=rtRmg9yRP9Q0yrWkezMHL',
            categoryId: 'road-damage',
            title: 'Objava 2',
          }}
        />
        <PostPreview
          data={{
            downloadURL:
              'https://firebasestorage.googleapis.com/v0/b/repair-alert.appspot.com/o/-WK7noJyw9oHFTWkROiL1.jpeg?alt=media&token=rtRmg9yRP9Q0yrWkezMHL',
            categoryId: 'road-damage',
            title: 'Objava 2',
          }}
        />
      </VStack>

      <Button
        onClick={() => auth.signOut().then(() => history.push('/'))}
        colorScheme="brand_blue"
        mx="auto"
        mt="5"
        d="block"
      >
        Одлогирај се
      </Button>
    </BigContainer>
  );
};

export default Profile;
