import React from "react";
import {
  Box,
  Text,
  VStack,
  Flex,
  Image,
  Wrap,
  WrapItem,
  Badge,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberIncrementStepper,
} from "@chakra-ui/react";

import { NextPage, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { fetchProductDetail, FETCH_PRODUCT_DETAIL_URI } from "services/product";
import { formatCcy } from "utils";

const DEFAULT_QTY = 1;
const MINIMUM_QTY = 0;
const ProductDetail: NextPage = () => {
  const router = useRouter();
  const { pid } = router.query;
  const { data: productDetail, isLoading } = useQuery(
    [FETCH_PRODUCT_DETAIL_URI, pid],
    ({ queryKey }) => fetchProductDetail(queryKey[1] as string)
  );
  const [value, setValue] = React.useState(DEFAULT_QTY);

  const productCoverUrl = React.useMemo(
    () =>
      productDetail?.edges?.cover?.file_thumbnail || "https://fakeimg.pl/600/",
    [productDetail?.edges?.cover?.file_thumbnail]
  );

  const [coverUrl, setCoverUrl] = React.useState<string>(productCoverUrl);

  const productFiles = React.useMemo(
    () => productDetail?.edges?.files || [],
    [productDetail?.edges?.files]
  );

  const isDiscount = React.useMemo(() => {
    return (
      productDetail?.discount_price !== 0 &&
      Boolean(productDetail?.discount_price)
    );
  }, [productDetail]);

  if (isLoading) return <Text>Đang tải trang...</Text>;
  if (!productDetail) return null;

  const handleChangeAmt = (valueAsString: string, valueAsNumber: number) =>
    setValue(valueAsNumber);

  return (
    <VStack py={10} h="fit-content" minHeight="full" spacing={10}>
      <Flex
        borderWidth="1px"
        borderColor="gray.100"
        p={3}
        bg="white"
        h="fit-content"
        w="full"
        gridGap={3}
      >
        <VStack flex={2} spacing={3}>
          <Box>
            <Image
              h="500px"
              w="full"
              maxH="full"
              maxW="full"
              src={coverUrl}
              alt={productDetail?.name ?? "product-cover"}
            />
          </Box>
          <Wrap flex={1} direction="row" w="full">
            {productFiles.map((file, idx) => (
              <WrapItem
                key={idx}
                h="100px"
                w="100px"
                borderWidth={coverUrl === file.file_thumbnail ? "2px" : "0px"}
                borderColor={
                  coverUrl === file.file_thumbnail ? "brand.700" : "gray.200"
                }
                onMouseEnter={() => setCoverUrl(file.file_thumbnail)}
              >
                <Image
                  maxH="full"
                  maxW="full"
                  h="full"
                  w="full"
                  src={file.file_thumbnail}
                  alt={file.file_name}
                />
              </WrapItem>
            ))}
          </Wrap>
        </VStack>
        <VStack alignItems="flex-start" flex={3}>
          <Box>
            <Text fontSize="3xl">{productDetail.name}</Text>
          </Box>
          <Box d="flex" alignItems="center" gridGap={3}>
            <Text fontSize="4xl" fontWeight="bold" color="red.500">
              {isDiscount && formatCcy(productDetail.discount_price) + " đ"}
              {Boolean(productDetail.orig_price)
                ? formatCcy(productDetail.orig_price) + " đ"
                : "Liên hệ để báo giá"}
            </Text>
            {isDiscount && (
              <Box d="flex" alignItems="flex-end">
                <Text
                  color="gray.500"
                  textDecorationLine="line-through"
                  fontSize="2xl"
                >
                  {formatCcy(productDetail.discount_price)} đ
                </Text>
              </Box>
            )}
            {isDiscount && (
              <Box d="flex" alignItems="center">
                <Badge
                  borderWidth="1px"
                  borderColor="red.500"
                  colorScheme="red"
                >
                  <Text color="red.500" fontSize="2xl">
                    {formatCcy(productDetail.discount_value)}
                    {productDetail.is_percent_discount ? "%" : "đ"}
                  </Text>
                </Badge>
              </Box>
            )}
          </Box>
          <Box flex={3}>
            <NumberInput
              maxW="100px"
              mr="2rem"
              value={value}
              min={MINIMUM_QTY}
              onChange={handleChangeAmt}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Box>
        </VStack>
      </Flex>
    </VStack>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (!context.params) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const { pid } = context.params;
  if (!pid) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    [FETCH_PRODUCT_DETAIL_URI, pid],
    ({ queryKey }) => fetchProductDetail(queryKey[1] as string)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default ProductDetail;
