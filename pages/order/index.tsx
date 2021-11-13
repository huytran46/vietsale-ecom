import React from "react";
import type { NextPage } from "next";
import {
  VStack,
  Box,
  Text,
  Tab,
  Tabs,
  TabList,
  List,
  ListItem,
} from "@chakra-ui/react";
import { dehydrate, QueryClient, useQuery } from "react-query";

import withSession, { NextSsrIronHandler } from "utils/session";
import { IronSessionKey } from "constants/session";
import { fetchOrders, FETCH_ORDERS_URI } from "services/order";
import Empty from "components/common/Empty";
import { OrderStatus, OrderStatusesArr } from "models/Order";
import OrderItem from "components/Order/OrderItem";

const selectStyle = {
  _selected: {
    borderColor: "gray.300",
    borderBottomColor: "white",
    boxShadow: "none",
  },
};

const Orders: NextPage = () => {
  const [orderStatus, setOrderStatus] = React.useState<OrderStatus>(
    OrderStatus.PENDING
  );

  const {
    data: orders,
    isLoading,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: [FETCH_ORDERS_URI, orderStatus],
    queryFn: ({ queryKey }) => fetchOrders(queryKey[1] as OrderStatus),
  });

  const handleTabChange = React.useCallback(
    (tabIdx: number) => setOrderStatus(OrderStatusesArr[tabIdx]),
    [setOrderStatus]
  );

  const isItemLoading = React.useMemo(
    () => isLoading || !orders,
    [isLoading, orders]
  );

  React.useEffect(() => {
    refetchOrders();
  }, [orderStatus, refetchOrders]);

  return (
    <VStack h="fit-content" alignItems="flex-start" w="full" spacing={6} py={6}>
      <Text w="full" fontSize="lg" fontWeight="bold" textTransform="uppercase">
        Quản lý đơn mua
      </Text>
      <VStack minH="500px" p={3} bg="white" w="full" spacing={6}>
        <Tabs
          size="sm"
          colorScheme="brand"
          w="full"
          variant="enclosed"
          onChange={handleTabChange}
          index={OrderStatusesArr.indexOf(orderStatus)}
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
        {isItemLoading && (
          <Box p={6} w="full" m={6}>
            <Text>Đang tải...</Text>
          </Box>
        )}
        {!isItemLoading && (
          <List w="full" spacing={3}>
            {orders?.map((ord, idx) => (
              <ListItem key={idx}>
                <OrderItem order={ord} />
              </ListItem>
            ))}
            {(orders?.length ?? 0) < 1 && (
              <ListItem>
                <Empty />
              </ListItem>
            )}
          </List>
        )}
      </VStack>
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
  await queryClient.prefetchQuery(FETCH_ORDERS_URI, () => fetchOrders());
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export const getServerSideProps = withSession(handler);

export default Orders;
