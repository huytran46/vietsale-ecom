import React from "react";
import { Badge, Box, Text } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/image";

import { Product } from "models/Product";

import { formatCcy } from "utils";
import MyLinkOverlay from "../common/MyLinkOverlay";

import styles from "./ProductItem.module.css";

type Props = {
  product: Product;
  isHot?: boolean;
};

const ProductItem: React.FC<Props> = ({ product, isHot }) => {
  const isDiscount = React.useMemo(
    () => product.discount_value > 0,
    [product.discount_value]
  );

  return (
    <MyLinkOverlay
      href={`/products/${product.id}`}
      position="relative"
      d="flex"
      flexDir="column"
      w="full"
      bg="white"
      h="full"
      overflow="hidden"
      m={0}
      p={2}
      _hover={{
        boxShadow: "rgb(0 0 0 / 10%) 0px 0px 20px",
      }}
      innerProp={{
        h: "full",
        d: "flex",
        flexDir: "column",
      }}
    >
      <Image
        src={product.edges?.cover?.file_thumbnail}
        w="full"
        h="180px"
        alt={product.name}
      />

      <Box
        d="flex"
        flexDir="column"
        alignItems="flex-start"
        justifyContent="space-between"
        flex="1"
        bg="white"
        pt={2}
      >
        {isDiscount && (
          <Badge
            position="absolute"
            top={0}
            right={0}
            color="white"
            borderRadius="none"
            borderBottomLeftRadius="md"
            px="2"
            py={0.5}
            bgColor="red.500"
            colorScheme="red"
            className={isHot ? styles.shinyBagde : ""}
          >
            Giảm giá
          </Badge>
        )}

        <Text
          position="relative"
          fontSize="xs"
          as="h5"
          lineHeight="tight"
          textTransform="capitalize"
          noOfLines={2}
          maxW="full"
        >
          {product.name}
        </Text>
        <Box w="full" d="flex" alignItems="flex-end" mt={3}>
          {isDiscount ? (
            <>
              <Text
                lineHeight="tight"
                color="red.500"
                fontWeight="medium"
                fontSize="md"
              >
                {formatCcy(product.discount_price)}
              </Text>
              <Text lineHeight="tall" color="red.500" fontSize="sm">
                đ
              </Text>
              <Badge
                ml={2}
                borderWidth="1px"
                borderColor="red.500"
                variant="subtle"
                colorScheme="red"
              >
                <Text
                  textDecorationLine="line-through"
                  color="red.500"
                  fontWeight="medium"
                  fontSize="xs"
                >
                  {formatCcy(product.orig_price)}
                </Text>
              </Badge>
            </>
          ) : (
            <>
              {product.orig_price && (
                <Text mr={0.5} lineHeight="tall" fontSize="xs">
                  đ
                </Text>
              )}

              <Text lineHeight="tight" fontWeight="medium" fontSize="sm">
                {product.orig_price
                  ? formatCcy(product.orig_price)
                  : "Liên hệ cửa hàng"}
              </Text>
            </>
          )}
        </Box>
      </Box>
    </MyLinkOverlay>
  );
};

export default ProductItem;
