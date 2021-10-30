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
  Progress,
} from "@chakra-ui/react";
import { dehydrate, QueryClient, useQuery } from "react-query";

import { fetchCartInfo, FETCH_CART_URI } from "services/cart";
import withSession, { NextSsrIronHandler } from "utils/session";
import { IronSessionKey } from "constants/session";
import { CheckoutItem } from "models/Cart";

const Precheckout: NextPage = () => {
  return (
    <VStack
      h="fit-content"
      alignItems="flex-start"
      w="full"
      spacing={6}
      py={16}
    >
      <VStack w="full">
        <Progress w="full" hasStripe value={50} />
        <HStack w="full">
          <Text color="brand.700" fontSize="xs" maxW="100px">
            Chọn phương thức thanh toán
          </Text>
          <Spacer />
          <Text color="gray.500" textAlign="right" fontSize="xs" maxW="100px">
            Xác nhận đơn hàng
          </Text>
        </HStack>
      </VStack>
      <Text fontSize="xl" textTransform="uppercase" fontWeight="bold">
        Chọn phương thức thanh toán
      </Text>
    </VStack>
  );
};

const handler: NextSsrIronHandler = async function ({ req, res, query }) {
  const auth = req.session.get(IronSessionKey.AUTH);
  if (auth === undefined) {
    res.setHeader("location", "/cart/need-login");
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  const checkoutItems: Array<CheckoutItem | undefined> = Object.entries(
    query
  ).map((entry) => {
    if (!entry[0] || !entry[1]) return;
    return {
      shopID: entry[0],
      cartItemIDs: [entry[1]].flat(),
    };
  });

  const isInvalid = checkoutItems.indexOf(undefined) > -1;
  if (isInvalid) {
    res.setHeader("location", "/cart");
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

export default Precheckout;
