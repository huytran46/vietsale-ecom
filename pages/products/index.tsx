import React from "react";
import type { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { VStack, SimpleGrid, Box, Icon, Text, Link } from "@chakra-ui/react";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { HiOutlineShoppingCart } from "react-icons/hi";

import { fetchProducts, FETCH_PRODUCT_URI } from "services/product";
import ProductItem from "components/ProductItem";

const PAGE_SIZE = 60;

const Products: NextPage = () => {
  const { query } = useRouter();
  const { _q } = query;
  const [productPage, setProductPage] = React.useState(1);

  const {
    data: products,
    isLoading,
    refetch: doFetchProducts,
  } = useQuery(FETCH_PRODUCT_URI, () =>
    fetchProducts({ page: productPage, pageSize: PAGE_SIZE, _q: _q as string })
  );

  React.useEffect(() => {
    if (productPage === 1) return;
    doFetchProducts();
  }, [productPage, doFetchProducts]);

  const NotFound = React.useMemo(
    () => (
      <VStack spacing={1}>
        <Box d="flex" alignItems="center" gridGap={3} color="gray.400" p={3}>
          <Icon as={HiOutlineShoppingCart} w="32px" h="32px" />
          <Text fontSize="2xl">
            Không có sản phẩm nào được tìm thấy. Từ khoá &#8220;{_q}&#8220;
          </Text>
        </Box>
        <Link href="/products" color="brand.300" fontSize="xl">
          Xem tất cả sản phẩm
        </Link>
      </VStack>
    ),
    [_q]
  );

  if (isLoading) return null;
  if (!products) return NotFound;

  return (
    <VStack h="fit-content" w="full" spacing={10} py={10}>
      {products.length < 1 && NotFound}
      <SimpleGrid w="full" bg="white" gap={2} columns={[1, 2, 4, 6]}>
        {products.map((p, idx) => (
          <ProductItem key={idx} product={p} />
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const { _q } = query;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(FETCH_PRODUCT_URI, () =>
    fetchProducts({ pageSize: 60, _q: _q as string })
  );
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default Products;
