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
import { useShowError } from '../../utils';

const SignUp = props => {
  const showError = useShowError();
  const history = useHistory();

  return (
    <>
      <Heading fontSize="xl" fontWeight="semibold" mb="4" py="2">
        Регистрирајте се
      </Heading>

      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
        }}
        onSubmit={({ name, email, password }, { setSubmitting }) => {
          (async () => {
            try {
              const { user } = await auth.createUserWithEmailAndPassword(
                email,
                password
              );
              await user.updateProfile({ displayName: name });
              setSubmitting(false);
              history.push('/profile');
              props?.closeModal();
            } catch (e) {
              setSubmitting(false);
              console.error(e);
              showError({ errorCode: e.code });
            }
          })();
        }}
      >
        {props => (
          <Form>
            <VStack gridGap="3">
              <Field
                name="name"
                validate={value => !value && '* Ова поле е задолжително'}
              >
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.name && form.touched.name}
                    isRequired
                  >
                    <FormLabel htmlFor="name">Име:</FormLabel>
                    <Input {...field} name="name" placeholder="Вашето име" />
                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

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
                Регистрирај се
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default SignUp;
