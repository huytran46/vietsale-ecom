import React from "react";
import { Badge, Box, Text, HStack, Icon, StackDivider } from "@chakra-ui/react";
import { BsStarFill } from "react-icons/bs";
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
      zIndex={0}
      _hover={{
        boxShadow: "rgb(0 0 0 / 10%) 0px 2px 26px",
        zIndex: 1,
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
        <HStack divider={<StackDivider />}>
          <HStack spacing={1}>
            <Icon fontSize="xs" color="yellow.300" as={BsStarFill} />
            <Icon fontSize="xs" color="yellow.300" as={BsStarFill} />
            <Icon fontSize="xs" color="yellow.300" as={BsStarFill} />
            <Icon fontSize="xs" color="yellow.300" as={BsStarFill} />
            <Icon fontSize="xs" color="yellow.300" as={BsStarFill} />
          </HStack>
          <Text
            lineHeight="tight"
            fontSize="xs"
            color="gray.400"
            fontWeight="medium"
          >
            Đã bán {product.sales_volume ?? 0}
          </Text>
        </HStack>
        <Box w="full" d="flex" alignItems="flex-end" mt={1}>
          {isDiscount ? (
            <HStack alignItems="center">
              <Text
                lineHeight="tight"
                color="red.500"
                fontWeight="medium"
                fontSize="sm"
              >
                {formatCcy(product.discount_price)}&nbsp;đ
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
                  textTransform="none"
                >
                  {formatCcy(product.orig_price)}&nbsp;đ
                </Text>
              </Badge>
            </HStack>
          ) : (
            <Text lineHeight="tight" fontWeight="medium" fontSize="sm">
              {product.orig_price
                ? formatCcy(product.orig_price) + " đ"
                : "Liên hệ cửa hàng"}
            </Text>
          )}
        </Box>
      </Box>
    </MyLinkOverlay>
  );
};

export default ProductItem;
