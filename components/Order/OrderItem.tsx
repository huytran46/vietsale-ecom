import React from "react";
import {
  VStack,
  Text,
  Flex,
  HStack,
  Spacer,
  Image,
  Badge,
  StackDivider,
  Divider,
  Icon,
} from "@chakra-ui/react";
import { AiTwotoneShop, AiOutlineBarcode } from "react-icons/ai";
import { FaRegAddressCard } from "react-icons/fa";
import moment from "moment";

import { Order, OrderStatusMapLang } from "models/Order";
import MyLinkOverlay from "components/common/MyLinkOverlay";
import { formatCcy } from "utils";

type Props = {
  order: Order;
};

const OrderItem: React.FC<Props> = ({ order }) => {
  const shopInfo = React.useMemo(
    () => order?.edges?.shop,
    [order?.edges?.shop]
  );

  const OrderedProducts = React.useMemo(() => {
    if (!order?.edges?.has_items) return [];
    const orderItems = order.edges.has_items;
    return orderItems.map((oi, idx) => {
      const cartItem = oi?.edges?.is_cart_item;
      if (!cartItem) return;
      const product = cartItem.edges.is_product;
      if (!product) return;
      const productCover = product.edges?.cover?.file_thumbnail;
      return (
        <HStack key={idx} w="full" spacing={3}>
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
          <Text flex="1" fontSize="sm">
            {product.name}
          </Text>
          <Text fontSize="sm" fontWeight="medium">
            {cartItem.qty}
          </Text>
          <Text fontSize="sm">x</Text>
          <Text flex="1" fontSize="sm" fontWeight="medium">
            {formatCcy(cartItem.orig_price)} đ
          </Text>
          <Text
            textAlign="center"
            fontSize="sm"
            fontWeight="medium"
            color="red.500"
          >
            {formatCcy(cartItem.qty * cartItem.orig_price)} đ
          </Text>
        </HStack>
      );
    });
  }, [order.edges.has_items]);

  return (
    <VStack
      borderRadius="md"
      borderWidth="1px"
      borderColor="gray.200"
      alignItems="flex-start"
      w="full"
      p={3}
      spacing={6}
    >
      <Flex w="full">
        <Icon fontSize="xl" as={AiOutlineBarcode} mr={1.5} />
        <Text
          as="code"
          fontWeight="medium"
          textTransform="uppercase"
          fontSize="sm"
        >
          {order.code}
        </Text>
        <Spacer />
        <Text fontSize="sm">
          {moment(order.created_at).format("HH:mm:ss DD/MM/yyyy")}
        </Text>
      </Flex>
      <HStack divider={<StackDivider />}>
        <Text fontSize="sm">
          Trạng thái:{" "}
          <Badge p={1} colorScheme={OrderStatusMapLang[order.status].color}>
            {OrderStatusMapLang[order.status].label}
          </Badge>
        </Text>
        <Text fontSize="sm">
          Lần cuối cập nhật:{" "}
          {moment(order.updated_at).format("HH:mm:ss DD/MM/YYYY")}
        </Text>
      </HStack>
      <HStack spacing={0}>
        <Icon fontSize="xl" as={FaRegAddressCard} mr={2} />
        <HStack divider={<StackDivider />}>
          <Text fontSize="sm" fontWeight="medium">
            {order.fullname}
          </Text>
          <Text fontSize="sm">{order.phone}</Text>
          <Text fontSize="sm">{order.address}</Text>
        </HStack>
      </HStack>
      {shopInfo && (
        <HStack spacing={1}>
          <Icon color="brand.500" fontSize="xl" as={AiTwotoneShop} />
          <Text fontSize="sm" fontWeight="medium" color="brand.500">
            &nbsp;{shopInfo.shop_name}
          </Text>
        </HStack>
      )}
      <VStack w="full">{OrderedProducts}</VStack>
      <Divider />
      <VStack w="full" spacing={0} pt={1} pb={3}>
        <HStack p={0} pl={3} w="full">
          <Text color="gray.500" fontSize="sm">
            Tổng tiền&nbsp;({order?.total_item}&nbsp;sản phẩm):
          </Text>
          <Text color="gray.500" fontSize="sm">
            {formatCcy(order.total_price)}
            &nbsp;đ
          </Text>
        </HStack>
        <HStack p={0} pl={3} w="full">
          <Text color="gray.500" fontSize="sm">
            Phí giao hàng:
          </Text>
          <Text color="gray.500" fontSize="sm">
            {formatCcy(order.shipping_fee)}
            &nbsp;đ
          </Text>
        </HStack>
        <HStack p={0} pl={3} w="full">
          <Text fontSize="sm" fontWeight="medium">
            Tổng giá đơn hàng:
          </Text>
          <Text fontWeight="bold" fontSize="md" color="red.500">
            {formatCcy(order.final_price)}
            &nbsp;đ
          </Text>
        </HStack>
      </VStack>
    </VStack>
  );
};

export default OrderItem;
