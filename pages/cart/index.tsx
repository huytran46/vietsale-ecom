import React from "react";
import type { NextPage } from "next";
import {
  VStack,
  Grid,
  GridItem,
  Text,
  Box,
  CheckboxGroup,
  Checkbox,
  HStack,
  Flex,
  Spacer,
  StackDivider,
  Divider,
  Button,
} from "@chakra-ui/react";
import { dehydrate, QueryClient, useQuery } from "react-query";

import { fetchCartInfo, FETCH_CART_URI } from "services/cart";
import Empty from "components/common/Empty";
import withSession, { NextSsrIronHandler } from "utils/session";
import { IronSessionKey } from "constants/session";
import CartItem from "components/Cart/CartItem";
import { useCartCtx } from "context/CartProvider";
import { useUser } from "context/UserProvider";
import MyLinkOverlay from "components/common/MyLinkOverlay";

const Cart: NextPage = () => {
  const { data: cartInfo, isLoading } = useQuery(FETCH_CART_URI, () =>
    fetchCartInfo()
  );
  const { setCartInfo } = useCartCtx();
  const { defaultAddress, fullDetailAddress, fetchUserAddresses } = useUser();
  const cartItemGroups = React.useMemo(() => {
    return cartInfo?.cart_item_groups ?? [];
  }, [cartInfo]);

  React.useEffect(() => {
    if (!cartInfo) return;
    setCartInfo(cartInfo);
  }, [cartInfo, setCartInfo]);

  React.useEffect(() => {
    if (defaultAddress) return;
    fetchUserAddresses();
  }, [defaultAddress, fetchUserAddresses]);

  if (isLoading)
    return (
      <Box p={3} m={3}>
        Đang tải...
      </Box>
    );

  if (!cartInfo) return <Empty />;

  return (
    <VStack
      h="fit-content"
      alignItems="flex-start"
      w="full"
      spacing={6}
      py={16}
    >
      <Text fontSize="lg" textTransform="uppercase" fontWeight="medium">
        Giỏ hàng
      </Text>
      <Grid w="full" templateColumns="repeat(8, 1fr)" gap={4}>
        <GridItem colSpan={6}>
          <VStack w="full" spacing={10}>
            {cartItemGroups?.map((gr, idx) => (
              <CheckboxGroup key={idx} colorScheme="brand">
                <VStack
                  bg="white"
                  borderColor="gray.100"
                  borderWidth="1px"
                  borderRadius="md"
                  alignItems="flex-start"
                  w="full"
                >
                  <HStack
                    p={3}
                    borderBottomColor="gray.100"
                    borderBottomWidth="1px"
                    borderTopRadius="md"
                    w="full"
                  >
                    <Checkbox value="" />
                    <Text fontWeight="700" fontSize="sm">
                      {gr.shop_name}
                    </Text>
                  </HStack>
                  {gr.cart_items.map((item, idx) => (
                    <CartItem
                      key={idx}
                      rounded={idx === gr.cart_items.length - 1}
                      cartItem={item}
                    />
                  ))}
                </VStack>
              </CheckboxGroup>
            ))}
            {cartItemGroups.length === 0 && (
              <Box w="full" bg="red.500">
                <Empty>
                  <Text>
                    Không có món hàng nào trong giỏ hàng. Xem thêm sản phẩm
                    tại&nbsp;
                    <MyLinkOverlay href="/products" color="brand.500">
                      đây
                    </MyLinkOverlay>
                  </Text>
                </Empty>
              </Box>
            )}
          </VStack>
        </GridItem>
        <GridItem colSpan={2}>
          <VStack spacing={3}>
            {defaultAddress && (
              <Box
                d="flex"
                flexDir="column"
                alignItems="flex-start"
                p={3}
                w="full"
                bg="white"
                borderRadius="md"
                gridGap={2}
              >
                <Flex w="full">
                  <Text fontSize="sm" fontWeight="medium">
                    Giao tới
                  </Text>
                  <Spacer />
                  <Text fontSize="sm" fontWeight="medium" color="brand.500">
                    Thay đổi
                  </Text>
                </Flex>
                <HStack divider={<StackDivider />}>
                  <Text fontSize="sm" fontWeight="medium">
                    {defaultAddress.fullname}
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {defaultAddress.phone}
                  </Text>
                </HStack>
                <HStack divider={<StackDivider />}>
                  <Text fontSize="xs" color="gray.500">
                    {fullDetailAddress}
                  </Text>
                </HStack>
              </Box>
            )}
            <Box
              d="flex"
              flexDir="column"
              alignItems="flex-start"
              p={3}
              w="full"
              bg="white"
              borderRadius="md"
              borderWidth="1px"
              borderColor="gray.200"
              gridGap={2}
            >
              <Flex w="full">
                <Text fontSize="sm" fontWeight="medium">
                  Tạm tính
                </Text>
                <Spacer />
                <Text fontSize="sm">0đ</Text>
              </Flex>
              <Flex w="full">
                <Text fontSize="sm" fontWeight="medium">
                  Giảm giá
                </Text>
                <Spacer />
                <Text fontSize="sm">0đ</Text>
              </Flex>
              <Divider />
              <VStack spacing={0} alignItems="flex-end" w="full">
                <Flex w="full">
                  <Text fontSize="sm" fontWeight="medium">
                    Tổng cộng
                  </Text>
                  <Spacer />
                  <Text color="brand.500" fontSize="sm">
                    Vui lòng chọn sản phẩm
                  </Text>
                </Flex>
                <Text color="gray.400" fontSize="xs">
                  (Đã bao gồm VAT nếu có)
                </Text>
              </VStack>
              <Button size="sm" borderColor="red.700" bg="red.500" w="full">
                Mua hàng
              </Button>
            </Box>
          </VStack>
        </GridItem>
      </Grid>
    </VStack>
  );
};

const handler: NextSsrIronHandler = async function ({ req, res }) {
  const auth = req.session.get(IronSessionKey.AUTH);
  if (auth === undefined) {
    res.setHeader("location", "/cart/need-login");
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(FETCH_CART_URI, () => fetchCartInfo());
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
export const getServerSideProps = withSession(handler);

export default Cart;
