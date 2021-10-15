import React from "react";
import type { NextPage } from "next";
import router, { useRouter } from "next/router";
import { VStack, SimpleGrid } from "@chakra-ui/react";
import { dehydrate, QueryClient, useQuery } from "react-query";

import { fetchHome, FETCH_HOME_URI } from "services/public";
import { HomeInfo } from "models/request-response/Home";
import { fetchProducts, FETCH_PRODUCT_URI } from "services/product";
import ProductItem from "components/ProductItem";

const PAGE_SIZE = 60;

const Products: NextPage = () => {
  const { query } = useRouter();
  const { _q } = query;
  const [productPage, setProductPage] = React.useState(1);
  const { data, isLoading } = useQuery<HomeInfo>(FETCH_HOME_URI, fetchHome);

  const {
    data: products,
    isLoading: productsLoading,
    // isPreviousData: isOldProductData,
    // isRefetching: isProductRefetching,
    refetch: doFetchProducts,
  } = useQuery(FETCH_PRODUCT_URI, () =>
    fetchProducts({ page: productPage, pageSize: PAGE_SIZE, _q: _q as string })
  );

  React.useEffect(() => {
    if (productPage === 1) return;
    doFetchProducts();
  }, [productPage, doFetchProducts]);

  if (isLoading || productsLoading) return null;
  if (!data || !products) return null;

  return (
    <VStack h="fit-content" w="full" spacing={10} py={10}>
      <SimpleGrid bg="white" gap={2} columns={[1, 2, 4, 6]}>
        {products.map((p, idx) => (
          <ProductItem key={idx} product={p} />
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export async function getServerSideProps() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(FETCH_PRODUCT_URI, () =>
    fetchProducts({ pageSize: 60 })
  );
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default Products;
