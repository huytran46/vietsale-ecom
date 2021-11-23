import React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
  VStack,
  Text,
  HStack,
  Spacer,
  Progress,
  Button,
  useToast,
} from "@chakra-ui/react";
import {
  dehydrate,
  QueryClient,
  useMutation,
  useQueryClient,
} from "react-query";

import withSession, { NextSsrIronHandler } from "utils/session";
import { IronSessionKey } from "constants/session";
import { CheckoutItemWithService, CheckoutPayload } from "models/Cart";

import { fetchCartInfo, FETCH_CART_URI } from "services/cart";
import OrderGroupInfo from "components/Order/OrderGroup";
import { useOrderCtx } from "context/OrderProvider";
import { postCheckout, POST_CHECKOUT_URI } from "services/order";

const Checkout: NextPage<{ token: string }> = ({ token }) => {
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { orderGroups, setOrders } = useOrderCtx();

  const payload: CheckoutPayload | undefined = React.useMemo(() => {
    const { query } = router;
    if (!query.payload) return;
    const checkoutItems: CheckoutItemWithService[] = JSON.parse(
      query.payload as string
    );

    return {
      userAddressID: "",
      paymentMethodID: 0,
      checkoutItems: checkoutItems,
    };
  }, [router]);

  const { mutate: checkout } = useMutation({
    mutationKey: POST_CHECKOUT_URI,
    mutationFn: postCheckout,
  });

  const [isLoading, setLoading] = React.useState(false);

  const doCheckout = React.useCallback(() => {
    if (!payload) return;
    setLoading(true);
    checkout(payload, {
      async onSuccess(orders) {
        setOrders(orders);
        toast({
          title: "Tạo đơn hàng thành công",
          status: "success",
          variant: "top-accent",
          duration: 1000,
          isClosable: true,
        });
        await queryClient.invalidateQueries([FETCH_CART_URI, token]);
        await router.push("/order/success", "/thanh-cong");
      },
      onError() {
        toast({
          title: "Không thể tạo đơn hàng",
          status: "error",
          variant: "top-accent",
          duration: 1000,
          isClosable: true,
        });
      },
      onSettled() {
        setLoading(false);
      },
    });
  }, [checkout, setOrders, payload, toast, router, queryClient]);

  return (
    <VStack
      h="fit-content"
      alignItems="flex-start"
      w="full"
      spacing={6}
      py={16}
    >
      <VStack w="full">
        <Progress borderRadius="md" w="full" hasStripe value={98} />
        <HStack w="full">
          <Text color="gray.500" fontSize="xs" maxW="100px">
            Chọn phương thức thanh toán
          </Text>
          <Spacer />
          <Text
            color="brand.700"
            fontWeight="medium"
            textAlign="right"
            fontSize="xs"
            maxW="100px"
          >
            Xác nhận đơn hàng
          </Text>
        </HStack>
      </VStack>
      <Text fontSize="xl" textTransform="uppercase" fontWeight="bold">
        Xác nhận đơn hàng
      </Text>
      {orderGroups &&
        orderGroups.map((og, idx) => (
          <OrderGroupInfo isViewMode key={idx} orderGroup={og} />
        ))}
      <HStack w="full" justifyContent="flex-end">
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
          disabled={isLoading}
          onClick={doCheckout}
        >
          {isLoading ? "Đang đặt hàng..." : "Xác nhận & đặt hàng"}
        </Button>
      </HStack>
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
  await queryClient.prefetchQuery([FETCH_CART_URI, auth], ({ queryKey }) =>
    fetchCartInfo(queryKey[1])
  );

  return {
    props: {
      token: auth,
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export const getServerSideProps = withSession(handler);

export default Checkout;
