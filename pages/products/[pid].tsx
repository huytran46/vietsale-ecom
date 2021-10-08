import React from "react";
import {
  Box,
  Text,
  VStack,
  Flex,
  Image,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { NextPage, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { fetchProductDetail, FETCH_PRODUCT_DETAIL_URI } from "services/product";

const ProductDetail: NextPage = () => {
  const router = useRouter();
  const { pid } = router.query;
  const { data: productDetail, isLoading } = useQuery(
    [FETCH_PRODUCT_DETAIL_URI, pid],
    ({ queryKey }) => fetchProductDetail(queryKey[1] as string)
  );

  const productCoverUrl = React.useMemo(
    () =>
      productDetail?.edges?.cover?.file_thumbnail || "https://fakeimg.pl/600/",
    [productDetail?.edges?.cover?.file_thumbnail]
  );

  const productFiles = React.useMemo(
    () => productDetail?.edges?.files || [],
    [productDetail?.edges?.files]
  );

  if (isLoading) return <Text>Đang tải trang...</Text>;
  if (!productDetail) return null;

  return (
    <VStack py={10} h="fit-content" minHeight="full" spacing={10}>
      <Flex p={3} bg="white" h="fit-content" w="full">
        <VStack flex={2} spacing={3}>
          <Image
            h="500px"
            w="full"
            maxH="full"
            maxW="full"
            src={productCoverUrl}
            alt={productDetail?.name ?? "product-cover"}
          />
          <Wrap flex={1} direction="row" w="full">
            {productFiles.map((file, idx) => (
              <WrapItem key={idx} h="100px" w="100px">
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
        <Box flex={3}>a</Box>
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
