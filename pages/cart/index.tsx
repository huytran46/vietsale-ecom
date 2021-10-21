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
} from "@chakra-ui/react";
import { dehydrate, QueryClient, useQuery } from "react-query";

import { fetchCartInfo, FETCH_CART_URI } from "services/cart";
import Empty from "components/common/Empty";
import withSession, { NextSsrIronHandler } from "utils/session";
import { IronSessionKey } from "constants/session";
import CartItem from "components/Cart/CartItem";
import { useCartCtx } from "context/CartProvider";

const Cart: NextPage = () => {
  const { data: cartInfo, isLoading } = useQuery(FETCH_CART_URI, () =>
    fetchCartInfo()
  );
  const {} = useCartCtx();
  const cartItemGroups = React.useMemo(() => {
    return cartInfo?.cart_item_groups ?? [];
  }, [cartInfo]);

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
      <Grid w="full" templateColumns="repeat(6, 1fr)" gap={4}>
        <GridItem colSpan={4}>
          <VStack w="full" spacing={10}>
            {cartItemGroups?.map((gr, idx) => (
              <CheckboxGroup key={idx} colorScheme="brand">
                <VStack
                  bg="white"
                  borderColor="gray.200"
                  borderWidth="1px"
                  borderRadius="md"
                  alignItems="flex-start"
                  w="full"
                >
                  <HStack
                    p={3}
                    borderBottomColor="gray.200"
                    borderBottomWidth="1px"
                    borderTopRadius="md"
                    w="full"
                    bg="gray.light"
                  >
                    <Checkbox value="" />
                    <Text fontWeight="700" fontSize="sm">
                      {gr.shop_name}
                    </Text>
                  </HStack>
                  {gr.cart_items.map((item, idx) => (
                    <CartItem key={idx} cartItem={item} />
                  ))}
                </VStack>
              </CheckboxGroup>
            ))}
          </VStack>
        </GridItem>
        <GridItem colSpan={2} bg="papayawhip" />
      </Grid>
    </VStack>
  );
};

const handler: NextSsrIronHandler = async function ({ req, res }) {
  const auth = req.session.get(IronSessionKey.AUTH);
  if (auth === undefined) {
    res.setHeader("location", "/login");
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
