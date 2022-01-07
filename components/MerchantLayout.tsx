import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Container,
  HStack,
  VStack,
  Text,
  Icon,
  Box,
  List,
  ListItem,
} from "@chakra-ui/react";
import { MdKeyboardBackspace } from "react-icons/md";

import MyLinkOverlay from "./common/MyLinkOverlay";
import { useUser } from "context/UserProvider";
import { MyImage } from "./common/MyImage";

const SIDEBAR_WIDTH = "240px";
const TOPBAR_HEIGHT = "80px";
const TOPBAR_ZINDEX = 2;
const SIDEBAR_ZINDEX = 1;

type NavItemP = {
  label: string;
  path: string;
};

const NavItem: React.FC<NavItemP> = ({ label, path }) => {
  const router = useRouter();
  const isActive = router.asPath.includes(path);
  return (
    <ListItem
      d="flex"
      alignItems="center"
      p={2}
      pl={6}
      fontSize="sm"
      fontWeight={isActive ? "bold" : "normal"}
      color={isActive ? "brand.700" : ""}
      onClick={() => router.push(path)}
      cursor="pointer"
    >
      {label}
    </ListItem>
  );
};

const TopBar: React.FC = () => {
  return (
    <HStack
      position="fixed"
      top="0"
      left="0"
      h={TOPBAR_HEIGHT}
      w="full"
      bg="white"
      boxShadow="md"
      zIndex={TOPBAR_ZINDEX}
    >
      <Head>
        <title>Việt Sale - Kênh dành cho người bán</title>
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      {/* <MyLinkOverlay href="/" fontSize="xx-large" p={3} cursor="pointer">
        <Icon as={MdKeyboardBackspace} />
      </MyLinkOverlay> */}
      <Box w="full" h="full" d="flex" alignItems="center" p={0}>
        <MyLinkOverlay href="/" ml={10} pr={10}>
          <MyImage width="80px" height="80px" src="/favicon.png" />
        </MyLinkOverlay>
        <Text
          as="h1"
          color="brand.500"
          fontWeight="bold"
          textTransform="uppercase"
        >
          Việt Sale - Kênh người bán
        </Text>
        <MyLinkOverlay as="h1" href="/" ml={10} pr={10}>
          Trang chủ
        </MyLinkOverlay>
      </Box>
    </HStack>
  );
};

const AsideBar: React.FC = () => {
  const { shopId } = useUser();
  return (
    <VStack
      position="fixed"
      h="100vh"
      w={SIDEBAR_WIDTH}
      bg="white"
      zIndex={SIDEBAR_ZINDEX}
    >
      <List spacing={0} w="full" pt={10}>
        <Text mt={10} p={3} pb={1} fontWeight="bold" fontSize="sm">
          Quản lý sản phẩm
        </Text>
        <NavItem
          label="Tất cả sản phẩm"
          path={`/merchant/products?shop_id=${shopId}`}
        />
        <NavItem
          label="Thêm sản phẩm"
          path={`/merchant/products/add?shop_id=${shopId}`}
        />
        <Text mt={1} p={3} pb={1} fontWeight="bold" fontSize="sm">
          Quản lý đơn hàng
        </Text>
        <NavItem label="Tất cả" path={`/merchant/orders?shop_id=${shopId}`} />
        <Text mt={1} p={3} pb={1} fontWeight="bold" fontSize="sm">
          Quản lý phương tiện
        </Text>
        <NavItem label="Tất cả" path={`/merchant/files?shop_id=${shopId}`} />
      </List>
    </VStack>
  );
};

const MerchantLayout: React.FC = ({ children }) => {
  return (
    <VStack w="full">
      <TopBar />
      <HStack
        bg="gray.light"
        minH="100vh"
        w="full"
        h="auto"
        alignItems="flex-start"
      >
        <Head>
          <title>Việt Sale - Kênh bán hàng</title>
        </Head>
        <AsideBar />
        <Box
          pt={TOPBAR_HEIGHT}
          pl={SIDEBAR_WIDTH}
          minH="100vh"
          h="full"
          w="full"
        >
          <Container pt={10} maxW="container.xl">
            {children}
          </Container>
        </Box>
      </HStack>
    </VStack>
  );
};

export default MerchantLayout;
