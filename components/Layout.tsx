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
      bgGradient="linear(to-b, brand.700, brand.300)"
      color="white"
      height={headerBarHeight}
      // position="fixed"
      // top={0}
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
                <MyImage flex={1} src="/favicon.png" width="60" height="60" />
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
                borderColor="brand.700"
                bgGradient="linear(to-l, brand.300, brand.500)"
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

const Layout: React.FC = ({ children }) => {
  const { isGlobalLoading } = useLayoutCtx();
  return (
    <Box bg="gray.light" w="full" h="auto">
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
