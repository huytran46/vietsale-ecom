import React from "react";
import type { NextPage } from "next";
import {
  VStack,
  Box,
  Text,
  HStack,
  Tab,
  Tabs,
  TabList,
  List,
  ListItem,
} from "@chakra-ui/react";
import { dehydrate, QueryClient, useQuery } from "react-query";

import withSession, { NextSsrIronHandler } from "utils/session";
import { IronSessionKey } from "constants/session";
import { LayoutType } from "constants/common";

const MerchantHome: NextPage = () => {
  return (
    <VStack h="fit-content" alignItems="flex-start" w="full" spacing={6} py={6}>
      <Text w="full" fontSize="lg" fontWeight="bold" textTransform="uppercase">
        Quản lý đơn mua
      </Text>
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
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      layout: LayoutType.MERCH,
    },
  };
};

export const getServerSideProps = withSession(handler);

export default MerchantHome;
