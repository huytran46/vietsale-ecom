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
} from "@chakra-ui/react";
import { useMutation } from "react-query";

import { useUser } from "context/UserProvider";
import { doLogin, LOGIN_URI } from "services/auth";
import { brandRing } from "utils";
import withSession, { NextSsrIronHandler } from "utils/session";
import { IronSessionKey } from "constants/session";
import { LocalStorageKey } from "constants/local-storage";

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(5, "Tên đăng nhập phải có ít nhất 5 kí tự")
    .max(50, "Tên đăng nhập quá dài")
    .nullable(false)
    .required("Không thể thiếu tên đăng nhập"),
  password: Yup.string()
    .min(5, "Mật khẩu phải có ít nhất 5 kí tự")
    .nullable(false)
    .required("Không thể thiếu mật khẩu"),
});

type LoginPayload = {
  username: string;
  password: string;
};

const Login: NextPage = () => {
  const router = useRouter();
  const { mutate } = useMutation({
    mutationKey: LOGIN_URI,
    mutationFn: doLogin,
  });

  const { visitorId, platform, setUser } = useUser();

  const { handleSubmit, values, errors, touched, handleChange, isSubmitting } =
    useFormik<LoginPayload>({
      initialValues: {
        username: "",
        password: "",
      },
      validationSchema: LoginSchema,
      onSubmit: ({ username, password }, actions) => {
        actions.setSubmitting(true);
        mutate(
          {
            username,
            password,
            deviceModel: `${visitorId}|${platform}`,
            fcm: visitorId,
          },
          {
            onSettled() {
              actions.setSubmitting(false);
            },
            onSuccess(data) {
              setUser({ email: data?.email });
              localStorage.setItem(LocalStorageKey.EMAIL, data?.email ?? "");
              actions.resetForm();
              router.push("/");
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
            minH="400px"
            bg="white"
            boxShadow="xl"
            p={6}
            py={0}
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
              onSubmit={handleSubmit}
            >
              <FormControl id="username">
                <FormLabel>Tên đăng nhập</FormLabel>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  {...brandRing}
                />
                <FormHelperText fontSize="xs" color="red.400">
                  {touched.username && errors.username}
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
              <Button
                mt={3}
                bg="red.500"
                disabled={isSubmitting}
                borderColor="red.700"
                _focus={{
                  ringColor: "red.200",
                }}
                _active={{
                  ringColor: "red.200",
                }}
                type="submit"
              >
                Đăng nhập
              </Button>
            </chakra.form>
            <VStack h="full" w="full">
              <Text fontSize="xl" fontWeight="medium">
                Tạo tài khoản
              </Text>
            </VStack>
          </HStack>
        </Center>
      </Container>
    </Box>
  );
};

const handler: NextSsrIronHandler = async function ({ req, res }) {
  const auth = req.session.get(IronSessionKey.AUTH);
  if (auth !== undefined) {
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

export default Login;
