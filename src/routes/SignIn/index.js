import React from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  VStack,
  Input,
  Heading,
} from '@chakra-ui/react';

import { auth } from '../../api';

const SignIn = props => {
  const history = useHistory();

  return (
    <>
      <Heading fontSize="xl" fontWeight="semibold" mb="4" py="2">
        Логирајте се
      </Heading>

      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={({ name, email, password }, actions) => {
          (async () => {
            await auth.signInWithEmailAndPassword(email, password);
            actions.setSubmitting(false);
            history.push('/profile');
            props?.closeModal();
          })();
        }}
      >
        {props => (
          <Form>
            <VStack gridGap="3">
              <Field
                name="email"
                validate={value => !value && '* Ова поле е задолжително'}
              >
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.email && form.touched.email}
                    isRequired
                  >
                    <FormLabel htmlFor="email">Email:</FormLabel>
                    <Input
                      {...field}
                      type="email"
                      name="email"
                      placeholder="Email"
                    />
                    <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field
                name="password"
                validate={value => !value && '* Ова поле е задолжително'}
              >
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.password && form.touched.password}
                    isRequired
                  >
                    <FormLabel htmlFor="password">Лозинка:</FormLabel>
                    <Input
                      {...field}
                      type="password"
                      name="password"
                      placeholder="*******"
                    />
                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Button
                type="submit"
                isLoading={props.isSubmitting}
                colorScheme="brand_red"
              >
                Логирај се
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default SignIn;
