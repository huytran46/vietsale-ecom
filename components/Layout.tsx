import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Container,
  HStack,
  VStack,
  Text,
  SimpleGrid,
  Box,
  Center,
  Stack,
  StackDivider,
  Spinner,
  Badge,
  useBoolean,
} from "@chakra-ui/react";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { BiSearchAlt } from "react-icons/bi";
import { TiShoppingCart } from "react-icons/ti";

import { MyImage } from "./common/MyImage";
import { brandRing } from "utils";
import { Button } from "@chakra-ui/button";
import MyLinkOverlay from "./common/MyLinkOverlay";
import { useLayoutCtx } from "context/LayoutProvider";
import { useCartCtx } from "context/CartProvider";
import { useUser } from "context/UserProvider";
import DownloadAppModal from "./DownloadAppModal";

const headerBarHeight = 131;
const highestZIndex = 3;

const MainHeader: React.FC = ({}) => {
  const router = useRouter();
  const { searchKeyword, setSearchKeyword, setGlobalLoadingState } =
    useLayoutCtx();
  const updateKeyword = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchKeyword(event.target.value);
  const { numberOfItems } = useCartCtx();
  const { user, username, logout, shopId } = useUser();
  const [isDownloadMOpen, downloadModalHandler] = useBoolean();

  const updateQueries = React.useCallback(async () => {
    setGlobalLoadingState(true);
    const isLoaded = await router.replace("/products?_q=" + searchKeyword);
    if (isLoaded) {
      setSearchKeyword("");
    }
    setGlobalLoadingState(false);
  }, [searchKeyword, router]);

  return (
    <Box
      // bg="brand.500"
      bgGradient="linear(to-t, brand.300, brand.500)"
      color="white"
      height={headerBarHeight}
      w="full"
      zIndex={highestZIndex}
      py={2}
      boxShadow="lg"
    >
      <Head>
        <title>Việt Sale - Sàn thương mại điện tử</title>
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      <Container maxW="container.xl" h="full">
        <VStack justifyContent="flex-start" spacing={5} h="full" w="full">
          <SimpleGrid flex={1} w="full" columns={2}>
            <HStack
              divider={<StackDivider borderColor="gray.200" />}
              isInline
              spacing="2"
              alignItems="center"
              w="full"
              p="1"
            >
              <DownloadAppModal
                isOpen={isDownloadMOpen}
                onOpen={downloadModalHandler.on}
                onClose={downloadModalHandler.off}
              >
                <Text fontSize="xs" cursor="pointer">
                  Tải ứng dụng
                </Text>
              </DownloadAppModal>
              <MyLinkOverlay fontSize="xs" href="/policy">
                Chính sách bảo mật
              </MyLinkOverlay>

              {(!user || !user.is_merchant) && (
                <MyLinkOverlay fontSize="xs" href="/register/merchant">
                  Trở thành người bán
                </MyLinkOverlay>
              )}

              {shopId && (
                <MyLinkOverlay
                  fontSize="xs"
                  color="yellow"
                  fontWeight="bold"
                  href={`/merchant?shop_id=${shopId}`}
                >
                  Kênh người bán
                </MyLinkOverlay>
              )}
            </HStack>
            <HStack
              isInline
              spacing="4"
              alignItems="center"
              justifyContent="flex-end"
              w="full"
              p="1"
            >
              {/* <Text fontSize="xs">Thông báo</Text> */}
              {/* <Text fontSize="xs">Hỗ trợ</Text> */}
              {!user ? (
                <HStack divider={<StackDivider />}>
                  <MyLinkOverlay href="/register">
                    <Text fontSize="xs">Đăng kí</Text>
                  </MyLinkOverlay>
                  <MyLinkOverlay href="/login">
                    <Text fontSize="xs">Đăng nhập</Text>
                  </MyLinkOverlay>
                </HStack>
              ) : (
                <HStack divider={<StackDivider />} spacing={3}>
                  <MyLinkOverlay fontSize="xs" href="/order">
                    <Text fontSize="xs" color="yellow" fontWeight="bold">
                      Đơn mua
                    </Text>
                  </MyLinkOverlay>
                  {username !== "" && (
                    <Text fontSize="xs">
                      Xin chào, <b>{username}</b>
                    </Text>
                  )}

                  <Text fontSize="xs" cursor="pointer" onClick={logout}>
                    Đăng xuất
                  </Text>
                </HStack>
              )}
            </HStack>
          </SimpleGrid>
          <HStack w="full" flex={3} alignItems="flex-start" spacing={2}>
            <Center flex={1}>
              <MyLinkOverlay href="/">
                <MyImage
                  borderRadius="lg"
                  flex={1}
                  src="/favicon.png"
                  width="64"
                  height="64"
                />
              </MyLinkOverlay>
            </Center>
            <Stack flex={15} direction="column">
              <InputGroup p={0} flex={16}>
                <InputRightElement
                  borderLeftRadius="none"
                  borderRightRadius="md"
                  bg="brand.500"
                  border="3px solid"
                  borderColor="white"
                  cursor="pointer"
                  onClick={updateQueries}
                >
                  <BiSearchAlt />
                </InputRightElement>
                <Input
                  outline="none"
                  variant="filled"
                  boxShadow="sm"
                  placeholder="Nhập từ khóa để tìm kiếm"
                  color="black"
                  bg="white"
                  {...brandRing}
                  type="text"
                  value={searchKeyword}
                  onChange={updateKeyword}
                />
              </InputGroup>
              <HStack spacing={10}>
                <MyLinkOverlay href="/products?_q=quà tặng giáng sinh">
                  <Text fontSize="xs">Quà tặng giáng sinh</Text>
                </MyLinkOverlay>
                <MyLinkOverlay href="/products?_q=voucher xịn">
                  <Text fontSize="xs">Voucher</Text>
                </MyLinkOverlay>
                <MyLinkOverlay href="/products?_q=iphone 13 pro max">
                  <Text fontSize="xs">iPhone 13</Text>
                </MyLinkOverlay>
                <MyLinkOverlay href="/products?_q=macbook air m1">
                  <Text fontSize="xs">Macbook Air M1</Text>
                </MyLinkOverlay>
                <MyLinkOverlay href="/products?_q=imac">
                  <Text fontSize="xs">iMac</Text>
                </MyLinkOverlay>
              </HStack>
            </Stack>
            <Center flex={2}>
              <Button
                disabled={router.asPath === "/cart"}
                _hover={{
                  bgGradient:
                    router.asPath === "/cart"
                      ? "linear(to-l, brand.300, brand.500)"
                      : "inherit",
                }}
                onClick={async () => {
                  await router.push("/cart");
                }}
                fontSize="2xl"
                size="md"
                borderColor="white"
                borderWidth="1px"
                // bgGradient="linear(to-l, brand.100, brand.900)"
                bg="brand.500"
              >
                <TiShoppingCart />
                <Badge bg="red.500" color="white">
                  {numberOfItems}
                </Badge>
              </Button>
            </Center>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

// const b64ImgStr = `url("data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%221440%22%20height%3D%22661.1%22%20viewBox%3D%220%200%201440%20661.1%22%3E%3Cstyle%20type%3D%22text%2Fcss%22%3Ecircle%2C%20ellipse%2C%20line%2C%20path%2C%20polygon%2C%20polyline%2C%20rect%2C%20text%20%7B%20fill%3A%20rgb%280%2C%20128%2C%2096%29%20%21important%3B%20%7D%3C%2Fstyle%3E%3Cpath%20fill%3D%22rgb%280%2C%20128%2C%2096%29%22%20d%3D%22M1440%20488c-19.3%204.3-39.2%208.6-60%2013-174.2%2036.5-228.8%20288-467%2076.2-153.6-136.6-424-22.8-660.4-5.8-130.2%209.3-252.6-75-252.6-75V0h1440%22%2F%3E%3C%2Fsvg%3E")`;

const Layout: React.FC = ({ children }) => {
  const { isGlobalLoading } = useLayoutCtx();
  return (
    <Box
      // bgImage={b64ImgStr}
      // bgImage="url(/highlight-bg.webp)"
      // bgPosition="left"
      // bgColor="rgb(234, 255, 224)"
      // bgRepeat="no-repeat"
      // bgSize="contain"
      // bg="gray.light"
      // bgColor="white"
      bgColor="#f8fff4"
      w="full"
      h="auto"
      minH="100vh"
    >
      <MainHeader />
      <Container maxW="container.xl" h="full" minH="100vh">
        {isGlobalLoading ? (
          <VStack alignItems="center" p={10} w="full" h="100vh">
            <Spinner
              thickness="4px"
              color="brand.500"
              speed="0.6s"
              size="lg"
              emptyColor="gray.300"
            />
          </VStack>
        ) : (
          children
        )}
      </Container>
    </Box>
  );
};

export default Layout;
