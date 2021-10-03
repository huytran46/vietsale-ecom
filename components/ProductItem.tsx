import React from "react";
import { Badge, Box, Text } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/image";

import { Product } from "models/Product";

import TextWithLines from "components/common/TextWithLines";
import { formatCcy } from "utils";
import MyLinkOverlay from "./common/MyLinkOverlay";

type Props = {
  product: Product;
};

const property = {
  imageUrl: "https://bit.ly/2Z4KKcF",
  imageAlt: "Rear view of modern home with pool",
  beds: 3,
  baths: 2,
  title: "Modern home in city center in the heart of historic Los Angeles",
  formattedPrice: "$1,900.00",
  reviewCount: 34,
  rating: 4,
};

const ProductItem: React.FC<Props> = ({ product }) => {
  const isDiscount = React.useMemo(
    () => product.discount_value > 0,
    [product.discount_value]
  );

  return (
    <Box
      position="relative"
      d="flex"
      flexDir="column"
      borderRadius="md"
      border="1px solid"
      borderColor="gray.300"
      boxShadow="none"
      transitionDuration="0.2s"
      _hover={{
        transform: "scale(.98)",
      }}
      overflow="hidden"
    >
      <MyLinkOverlay href="/login">
        <Image
          src={product.edges?.cover?.file_thumbnail}
          w="full"
          h="180px"
          alt={product.name}
        />

        <Box
          h="full"
          d="flex"
          flexDir="column"
          alignItems="flex-start"
          justifyContent="space-between"
          flex="1"
          borderTopWidth="1px"
          borderTopColor="gray.300"
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
            >
              Giảm giá
            </Badge>
          )}

          <TextWithLines
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
                <Text
                  mr={0.5}
                  lineHeight="tall"
                  color="brand.700"
                  fontSize="xs"
                >
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
                <Text
                  mr={0.5}
                  lineHeight="tall"
                  color="brand.700"
                  fontSize="xs"
                >
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
    </Box>
  );
};

export default ProductItem;
