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
  Center,
  Spinner,
  Badge,
} from "@chakra-ui/react";
import { dehydrate, QueryClient, useQuery } from "react-query";
import moment from "moment";

import withSession, { NextSsrIronHandler } from "utils/session";
import { IronSessionKey } from "constants/session";
import { LayoutType } from "constants/common";
import {
  fetchShopOrdersForMerch,
  FETCH_SHOP_ORDERS_MERCH,
} from "services/merchant";
import { formatCcy } from "utils";
import Pagination from "components/Pagination";
import { Order, OrderStatusMapLang } from "models/Order";
import Empty from "components/common/Empty";

const selectStyle = {
  _selected: {
    borderColor: "gray.300",
    borderBottomColor: "white",
    boxShadow: "none",
  },
};

const OrderRow: React.FC<{ order: Order }> = ({ order }) => {
  return (
    <Tr>
      <Td>{order.code}</Td>
      <Td>
        <Badge p={1} colorScheme={OrderStatusMapLang[order.status].color}>
          {OrderStatusMapLang[order.status].label}
        </Badge>
      </Td>
      <Td>{formatCcy(order.total_price, true)}</Td>
      <Td>{moment(order.created_at).format("HH:mm:ss DD/MM/YYYY")}</Td>
      <Td>{moment(order.updated_at).format("HH:mm:ss DD/MM/YYYY")}</Td>
    </Tr>
  );
};

const MerchantOrders: NextPage<{ token: string; shopId: string }> = ({
  token,
  shopId,
}) => {
  const [currentItems, setCurrentItems] = React.useState<Order[]>([]);
  const [mode, setMode] = React.useState<number>(0);
  const handleTabChange = React.useCallback(
    (tabIdx: number) => setMode(tabIdx),
    []
  );
  const {
    data: response,
    isLoading,
    isFetching,
    isRefetching,
  } = useQuery({
    queryKey: [FETCH_SHOP_ORDERS_MERCH, token, shopId],
    queryFn: ({ queryKey }) =>
      fetchShopOrdersForMerch(queryKey[1], queryKey[2]),
  });

  const orders = React.useMemo(
    () => response?.data.orders ?? [],
    [response?.data.orders]
  );

  const isOrdersLoading = React.useMemo(
    () => isLoading || isFetching || isRefetching || !orders,
    [orders, isLoading, isFetching, isRefetching]
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
            <Tab {...selectStyle}>Chờ lấy hàng</Tab>
            <Tab {...selectStyle}>Đang giao</Tab>
            <Tab {...selectStyle}>Đã giao</Tab>
            <Tab {...selectStyle}>Đã huỷ</Tab>
            <Tab {...selectStyle}>Đã hoàn trả</Tab>
            <Tab {...selectStyle}>Giao thất bại</Tab>
          </TabList>
        </Tabs>
      </HStack>
      {isOrdersLoading && (
        <Center w="full">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="md"
          />
        </Center>
      )}
      <Table variant="striped" colorScheme="gray" size="sm">
        <Thead>
          <Tr>
            <Th>Mã đơn</Th>
            <Th>Trạng thái</Th>
            <Th>Tổng giá</Th>
            <Th>Ngày tạo</Th>
            <Th>Lần chỉnh sửa gần nhất</Th>
          </Tr>
        </Thead>
        <Tbody>
          {!isOrdersLoading &&
            orders?.map((o, idx) => <OrderRow key={idx} order={o} />)}
        </Tbody>
      </Table>
      {!isOrdersLoading && orders && orders.length < 1 && <Empty />}

      {orders && orders.length > 0 && (
        <Pagination
          items={orders}
          itemPerPage={20}
          setCurrentItems={setCurrentItems}
        />
      )}
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
    [FETCH_SHOP_ORDERS_MERCH, auth, shop_id as string],
    ({ queryKey }) => fetchShopOrdersForMerch(queryKey[1], queryKey[2])
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      layout: LayoutType.MERCH,
      token: auth,
      shopId: shop_id,
    },
  };
};

export const getServerSideProps = withSession(handler);

export default MerchantOrders;
