import React from "react";
import type { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import {
  VStack,
  SimpleGrid,
  Box,
  Icon,
  Text,
  Link,
  Badge,
  Stack,
  Spinner,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import VisibilitySensor from "react-visibility-sensor";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { HiOutlineShoppingCart } from "react-icons/hi";

import { fetchProducts, FETCH_PRODUCT_URI } from "services/product";
import ProductItem from "components/ProductItem";
import { Product } from "models/Product";

const PAGE_SIZE = 60;

const Products: NextPage = () => {
  const { query } = useRouter();
  const { _q, pc, pc_name } = query;
  const justMounted = React.useRef(true);
  const [isBottom, setBottomState] = React.useState(false);
  const [productPage, setProductPage] = React.useState(1);

  const {
    data: products,
    isLoading,
    refetch: doFetchProducts,
    isRefetching: isProductRefetching,
    isPreviousData: isOldProductData,
  } = useQuery(FETCH_PRODUCT_URI, () =>
    fetchProducts({
      page: productPage,
      pageSize: PAGE_SIZE,
      _q: _q as string,
      cateIDs: [pc].flat() as string[],
    })
  );

  const [productData, setProductData] = React.useState<Product[]>([]);

  React.useEffect(() => {
    if (justMounted) {
      justMounted.current = false;
      return;
    }
    if (!isBottom) return;
    setProductPage((prev) => prev + 1);
  }, [isBottom]);

  React.useEffect(() => {
    if (productPage === 1) return;
    doFetchProducts();
  }, [productPage, doFetchProducts]);

  React.useEffect(() => {
    if (isOldProductData || isProductRefetching || !products) return;
    setProductData((prev) => prev.concat(products));
  }, [isProductRefetching, isOldProductData, products]);

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
  if (!products || !productData) return NotFound;

  function triggerBottomState(isVisible: boolean) {
    setBottomState(isVisible);
  }

  return (
    <VStack h="fit-content" w="full" spacing={10} py={10}>
      {productData.length < 1 && NotFound}
      <Wrap w="full">
        <WrapItem>
          <Badge colorScheme="brand" p={1}>
            <Text fontWeight="bold" color="white">
              {pc_name}
            </Text>
          </Badge>
        </WrapItem>
      </Wrap>
      <SimpleGrid w="full" bg="white" gap={2} columns={[1, 2, 4, 6]}>
        {productData.map((p, idx) => (
          <ProductItem key={idx} product={p} />
        ))}
      </SimpleGrid>
      <VisibilitySensor onChange={triggerBottomState}>
        <Stack direction="row" h={2}>
          <Spinner
            colorScheme="brand"
            color="brand.500"
            speed="1s"
            size="md"
            emptyColor="gray.300"
          />
        </Stack>
      </VisibilitySensor>
    </VStack>
  );
};

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const { _q, pc } = query;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(FETCH_PRODUCT_URI, () =>
    fetchProducts({ pageSize: 60, _q: _q as string, cateIDs: pc as string[] })
  );
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default Products;
