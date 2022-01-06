import React from "react";
import type { NextPage } from "next";
import {
  useBoolean,
  VStack,
  Image,
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
  Center,
  Spinner,
  Badge,
  Icon,
  StackDivider,
} from "@chakra-ui/react";
import { dehydrate, QueryClient, useQuery } from "react-query";
import moment from "moment";
import { BiBarcode } from "react-icons/bi";

import withSession, { NextSsrIronHandler } from "utils/session";
import { IronSessionKey } from "constants/session";
import { LayoutType } from "constants/common";
import {
  fetchShopOrdersForMerch,
  FETCH_SHOP_ORDERS_MERCH,
} from "services/merchant";
import { formatCcy } from "utils";
import Pagination from "components/Pagination/dynamic";
import {
  Order,
  OrderStatus,
  OrderStatusesArr,
  OrderStatusMapLang,
} from "models/Order";
import Empty from "components/common/Empty";
import { useRouter } from "next/router";
import { stringifyUrl } from "query-string";
import MyLinkOverlay from "components/common/MyLinkOverlay";
import ApproveOrderModal from "components/ApproveOrderModal";

const selectStyle = {
  _selected: {
    borderColor: "gray.300",
    borderBottomColor: "white",
    boxShadow: "none",
  },
};

const OrderRow: React.FC<{
  order: Order;
  token: string;
  shopId: string;
  disableActions: boolean;
}> = (props) => {
  const { order, token, shopId, disableActions } = props;
  const [isModalOpen, modalHandler] = useBoolean();
  const [isModalOpen2, modalHandler2] = useBoolean();
  const OrderedProducts = React.useMemo(() => {
    if (!order?.edges?.has_items) return [];
    const orderItems = order.edges.has_items;
    return orderItems.map((oi, idx) => {
      const cartItem = oi?.edges?.is_cart_item;
      if (!cartItem) return;
      const product = cartItem.edges.is_product;
      if (!product) return;
      const productCover = product.edges?.cover?.file_thumbnail;

      const isDiscount = cartItem.price > 0;
      const finalPrice = isDiscount
        ? cartItem.qty * cartItem.price
        : cartItem.qty * cartItem.orig_price;

      return (
        <HStack key={idx} w="full" spacing={3} alignItems="flex-start">
          <MyLinkOverlay
            href={`/products/${product.id}`}
            borderRadius="md"
            borderWidth="1px"
            borderColor="gray.400"
          >
            <Image
              borderRadius="md"
              boxSize="104px"
              objectFit="cover"
              src={productCover}
              alt={product.name}
            />
          </MyLinkOverlay>
          <VStack justifyContent="flex-start" alignItems="flex-start">
            <Text fontSize="sm" fontWeight="medium">
              {product.name}
            </Text>
            <VStack divider={<StackDivider borderColor="gray.500" />} w="full">
              <HStack w="full" justifyContent="center">
                <Text fontSize="sm">{cartItem.qty}</Text>
                <Text fontSize="sm">x</Text>
                <HStack w="full">
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    textDecorationLine={isDiscount ? "line-through" : ""}
                  >
                    {formatCcy(cartItem.orig_price)} đ
                  </Text>
                  {isDiscount && (
                    <Text fontSize="sm">{formatCcy(cartItem.price)}đ</Text>
                  )}
                </HStack>
              </HStack>
              <Text
                textAlign="center"
                fontWeight="medium"
                fontSize="sm"
                color="red.500"
              >
                {formatCcy(finalPrice)} đ
              </Text>
            </VStack>
          </VStack>
        </HStack>
      );
    });
  }, [order.edges.has_items]);

  return (
    <Tr>
      <Td>
        <HStack alignItems="flex-start" fontSize="xs" fontWeight="medium">
          <Icon as={BiBarcode} fontSize="lg" mr={2} />
          <VStack w="full" alignItems="flex-start">
            <Text as="code">{order.code.toLocaleUpperCase()}</Text>
            {!disableActions && (
              <HStack
                w="full"
                justifyContent="flex-start"
                divider={<StackDivider />}
              >
                <ApproveOrderModal
                  token={token}
                  shopId={shopId}
                  isOpen={isModalOpen}
                  onOpen={modalHandler.on}
                  onClose={modalHandler.off}
                  order={order}
                >
                  <Text
                    color="brand.500"
                    fontSize="11px"
                    cursor="pointer"
                    _hover={{
                      textDecoration: "underline",
                    }}
                  >
                    Chuẩn bị hàng
                  </Text>
                </ApproveOrderModal>
                <ApproveOrderModal
                  token={token}
                  shopId={shopId}
                  isOpen={isModalOpen2}
                  onOpen={modalHandler2.on}
                  onClose={modalHandler2.off}
                  order={order}
                  postOfficeType
                >
                  <Text
                    color="brand.500"
                    fontSize="11px"
                    cursor="pointer"
                    _hover={{
                      textDecoration: "underline",
                    }}
                  >
                    Gửi bưu cục
                  </Text>
                </ApproveOrderModal>
              </HStack>
            )}
          </VStack>
        </HStack>
      </Td>
      <Td>
        <Badge p={1} colorScheme={OrderStatusMapLang[order.status].color}>
          {OrderStatusMapLang[order.status].label}
        </Badge>
      </Td>
      <Td>
        <VStack w="full" spacing={1}>
          {OrderedProducts}
        </VStack>
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
  const router = useRouter();

  const [orderStatus, setOrderStatus] = React.useState<OrderStatus>(
    OrderStatus.PENDING
  );

  const [pageNo, setPageNo] = React.useState<number>(1);

  const {
    data: response,
    isLoading,
    isFetching,
    isRefetching,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: [
      FETCH_SHOP_ORDERS_MERCH,
      token,
      shopId,
      orderStatus,
      `${pageNo}`,
    ],
    queryFn: ({ queryKey }) =>
      fetchShopOrdersForMerch(
        queryKey[1],
        queryKey[2],
        queryKey[3] as OrderStatus,
        { page: parseInt(queryKey[4]) }
      ),
    enabled: token?.length > 0 && shopId?.length > 0,
  });

  const orders = React.useMemo(
    () => response?.data?.orders ?? [],
    [response?.data?.orders]
  );

  const isOrdersLoading = React.useMemo(
    () => isLoading || isFetching || isRefetching || !orders || !response,
    [orders, isLoading, isFetching, isRefetching, response]
  );

  const handleTabChange = React.useCallback(
    (tabIdx: number) => setOrderStatus(OrderStatusesArr[tabIdx]),
    [setOrderStatus]
  );

  React.useEffect(() => {
    refetchOrders();
  }, [orderStatus, refetchOrders]);

  React.useEffect(() => {
    const nextPath = stringifyUrl({
      url: router.asPath,
      query: { page_no: pageNo, status: orderStatus },
    });
    router.replace(nextPath);

    // eslint-disable-next-line
  }, [pageNo, orderStatus]);

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
      </HStack>

      <Table variant="striped" colorScheme="gray" size="sm">
        <Thead>
          <Tr>
            <Th>Mã đơn</Th>
            <Th>Trạng thái</Th>
            <Th>Sản phẩm</Th>
            <Th>Tổng giá</Th>
            <Th>Ngày tạo</Th>
            <Th>Lần chỉnh sửa gần nhất</Th>
          </Tr>
        </Thead>
        <Tbody>
          {!isOrdersLoading &&
            orders?.map((o, idx) => (
              <OrderRow
                key={idx}
                order={o}
                token={token}
                shopId={shopId}
                disableActions={orderStatus !== OrderStatus.PENDING}
              />
            ))}
        </Tbody>
      </Table>
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
      {!isOrdersLoading && orders && orders.length < 1 && <Empty />}

      {!isOrdersLoading && (
        <Pagination
          pageNo={response?.page_no ?? 1}
          pageSize={response?.page_size ?? 20}
          totalPages={response?.total_page ?? 2}
          onPageChange={(nextPage) => setPageNo(nextPage)}
        />
      )}
    </VStack>
  );
};

const handler: NextSsrIronHandler = async function ({ req, res, query }) {
  const auth = req.session.get(IronSessionKey.AUTH);
  const { shop_id, status, page_no } = query;
  if (auth === undefined || !shop_id || shop_id === "") {
    res.setHeader("location", "/");
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    [
      FETCH_SHOP_ORDERS_MERCH,
      auth,
      shop_id as string,
      status ?? OrderStatus.PENDING,
      `${page_no ?? 1}`,
    ],
    ({ queryKey }) =>
      fetchShopOrdersForMerch(
        queryKey[1],
        queryKey[2],
        queryKey[3] as OrderStatus,
        { page: parseInt(queryKey[4]) }
      )
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
