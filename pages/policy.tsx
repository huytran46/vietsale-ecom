import React from "react";
import type { NextPage, GetStaticProps } from "next";
import Head from "next/head";
import { Container, HStack, VStack, Text, Box } from "@chakra-ui/react";

import { LayoutType } from "constants/common";
import { DocumentContent } from "components/DocumentContent";
import { MyImage } from "components/common/MyImage";
import MyLinkOverlay from "components/common/MyLinkOverlay";

const Login: NextPage = () => {
  return (
    <>
      <Head>
        <title>Việt Sale - Chính sách bảo mật</title>
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      <HStack
        h="auto"
        w="full"
        borderBottom="1px solid"
        borderBottomColor="gray.400"
      >
        <Container maxW="container.xl" w="full" h="full" px={0}>
          <HStack w="full" justifyContent="flex-start">
            <Box w="full" h="full" d="flex" alignItems="center" p={0}>
              <MyImage width="80px" height="80px" src="/favicon.png" />
              <Text
                as="h1"
                color="brand.500"
                fontWeight="bold"
                textTransform="uppercase"
              >
                Việt Sale
              </Text>
              <MyLinkOverlay
                borderRight="1px solid"
                borderRightColor="gray.400"
                as="h1"
                href="/"
                ml={10}
                pr={10}
              >
                Trang chủ
              </MyLinkOverlay>
              <MyLinkOverlay as="h1" href="/" ml={10}>
                Kênh người bán
              </MyLinkOverlay>
            </Box>
          </HStack>
        </Container>
      </HStack>
      <Container w="full" h="full" maxW="container.xl">
        <VStack p={2} w="full" h="full">
          <Text as="h1" fontSize="3xl">
            CHÍNH SÁCH BẢO MẬT VÀ CHIA SẺ THÔNG TIN
          </Text>
          <Box
            w="full"
            h="full"
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
            m={3}
          >
            <DocumentContent source="/vietsale-privacy.html" />
          </Box>
        </VStack>
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps = () => {
  return {
    props: { layout: LayoutType.NONE },
  };
};

export default Login;
