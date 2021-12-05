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
import { LayoutType } from "constants/common";

const MerchantRegisterSchema = Yup.object().shape({
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
  shopName: Yup.string()
    .min(5, "Địa chỉ phải có ít nhất 5 kí tự")
    .nullable(false)
    .required("Không thể thiếu tên cửa hàng"),
  shopAddress: Yup.string()
    .min(5, "Địa chỉ phải có ít nhất 5 kí tự")
    .nullable(false)
    .required("Không thể địa chỉ cửa hàng"),
});

const MerchantRegister: NextPage = () => {
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
        shopName: "",
        shopAddress: "",
      },
      validationSchema: MerchantRegisterSchema,
      onSubmit: ({ phone, email, shopName, shopAddress }, actions) => {
        actions.setSubmitting(true);
        mutate(
          {
            phone,
            email,
            shopName,
            shopAddress,
            isRegisterForBusiness: true,
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
                duration: 4000,
                isClosable: true,
                description:
                  "Đăng kí bán hàng thành công, nhân viên Việt Sale sẽ liên hệ với đối tác sớm nhất có thể. Trân trọng cám ơn",
                title: "Thành công",
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
              <FormControl id="shopName">
                <FormLabel>Tên cửa hàng</FormLabel>
                <Input
                  type="text"
                  id="shopName"
                  name="shopName"
                  value={values.shopName}
                  onChange={handleChange}
                  {...brandRing}
                />
                <FormHelperText fontSize="xs" color="red.400">
                  {touched.shopName && errors.shopName}
                </FormHelperText>
              </FormControl>
              <FormControl id="shopAddress">
                <FormLabel>Địa chỉ cửa hàng</FormLabel>
                <Input
                  type="text"
                  id="shopAddress"
                  name="shopAddress"
                  value={values.shopAddress}
                  onChange={handleChange}
                  {...brandRing}
                />
                <FormHelperText fontSize="xs" color="red.400">
                  {touched.shopAddress && errors.shopAddress}
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
                Đăng kí bán hàng
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

const handler: NextSsrIronHandler = async function () {
  return {
    props: { layout: LayoutType.NONE },
  };
};

export const getServerSideProps: GetServerSideProps = withSession(handler);

export default MerchantRegister;
