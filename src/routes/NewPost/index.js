import React, { useRef, useState, useEffect } from 'react';
import { Formik, Field, Form } from 'formik';
import {
  forwardRef,
  chakra,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  Box,
  Select,
  Textarea,
  VStack,
  Image,
} from '@chakra-ui/react';
import { AttachmentIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { gps as extractGps } from 'exifr';

import PostButton from '../../components/PostButton';
import GoogleMap, { defaultCenter } from '../../components/GoogleMap';
import { MapPinIcon } from '../../icons';
import storePost from './storePost';

const MotionBox = motion(
  forwardRef((props, ref) => {
    return <chakra.div ref={ref} {...props} />;
  })
);

const AnimatedPin = ({ isScaled, ...props }) => (
  <MotionBox
    animate={{
      y: -isScaled * 5,
      scale: 1 + (isScaled && 0.125),
    }}
    transition={{
      duration: 0.2,
      ease: 'easeInOut',
    }}
    d="flex"
    {...props}
  >
    <MapPinIcon boxSize="100%" />
  </MotionBox>
);

const getDataFromFile = file =>
  new Promise((res, rej) => {
    const reader = new FileReader();

    reader.readAsDataURL(file.slice());

    reader.onloadend = () => {
      res(reader.result);
    };

    reader.onerror = () => {
      rej(reader.error);
      reader.abort();
    };
  });

const NewPost = () => {
  const [isPinScaled, setIsPinScaled] = useState(false);
  const [imageLocation, setImageLocation] = useState(null);
  const imageRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (imageLocation) {
      const latLngObject = {
        lat: imageLocation.latitude,
        lng: imageLocation.longitude,
      };
      mapRef.current.panTo(latLngObject);
    }
  }, [imageLocation]);

  return (
    <Box px="7" maxW="500px" minH="100%" h="100%" pt="16" pb="12" mx="auto">
      <Formik
        initialValues={{
          content: '',
          type: '',
          location: defaultCenter,
          image: null,
        }}
        onSubmit={async (values, actions) => {
          await storePost(values);
          alert(JSON.stringify(values, null, 2));
          actions.setSubmitting(false);
        }}
      >
        {props => (
          <Form>
            <VStack gridGap="3">
              <Field name="image">
                {({ field, form }) => {
                  return field.value ? (
                    <FormControl>
                      <FormLabel>Слика:</FormLabel>
                      <Box
                        h="300px"
                        w="100%"
                        borderRadius="lg"
                        padding="3"
                        bg="#f6f6f6"
                        d="flex"
                        alignItems="center"
                      >
                        <Image
                          src={field.value}
                          maxH="100%"
                          maxW="100%"
                          m="auto"
                          borderRadius="lg"
                        />
                      </Box>
                    </FormControl>
                  ) : (
                    <FormControl w="max-content" mx="auto">
                      <label
                        htmlFor="image"
                        style={{
                          display: 'block',
                          cursor: 'pointer',
                          width: 'max-content',
                        }}
                      >
                        <Button
                          as="div"
                          size="lg"
                          w="max-content"
                          colorScheme="brand_blue"
                          leftIcon={<AttachmentIcon />}
                        >
                          Прикачете слика
                        </Button>
                      </label>
                      <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/png, image/jpeg"
                        style={{ display: 'none' }}
                        onChange={async () => {
                          const currFile = imageRef.current.files[0];

                          form.setFieldValue(
                            'image',
                            await getDataFromFile(currFile)
                          );

                          extractGps(currFile).then(setImageLocation);
                        }}
                        ref={imageRef}
                      />
                    </FormControl>
                  );
                }}
              </Field>
              <Field
                name="type"
                validate={value => !value && '* Ова поле е задолжително'}
              >
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.type && form.touched.type}
                    isRequired
                  >
                    <Select
                      {...field}
                      name="type"
                      placeholder="Вид на проблем"
                      w="max-content"
                      mx="auto"
                    >
                      <option value="road-damage">Оштетување на патот</option>
                      <option value="waste">Депонија / отпад</option>
                    </Select>
                    <FormErrorMessage justifyContent="center">
                      {form.errors.type}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field
                name="content"
                validate={value => !value && '* Ова поле е задолжително'}
              >
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.content && form.touched.content}
                    isRequired
                  >
                    <FormLabel htmlFor="content">Содржина:</FormLabel>
                    <Textarea
                      {...field}
                      name="content"
                      placeholder="Која е содржината на објавата?"
                    />
                    <FormErrorMessage>{form.errors.content}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field>
                {({ field, form }) => (
                  <FormControl>
                    <FormLabel htmlFor="location">Локација:</FormLabel>
                    <Box h="325px" pos="relative" borderRadius="lg">
                      <Box
                        pos="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%) translateY(-100%)"
                        zIndex="1000"
                      >
                        <AnimatedPin
                          boxSize="7"
                          color="brand_red.600"
                          isScaled={isPinScaled}
                        />
                      </Box>

                      <GoogleMap
                        yesIWantToUseGoogleMapApiInternals
                        onGoogleApiLoaded={({ map }) => {
                          mapRef.current = map;
                        }}
                        onChange={({ center }) =>
                          form.setFieldValue('location', center)
                        }
                        onDrag={() => setIsPinScaled(true)}
                        onDragEnd={() => setIsPinScaled(false)}
                      />
                    </Box>
                  </FormControl>
                )}
              </Field>

              <PostButton
                onClick={props.submitForm}
                isLoading={props.isSubmitting}
              />
            </VStack>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default NewPost;
