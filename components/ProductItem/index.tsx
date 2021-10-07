import React from "react";
import { Badge, Box, Text } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/image";

import { Product } from "models/Product";

import TextWithLines from "components/common/TextWithLines";
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
      borderRadius="md"
      borderWidth="1px"
      borderColor="gray.300"
      boxShadow="none"
      w="full"
      h="full"
      overflow="hidden"
      m={0}
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
        borderTopRadius="md"
        borderWidth="1px"
        borderColor="gray.300"
      />

      <Box
        d="flex"
        flexDir="column"
        alignItems="flex-start"
        justifyContent="space-between"
        flex="1"
        borderTopWidth="1px"
        borderColor="gray.300"
        borderBottomRadius="md"
        bg="white"
        p={2}
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

        <TextWithLines
          position="relative"
          fontWeight="semibold"
          fontSize="xs"
          as="h4"
          lineHeight="tight"
          textTransform="capitalize"
          text={product.name}
        />

        <Box w="full" d="flex" alignItems="flex-end" mt={3}>
          {isDiscount ? (
            <>
              <Text mr={0.5} lineHeight="tall" color="brand.700" fontSize="xs">
                đ
              </Text>
              <Text
                lineHeight="tight"
                color="brand.700"
                fontWeight="medium"
                fontSize="sm"
              >
                {formatCcy(product.discount_price)}
              </Text>

              <Text
                textDecorationLine="line-through"
                ml={2}
                color="gray.400"
                fontWeight="medium"
                fontSize="xs"
              >
                {formatCcy(product.orig_price)}
              </Text>
            </>
          ) : (
            <>
              <Text mr={0.5} lineHeight="tall" color="brand.700" fontSize="xs">
                đ
              </Text>
              <Text
                lineHeight="tight"
                color="brand.700"
                fontWeight="medium"
                fontSize="sm"
              >
                {formatCcy(product.orig_price)}
              </Text>
            </>
          )}
        </Box>
      </Box>
    </MyLinkOverlay>
  );
};

export default ProductItem;
