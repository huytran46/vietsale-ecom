import React from "react";
import {
  VStack,
  Text,
  RadioGroup,
  Radio,
  HStack,
  Divider,
  chakra,
  Icon,
  SimpleGrid,
} from "@chakra-ui/react";
import { MdLocalShipping } from "react-icons/md";
import CartItemRow from "components/Cart/CartItem";
import { CartItem } from "models/Cart";
import { formatCcy } from "utils";
import { useOrderCtx } from "context/OrderProvider";

const SHOP_DELI_SVC_CODE = "shop-delivery";

export type OrderGroup = {
  shopID: string;
  shopName: string;
  cartItems: CartItem[];
  logisticChannels: [
    {
      channel_id: number;
      channel_name: string;
      service_code: string;
      services: {
        service_id: number;
        service_name: string;
        service_slug?: string;
        shipping_fee: number;
      }[];
    }
  ];
  totalPrice: number;
};

type Props = {
  orderGroup: OrderGroup;
  isViewMode?: boolean;
};

const OrderGroupInfo: React.FC<Props> = ({ orderGroup, isViewMode }) => {
  const { checkingoutItems, setCheckoutItems } = useOrderCtx();
  const [logServiceId, setLogServiceId] = React.useState("1");

  const logisticServicesMapPrice = React.useMemo(() => {
    const map: Record<string, number> = { "1": 0 };
    const svcs = orderGroup.logisticChannels
      .map((chann) => chann.services)
      .flat();
    svcs.forEach((svc) => {
      map[svc.service_id.toString()] = svc.shipping_fee;
    });
    return map;
  }, [orderGroup.logisticChannels]);

  const shipFee = React.useMemo(
    () => logisticServicesMapPrice[logServiceId],
    [logisticServicesMapPrice, logServiceId]
  );

  const finalPrice = React.useMemo(
    () => orderGroup.totalPrice + shipFee,
    [orderGroup.totalPrice, shipFee]
  );

  React.useEffect(() => {
    if (!orderGroup) return;
    const foundItem = checkingoutItems.find(
      (coi) => coi.shopID === orderGroup.shopID
    );
    if (!foundItem) {
      setCheckoutItems((prev) => [
        ...prev,
        {
          shopID: orderGroup.shopID,
          logisticServiceID: parseInt(logServiceId),
          cartItemIDs: orderGroup.cartItems.map((ci) => ci.id),
          totalFinalPrice: finalPrice,
          totalOrigPrice: orderGroup.totalPrice,
          totalShippingFee: shipFee,
        },
      ]);
      return;
    }
    const foundIdx = checkingoutItems.indexOf(foundItem);
    if (foundIdx < 0) return;
    setCheckoutItems((prev) => {
      const next = [...prev];
      next.splice(foundIdx, 1, {
        shopID: orderGroup.shopID,
        logisticServiceID: parseInt(logServiceId),
        cartItemIDs: orderGroup.cartItems.map((ci) => ci.id),
        totalFinalPrice: finalPrice,
        totalOrigPrice: orderGroup.totalPrice,
        totalShippingFee: shipFee,
      });
      return next;
    });

    // eslint-disable-next-line
  }, [finalPrice, shipFee, logServiceId, orderGroup, setCheckoutItems]);

  if (isViewMode) {
    return (
      <VStack w="full" borderRadius="md" spacing={0}>
        <HStack w="full" bg="white" borderTopRadius="md" p={3}>
          <chakra.b color="brand.700">{orderGroup?.shopName}</chakra.b>
        </HStack>
        <VStack
          w="full"
          bg="white"
          borderBottomRadius="md"
          alignItems="flex-start"
        >
          {orderGroup?.cartItems?.map((ci, idx) => (
            <CartItemRow key={idx} cartItem={ci} viewMode />
          ))}

          <Divider />
          <VStack w="full" spacing={0} pt={1} pb={3}>
            <HStack p={0} pl={3} w="full">
              <Text color="gray.500" fontSize="sm">
                Tổng tiền&nbsp;({orderGroup.cartItems?.length ?? 0}&nbsp;sản
                phẩm):
              </Text>
              <Text color="gray.500" fontSize="sm">
                {formatCcy(orderGroup.totalPrice)}
                &nbsp;đ
              </Text>
            </HStack>
            <HStack p={0} pl={3} w="full">
              <Text color="gray.500" fontSize="sm">
                Phí giao hàng:
              </Text>
              <Text color="gray.500" fontSize="sm">
                {formatCcy(shipFee)}
                &nbsp;đ
              </Text>
            </HStack>
            <HStack p={0} pl={3} w="full">
              <Text fontSize="sm" fontWeight="medium">
                Tổng giá đơn hàng&nbsp;({orderGroup.cartItems?.length ?? 0}
                &nbsp;sản phẩm):
              </Text>
              <Text fontWeight="bold" fontSize="md" color="red.500">
                {formatCcy(finalPrice)}
                &nbsp;đ
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </VStack>
    );
  }

  return (
    <VStack w="full" borderRadius="md" spacing={0}>
      <HStack w="full" bg="white" borderTopRadius="md" p={3}>
        <Text w="full" fontSize="sm">
          Đơn hàng từ cửa hàng&nbsp;
          <chakra.b color="brand.700">{orderGroup?.shopName}</chakra.b>
        </Text>
      </HStack>
      <VStack
        w="full"
        bg="white"
        borderBottomRadius="md"
        alignItems="flex-start"
      >
        {orderGroup?.cartItems?.map((ci, idx) => (
          <CartItemRow key={idx} cartItem={ci} viewMode />
        ))}

        <Text fontSize="sm" fontWeight="medium" px={3} pt={3} pb={0}>
          Chọn đơn vị vận chuyển
        </Text>
        <SimpleGrid w="full" p={3} columns={[3, 4]} gap={3}>
          {orderGroup?.logisticChannels.map((channel, idx) => (
            <VStack
              key={idx}
              p={3}
              alignItems="flex-start"
              borderWidth="1px"
              borderColor="brand.50"
              borderRadius="md"
              bg="brand.25"
              minW="200px"
            >
              <Text fontSize="sm" fontWeight="medium">
                <Icon as={MdLocalShipping} mr={2} />
                {channel.channel_name}
              </Text>

              <RadioGroup
                colorScheme="brand"
                onChange={setLogServiceId}
                value={logServiceId}
              >
                <VStack alignItems="flex-start" spacing={3}>
                  {channel.services.map((svc, idx) => (
                    <HStack alignItems="flex-start" key={idx} spacing={2}>
                      <Radio
                        mt={1}
                        value={`${svc.service_id}`}
                        cursor="pointer"
                      />
                      <VStack
                        w="full"
                        p={0}
                        spacing={0}
                        alignItems="flex-start"
                        justifyContent="flex-start"
                      >
                        <Text fontSize="xs">{svc.service_name}</Text>
                        {svc.service_slug !== SHOP_DELI_SVC_CODE && (
                          <Text fontSize="xs" color="blue.500">
                            {formatCcy(svc.shipping_fee) + " đ"}
                          </Text>
                        )}
                        {svc.service_slug === SHOP_DELI_SVC_CODE && (
                          <Text fontSize="xs" color="blue.500">
                            NCC báo giá sau
                          </Text>
                        )}
                      </VStack>
                    </HStack>
                  ))}
                </VStack>
              </RadioGroup>
            </VStack>
          ))}
        </SimpleGrid>
        <Divider />
        <VStack w="full" spacing={0} pt={1} pb={3}>
          <HStack p={0} pl={3} w="full">
            <Text color="gray.500" fontSize="sm">
              Tổng tiền&nbsp;({orderGroup.cartItems?.length ?? 0}&nbsp;sản
              phẩm):
            </Text>
            <Text color="gray.500" fontSize="sm">
              {formatCcy(orderGroup.totalPrice)}
              &nbsp;đ
            </Text>
          </HStack>
          <HStack p={0} pl={3} w="full">
            <Text color="gray.500" fontSize="sm">
              Phí giao hàng:
            </Text>
            <Text color="gray.500" fontSize="sm">
              {formatCcy(shipFee)}
              &nbsp;đ
            </Text>
          </HStack>
          <HStack p={0} pl={3} w="full">
            <Text fontSize="sm" fontWeight="medium">
              Tổng giá đơn hàng&nbsp;({orderGroup.cartItems?.length ?? 0}
              &nbsp;sản phẩm):
            </Text>
            <Text fontWeight="bold" fontSize="md" color="red.500">
              {formatCcy(finalPrice)}
              &nbsp;đ
            </Text>
          </HStack>
        </VStack>
      </VStack>
    </VStack>
  );
};

export default OrderGroupInfo;
