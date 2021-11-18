import React from "react";
import { Text, HStack, Image } from "@chakra-ui/react";

import { Order } from "models/Order";
import MyLinkOverlay from "components/common/MyLinkOverlay";
import { formatCcy } from "utils";

type P = {
  order: Order;
};

const OrderedProducts: React.FC<P> = ({ order }) => {
  const orderItems = React.useMemo(() => {
    if (!order?.edges?.has_items) return [];
    return order.edges.has_items;
  }, [order?.edges?.has_items]);
  return (
    <>
      {orderItems.map((oi, idx) => {
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
            <HStack flex="1" alignItems="flex-end">
              <Text fontSize="sm" fontWeight="medium">
                {formatCcy(cartItem.price)} đ
              </Text>
              <Text
                fontSize="xs"
                color="gray.500"
                textDecorationLine="line-through"
              >
                {formatCcy(cartItem.orig_price)} đ
              </Text>
            </HStack>
            <Text
              textAlign="center"
              fontSize="sm"
              fontWeight="medium"
              color="red.500"
            >
              {formatCcy(cartItem.qty * cartItem.price)} đ
            </Text>
          </HStack>
        );
      })}
    </>
  );
};

export default OrderedProducts;
