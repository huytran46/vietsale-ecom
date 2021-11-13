import React from "react";
import type { NextPage } from "next";
import {
  VStack,
  Box,
  Text,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tabs,
  TabList,
  Tab,
  InputGroup,
  InputLeftAddon,
  Input,
  Select,
} from "@chakra-ui/react";
import { dehydrate, QueryClient, useQuery } from "react-query";

import withSession, { NextSsrIronHandler } from "utils/session";
import { IronSessionKey } from "constants/session";
import { LayoutType } from "constants/common";
import {
  fetchShopProductsForMerch,
  FETCH_SHOP_PRODUCTS_MERCH,
} from "services/merchant";

const selectStyle = {
  _selected: {
    borderColor: "gray.300",
    borderBottomColor: "white",
    boxShadow: "none",
  },
};

const ProductRow: React.FC = ({}) => {
  return (
    <Tr>
      <Td>STT</Td>
      <Td>inches</Td>
      <Td>millimetres (mm)</Td>
      <Td isNumeric>25.4</Td>
      <Td isNumeric>25.4</Td>
      <Td isNumeric>25.4</Td>
    </Tr>
  );
};

const TabMode: Record<number, string> = {
  0: "pending",
  1: "approved",
  2: "blocked",
};

const MerchantProducts: NextPage = () => {
  const [mode, setMode] = React.useState<number>(0);
  const handleTabChange = React.useCallback(
    (tabIdx: number) => setMode(tabIdx),
    []
  );

  return (
    <VStack
      bg="white"
      h="fit-content"
      alignItems="flex-start"
      w="full"
      spacing={6}
      p={6}
      boxShadow="md"
    >
      <HStack w="full">
        <Tabs
          size="sm"
          colorScheme="brand"
          w="full"
          variant="enclosed"
          onChange={handleTabChange}
          index={mode}
        >
          <TabList>
            <Tab {...selectStyle}>Chờ duyệt</Tab>
            <Tab {...selectStyle}>Đã duyệt</Tab>
            <Tab {...selectStyle}>Đã bị chặn</Tab>
          </TabList>
        </Tabs>
      </HStack>
      <HStack>
        <InputGroup size="sm" minW="500px">
          <InputLeftAddon p={0} borderWidth={0} borderLeftRadius="md">
            <Select
              size="sm"
              w="full"
              focusBorderColor="none"
              borderRightWidth={0}
              borderLeftRadius="md"
              defaultValue="option1"
            >
              <option value="option1">Tên sản phẩm</option>
              <option value="option2">SKU</option>
            </Select>
          </InputLeftAddon>
          <Input
            focusBorderColor="none"
            borderRightRadius="md"
            colorScheme="brand"
            variant="outline"
            placeholder="Tìm kiếm"
          />
        </InputGroup>
      </HStack>

      <Table variant="striped" colorScheme="gray" size="sm">
        <Thead>
          <Tr>
            <Th>STT</Th>
            <Th>Tên sản phẩm</Th>
            <Th>SKU</Th>
            <Th>Giá</Th>
            <Th>Kho hàng</Th>
            <Th>Đã bán</Th>
          </Tr>
        </Thead>
        <Tbody></Tbody>
      </Table>
    </VStack>
  );
};

const handler: NextSsrIronHandler = async function ({ req, res, query }) {
  const auth = req.session.get(IronSessionKey.AUTH);
  const { shop_id } = query;
  if (auth === undefined || !shop_id || shop_id === "") {
    res.setHeader("location", "/");
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    [FETCH_SHOP_PRODUCTS_MERCH, auth, shop_id as string],
    ({ queryKey }) => fetchShopProductsForMerch(queryKey[1], queryKey[2])
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      layout: LayoutType.MERCH,
    },
  };
};

export const getServerSideProps = withSession(handler);

export default MerchantProducts;
