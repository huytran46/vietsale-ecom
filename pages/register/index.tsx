import React from "react";
import type { NextPage, GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  chakra,
  Container,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Center,
  HStack,
  StackDivider,
  VStack,
  Text,
  Box,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "react-query";

import { doRegister, REGISTER_URI } from "services/auth";
import { brandRing } from "utils";
import withSession, { NextSsrIronHandler } from "utils/session";
import { IronSessionKey } from "constants/session";
import { RegisterPayload } from "models/request-response/Login";

const RegisterSchema = Yup.object().shape({
  phone: Yup.string()
    .min(5, "Tên số điện thoại phải có ít nhất 5 kí tự")
    .max(50, "Tên số điện thoại quá dài")
    .nullable(false)
    .required("Không thể thiếu số điện thoại"),
  email: Yup.string()
    .min(5, "Tên email phải có ít nhất 5 kí tự")
    .max(50, "Tên email quá dài")
    .nullable(false)
    .matches(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Email không hợp lệ"
    )
    .required("Không thể thiếu tên email"),
  password: Yup.string()
    .min(5, "Mật khẩu phải có ít nhất 5 kí tự")
    .nullable(false)
    .required("Không thể thiếu mật khẩu"),
  confirmed: Yup.string()
    .min(5, "Mật khẩu phải có ít nhất 5 kí tự")
    .nullable(false)
    .required("Không thể thiếu mật khẩu")
    .oneOf([Yup.ref("password"), null], "Mật khẩu nhập lại không đúng"),
});

const Register: NextPage = () => {
  const router = useRouter();

  const toast = useToast();
  const { mutate } = useMutation({
    mutationKey: REGISTER_URI,
    mutationFn: doRegister,
  });

  const { handleSubmit, values, errors, touched, handleChange, isSubmitting } =
    useFormik<RegisterPayload>({
      initialValues: {
        phone: "",
        email: "",
        password: "",
        confirmed: "",
      },
      validationSchema: RegisterSchema,
      onSubmit: ({ phone, email, password, confirmed }, actions) => {
        actions.setSubmitting(true);
        mutate(
          {
            phone,
            email,
            password,
            confirmed,
          },
          {
            onSettled() {
              actions.setSubmitting(false);
            },
            async onSuccess(resp) {
              if ((resp as any).httpCode) {
                toast({
                  status: "error",
                  duration: 5000,
                  isClosable: true,
                  description:
                    ((resp as any).message as string) ?? "Đã xảy ra lỗi",
                  title: "Lỗi",
                });
                return;
              }
              actions.resetForm();
              toast({
                status: "success",
                duration: 2000,
                isClosable: true,
                description:
                  "Tạo tài khoản thành công, vui lòng chờ trong giây lát...",
                title: "Thành công",
              });
              await router.push("/login");
            },
          }
        );
      },
    });

  return (
    <Box
      position="relative"
      overflow="hidden"
      _before={{
        content: "''",
        position: "absolute",
        top: 0,
        left: 0,
        bg: "brand.500",
        w: "50%",
        h: "100%",
        zIndex: -1,
      }}
      w="full"
      h="full"
    >
      <Container h="full">
        <Center w="full" h="full">
          <HStack
            w="full"
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="md"
            // minH="500px"
            bg="white"
            boxShadow="xl"
            p={6}
            divider={<StackDivider />}
            zIndex={2}
          >
            <chakra.form
              d="flex"
              gridGap={3}
              flexDir="column"
              w="full"
              h="full"
              maxW="320px"
              pr={3}
              onSubmit={handleSubmit}
            >
              <FormControl id="phone">
                <FormLabel>Số điện thoại</FormLabel>
                <Input
                  type="text"
                  id="phone"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  {...brandRing}
                />
                <FormHelperText fontSize="xs" color="red.400">
                  {touched.phone && errors.phone}
                </FormHelperText>
              </FormControl>
              <FormControl id="email">
                <FormLabel>Email</FormLabel>
                <Input
                  type="text"
                  id="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  {...brandRing}
                />
                <FormHelperText fontSize="xs" color="red.400">
                  {touched.email && errors.email}
                </FormHelperText>
              </FormControl>
              <FormControl id="password">
                <FormLabel>Mật khẩu</FormLabel>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  {...brandRing}
                />
                <FormHelperText fontSize="xs" color="red.400">
                  {touched.password && errors.password}
                </FormHelperText>
              </FormControl>
              <FormControl id="confirmed">
                <FormLabel>Nhập lại mật khẩu</FormLabel>
                <Input
                  type="password"
                  id="confirmed"
                  name="confirmed"
                  value={values.confirmed}
                  onChange={handleChange}
                  {...brandRing}
                />
                <FormHelperText fontSize="xs" color="red.400">
                  {touched.confirmed && errors.confirmed}
                </FormHelperText>
              </FormControl>
              <Button
                mt={3}
                bg="red.500"
                disabled={isSubmitting}
                borderColor="red.700"
                _focus={{
                  ringColor: "red.200",
                  bg: "red.600",
                }}
                _active={{
                  ringColor: "red.200",
                  bg: "red.600",
                }}
                _hover={{
                  ringColor: "red.200",
                  bg: "red.600",
                }}
                type="submit"
              >
                Tạo tài khoản
              </Button>
            </chakra.form>
            <VStack h="full" w="full">
              <Text fontSize="xl" color="brand.500" fontWeight="medium">
                Việt Sale
              </Text>
            </VStack>
          </HStack>
        </Center>
      </Container>
    </Box>
  );
};

const handler: NextSsrIronHandler = async function ({ req, res, query }) {
  const { type } = query;
  const auth = req.session.get(IronSessionKey.AUTH);
  if (auth !== undefined && !type) {
    res.setHeader("location", "/");
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  return {
    props: { noLayout: true },
  };
};

export const getServerSideProps: GetServerSideProps = withSession(handler);

export default Register;
