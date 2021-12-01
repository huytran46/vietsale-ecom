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
import { MdClose } from "react-icons/md";

import { fetchProducts, FETCH_PRODUCT_URI } from "services/product";
import ProductItem from "components/ProductItem";
import { Product } from "models/Product";
import { stringifyUrl } from "query-string";

const PAGE_SIZE = 60;

const Products: NextPage = () => {
  const router = useRouter();
  const { _q, pc, pc_name } = router.query;
  const justMounted = React.useRef(true);
  const [isBottom, setBottomState] = React.useState(false);
  const [isNoMore, setNoMoreDate] = React.useState(false);
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

  const removeQueries = React.useCallback(
    (key: string | string[]) => {
      const currentPath = window.location.search.substring(1);
      const queryObj = JSON.parse(
        '{"' +
          decodeURI(currentPath)
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"') +
          '"}'
      );

      if (typeof key === "string") {
        let foundK: string = "";
        if (
          Object.entries(queryObj).find(([k, val]) => {
            if (val === key) {
              foundK = k;
            }
            return val === key;
          })
        ) {
          queryObj[foundK] = undefined;
        }
      }

      const newUrl = stringifyUrl({
        url: window.location.pathname,
        query: queryObj,
      });

      router.replace(newUrl);
    },
    [router]
  );

  React.useEffect(() => {
    if (justMounted.current) {
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
    if (products.length < PAGE_SIZE) {
      setNoMoreDate(true);
      // return;
    } else {
      setNoMoreDate(false);
    }
    setProductData((prev) => prev.concat(products));
  }, [isProductRefetching, isOldProductData, products]);

  const NotFound = React.useMemo(
    () => (
      <VStack spacing={1}>
        <Box d="flex" alignItems="center" gridGap={3} color="gray.400" p={3}>
          <Icon as={HiOutlineShoppingCart} w="32px" h="32px" />
          <Text fontSize="2xl">
            Không có sản phẩm nào được tìm thấy{" "}
            {pc_name ? "trong danh mục" : "với từ khoá"} &#8220;{_q ?? pc_name}
            &#8220;
          </Text>
        </Box>
        <Link href="/products" color="brand.300" fontSize="xl">
          Xem tất cả sản phẩm
        </Link>
      </VStack>
    ),
    [_q, pc_name]
  );

  if (isLoading) return <></>;
  if (!products || !productData) return NotFound;

  function triggerBottomState(isVisible: boolean) {
    if (justMounted.current) {
      justMounted.current = false;
      return;
    }
    setBottomState(isVisible);
  }

  return (
    <VStack h="fit-content" w="full" spacing={10} py={10}>
      <Wrap w="full">
        {_q && (
          <WrapItem>
            <Badge
              opacity={1}
              d="flex"
              alignItems="center"
              colorScheme="brand"
              p={1}
            >
              <Text fontWeight="bold" textTransform="none" color="white" mr="1">
                {_q}
              </Text>
              <Icon
                color="white"
                cursor="pointer"
                as={MdClose}
                onClick={() => removeQueries(_q)}
              />
            </Badge>
          </WrapItem>
        )}
        {pc_name && (
          <WrapItem>
            <Badge
              opacity={1}
              d="flex"
              alignItems="center"
              colorScheme="brand"
              p={1}
            >
              <Text fontWeight="bold" textTransform="none" color="white" mr="1">
                {pc_name}
              </Text>
              <Icon
                color="white"
                cursor="pointer"
                as={MdClose}
                onClick={() => removeQueries(pc_name)}
              />
            </Badge>
          </WrapItem>
        )}
      </Wrap>

      {productData.length < 1 && isNoMore ? (
        NotFound
      ) : (
        <SimpleGrid w="full" bg="white" gap={2} columns={[1, 2, 4, 6]}>
          {productData.map((p, idx) => (
            <ProductItem key={idx} product={p} />
          ))}
        </SimpleGrid>
      )}

      {!isNoMore && (
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
      )}
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
