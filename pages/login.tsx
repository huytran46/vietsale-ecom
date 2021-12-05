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

import { useUser } from "context/UserProvider";
import { doLogin, LOGIN_URI } from "services/auth";
import { brandRing } from "utils";
import withSession, { NextSsrIronHandler } from "utils/session";
import { IronSessionKey } from "constants/session";
import { LocalStorageKey } from "constants/local-storage";
import { LayoutType } from "constants/common";

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
  const toast = useToast();
  const { mutate } = useMutation({
    mutationKey: LOGIN_URI,
    mutationFn: doLogin,
  });

  const { visitorId, platform, setUser, setToken } = useUser();

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
            async onSuccess(data) {
              if ((data as any).httpCode || (data as any).error) {
                toast({
                  title: "Lỗi",
                  description: (data as any).message ?? "Đã xảy ra lỗi",
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                });
                return;
              }
              setUser({ email: data?.email, is_merchant: data.is_merchant });
              localStorage.setItem(
                LocalStorageKey.ME,
                JSON.stringify({
                  email: data?.email,
                  is_merchant: data.is_merchant,
                }) ?? ""
              );
              localStorage.setItem(LocalStorageKey.EMAIL, data?.email ?? "");
              // merchant only
              if (data.shops && data.shops.length > 0) {
                const shopInfo = data.shops[0];
                localStorage.setItem(
                  LocalStorageKey.MERCHANT,
                  JSON.stringify(shopInfo ?? "")
                );
              }
              setToken(data.token.access_token);
              actions.resetForm();
              toast({
                title: "Thành công",
                description:
                  "Đăng nhập thành công, vui lòng đợi trong giây lát...",
                status: "success",
                duration: 3000,
                isClosable: true,
              });
              await router.push("/");
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
                Đăng nhập
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

const handler: NextSsrIronHandler = async function ({ req, res }) {
  const auth = req.session.get(IronSessionKey.AUTH);
  if (auth !== undefined) {
    res.setHeader("location", "/");
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  return {
    props: { layout: LayoutType.NONE },
  };
};

export const getServerSideProps: GetServerSideProps = withSession(handler);

export default Login;
