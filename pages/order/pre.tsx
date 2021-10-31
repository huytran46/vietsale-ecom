import React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
  VStack,
  Grid,
  GridItem,
  Text,
  Box,
  HStack,
  Flex,
  Spacer,
  StackDivider,
  Spinner,
  Divider,
  Progress,
  Button,
  Radio,
  RadioGroup,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { dehydrate, QueryClient, useMutation, useQuery } from "react-query";
import { parse } from "query-string";

import withSession, { NextSsrIronHandler } from "utils/session";
import { IronSessionKey } from "constants/session";
import { CheckoutItem, PreCheckoutPayload } from "models/Cart";
import { postPrecheckout, POST_PRECHECKOUT_URI } from "services/order";
import { PreCheckoutResponse } from "models/request-response/Cart";
import { fetchCartInfo, FETCH_CART_URI } from "services/cart";
import { useUser } from "context/UserProvider";
import { formatCcy } from "utils";
import OrderGroupInfo, { OrderGroup } from "components/Order/OrderGroup";
import { useOrderCtx } from "context/OrderProvider";

type OrderInfo = {
  origOrderTotalAmt: number;
  discountOrderTotalAmt: number;
  finalOrderTotalAmt: number;
};

const Precheckout: NextPage = () => {
  const router = useRouter();

  const checkoutItems = React.useMemo(() => {
    const { query } = router;
    if (!query.selItems) return [];
    const selItemsStr = parse(`${query.selItems}`);
    if (!selItemsStr) return [];
    const checkoutItems: Array<CheckoutItem | undefined> = Object.entries(
      selItemsStr
    ).map((entry) => {
      if (!entry[0] || !entry[1]) return;
      return {
        shopID: entry[0],
        cartItemIDs: [entry[1]].flat(),
      };
    });
    return checkoutItems;
  }, [router]);

  const orderInfo: OrderInfo | undefined = React.useMemo(() => {
    const { query } = router;
    if (!query.orderInfo) return;
    const orderInfoObj: OrderInfo = parse(`${query.orderInfo}`) as any;
    return orderInfoObj;
  }, [router]);

  const payload: PreCheckoutPayload = React.useMemo(
    () => ({
      paymentMethodID: 0,
      userAddressID: "",
      checkoutItems: checkoutItems as CheckoutItem[],
    }),
    [checkoutItems]
  );

  const { mutate: doPrecheckout } = useMutation({
    mutationFn: postPrecheckout,
    mutationKey: POST_PRECHECKOUT_URI,
  });

  const { data: cartInfo, isLoading } = useQuery(FETCH_CART_URI, () =>
    fetchCartInfo()
  );

  const [logChannels, setLogChannels] = React.useState<PreCheckoutResponse>();

  const { defaultAddress, fullDetailAddress } = useUser();

  const { totalFinalPrice, totalShippingFee, checkingoutItems } = useOrderCtx();

  const orderGroups: Array<OrderGroup | undefined> = React.useMemo(() => {
    if (!cartInfo || !logChannels || checkoutItems.length < 1) return [];
    const isCheckoutItemInvalid = checkoutItems.find(
      (coi) => coi === undefined
    );
    if (isCheckoutItemInvalid) return [];
    const cartItemGroups = cartInfo.cart_item_groups ?? [];
    const og = checkoutItems
      .map((coi) => {
        if (!coi) return;
        let obj: OrderGroup;
        const selCartItemIDs = coi.cartItemIDs;
        const group = cartItemGroups.find((cgr) => cgr.shop_id === coi.shopID);
        if (!group) return;
        const selCartItems = group.cart_items?.filter(
          (ci) => (selCartItemIDs?.indexOf(ci.id) ?? -1) > -1
        );
        const totalPrice = selCartItems.reduce((cumm, sci) => {
          const qty = sci.qty;
          const price =
            sci.edges.is_product.discount_price ??
            sci.edges.is_product.orig_price;
          cumm += qty * price;
          return cumm;
        }, 0);

        const orderLogChans = logChannels.logistic_channels?.find(
          (chann) => chann.shop_id === coi.shopID
        )?.channels;

        if (!orderLogChans) return;

        obj = {
          shopID: coi.shopID,
          shopName: group.shop_name,
          cartItems: selCartItems,
          logisticChannels: orderLogChans,
          totalPrice,
        };
        return obj;
      })
      .filter((_) => _ !== undefined);
    if (!og || og.length < 1 || (og.length > 0 && !og[0])) return [];
    return og;
  }, [logChannels, checkoutItems, cartInfo]);

  const isItemLoading = React.useMemo(() => {
    return !orderGroups || orderGroups?.length < 1;
  }, [orderGroups]);

  const handleCheckout = React.useCallback(() => {
    console.log("checkingoutItems:", checkingoutItems);
  }, [checkingoutItems]);

  React.useEffect(() => {
    doPrecheckout(payload, {
      onSuccess(data) {
        setLogChannels(data);
      },
    });
  }, [doPrecheckout, payload, setLogChannels]);

  if (isLoading || !cartInfo)
    return (
      <Box p={3} m={3}>
        Đang tải...
      </Box>
    );

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
        Chọn phương thức vận chuyển
      </Text>
      <Grid w="full" templateColumns="repeat(8, 1fr)" gap={4}>
        <GridItem colSpan={[8, 8, 6]}>
          {isItemLoading && (
            <HStack w="full" mt={6} justifyContent="center" p={3}>
              <Spinner
                thickness="2px"
                speed="0.65s"
                emptyColor="gray.200"
                color="brand.500"
                size="md"
              />
            </HStack>
          )}

          <VStack w="full" spacing={6}>
            {orderGroups
              ?.filter((_) => _)
              .map(
                (ogr, idx) =>
                  ogr && <OrderGroupInfo key={idx} orderGroup={ogr} />
              )}
          </VStack>
        </GridItem>
        <GridItem position="relative" colSpan={[8, 8, 2]}>
          <VStack position="fixed" maxW="300px" spacing={3}>
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
                  <Text fontSize="sm" color="gray.500" fontWeight="medium">
                    Địa chỉ giao hàng
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
              gridGap={2}
            >
              <Flex w="full">
                <Text fontSize="sm" color="gray.500" fontWeight="medium">
                  Phương thức thanh toán
                </Text>
              </Flex>
              <RadioGroup isDisabled colorScheme="brand" defaultValue="COD">
                <Radio value="COD">
                  <Text fontSize="sm">Thanh toán bằng tiền mặt (COD)</Text>
                </Radio>
              </RadioGroup>
              <Alert borderRadius="md" status="info">
                <AlertIcon />
                <Text fontSize="xs">
                  Hiện tại hệ thống chỉ chấp nhận thanh toán bằng tiền mặt và
                  đang nâng cấp để thực hiện được nhiều phương thức hơn. Mong
                  quý khách thông cảm vì sự bất tiện này.
                </Text>
              </Alert>
            </Box>

            {orderInfo && (
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
                  <Text fontSize="sm">
                    {orderInfo.origOrderTotalAmt === 0
                      ? "0đ"
                      : `${formatCcy(orderInfo.origOrderTotalAmt)} đ`}
                  </Text>
                </Flex>
                <Flex w="full">
                  <Text fontSize="sm" fontWeight="medium">
                    Giảm giá
                  </Text>
                  <Spacer />
                  <Text fontSize="sm" color="red.500" fontWeight="medium">
                    {orderInfo.discountOrderTotalAmt === 0
                      ? "0đ"
                      : `-${formatCcy(orderInfo.discountOrderTotalAmt)} đ`}
                  </Text>
                </Flex>
                <Flex w="full">
                  <Text fontSize="sm" fontWeight="medium">
                    Phí giao hàng
                  </Text>
                  <Spacer />
                  <Text fontSize="sm">
                    {totalShippingFee === 0
                      ? "0đ"
                      : `${formatCcy(totalShippingFee)} đ`}
                  </Text>
                </Flex>
                <Divider />
                <VStack spacing={0} alignItems="flex-end" w="full">
                  <Flex w="full">
                    <Text fontSize="sm" fontWeight="medium">
                      Tổng cộng
                    </Text>
                    <Spacer />
                    <Text
                      color="brand.500"
                      fontSize={totalFinalPrice === 0 ? "sm" : "md"}
                      fontWeight="medium"
                    >
                      {!isItemLoading && totalFinalPrice === 0
                        ? "Vui lòng chọn sản phẩm"
                        : formatCcy(totalFinalPrice) + " đ"}
                      {isItemLoading && "-"}
                    </Text>
                  </Flex>
                  <Text color="gray.400" fontSize="xs">
                    (Đã bao gồm VAT nếu có)
                  </Text>
                </VStack>
                <Button
                  _hover={{
                    bg: "red.600",
                  }}
                  _focus={{
                    bg: "red.600",
                  }}
                  _active={{
                    bg: "red.600",
                  }}
                  bg="red.500"
                  borderColor="red.700"
                  w="full"
                  onClick={handleCheckout}
                >
                  Đặt hàng
                </Button>
              </Box>
            )}
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

export default Precheckout;
