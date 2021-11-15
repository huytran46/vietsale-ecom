import React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

import {
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tabs,
  TabList,
  Tab,
  InputGroup,
  InputLeftAddon,
  Input,
  Select,
  Center,
  Spinner,
  Icon,
  Text,
} from "@chakra-ui/react";
import { MdModeEdit } from "react-icons/md";
import { dehydrate, QueryClient, useQuery } from "react-query";

import withSession, { NextSsrIronHandler } from "utils/session";
import { IronSessionKey } from "constants/session";
import { LayoutType } from "constants/common";
import {
  fetchShopProductsForMerch,
  FETCH_SHOP_PRODUCTS_MERCH,
} from "services/merchant";
import { Product, ProductStatus, ProductStatusesArr } from "models/Product";
import { formatCcy } from "utils";
import Pagination from "components/Pagination/dynamic";
import { OrderStatus, OrderStatusesArr } from "models/Order";
import { stringifyUrl } from "query-string";

const selectStyle = {
  _selected: {
    borderColor: "gray.300",
    borderBottomColor: "white",
    boxShadow: "none",
  },
};

const ProductRow: React.FC<{ product: Product; shopId: string }> = ({
  product,
  shopId,
}) => {
  const router = useRouter();
  return (
    <Tr>
      <Td>
        {product.name}
        <Icon
          cursor="pointer"
          ml={2}
          as={MdModeEdit}
          onClick={() =>
            router.push(
              `/merchant/products/edit?shop_id=${shopId}&pid=${product.id}`
            )
          }
        />
      </Td>
      <Td>{product.sku}</Td>
      <Td>{formatCcy(product.discount_price ?? product.orig_price, true)}</Td>
      <Td>{formatCcy(product.quantity, true)}</Td>
      <Td>{formatCcy(product.sales_volume ?? 0, true)}</Td>
    </Tr>
  );
};

// const TabMode: Record<number, string> = {
//   0: "pending",
//   1: "approved",
//   2: "blocked",
// };

const MerchantProducts: NextPage<{ token: string; shopId: string }> = ({
  token,
  shopId,
}) => {
  const router = useRouter();
  const [productStatus, setProductStatus] = React.useState<ProductStatus>(
    ProductStatus.PENDING
  );

  const [pageNo, setPageNo] = React.useState<number>(1);

  const {
    data: response,
    isLoading,
    isFetching,
    isRefetching,
  } = useQuery({
    queryKey: [
      FETCH_SHOP_PRODUCTS_MERCH,
      token,
      shopId,
      productStatus,
      `${pageNo}`,
    ],
    queryFn: ({ queryKey }) =>
      fetchShopProductsForMerch(
        queryKey[1],
        queryKey[2],
        queryKey[3] as ProductStatus,
        { page: parseInt(queryKey[4]) }
      ),
  });

  const products = React.useMemo(
    () => response?.data.products ?? [],
    [response?.data.products]
  );

  const isProductsLoading = React.useMemo(
    () => isLoading || isFetching || isRefetching || !products || !response,
    [products, isLoading, isFetching, isRefetching, response]
  );

  const handleTabChange = React.useCallback(
    (tabIdx: number) => setProductStatus(ProductStatusesArr[tabIdx]),
    [setProductStatus]
  );

  React.useEffect(() => {
    const nextPath = stringifyUrl({
      url: router.asPath,
      query: { page_no: pageNo, status: productStatus },
    });
    router.replace(nextPath);
  }, [pageNo, productStatus, router]);

  return (
    <VStack
      bg="white"
      h="fit-content"
      alignItems="flex-start"
      w="full"
      spacing={6}
      p={6}
      boxShadow="md"
    >
      <HStack w="full">
        <Tabs
          size="sm"
          colorScheme="brand"
          w="full"
          variant="enclosed"
          onChange={handleTabChange}
          index={ProductStatusesArr.indexOf(productStatus)}
        >
          <TabList>
            <Tab {...selectStyle}>Chờ duyệt</Tab>
            <Tab {...selectStyle}>Đã duyệt</Tab>
            <Tab {...selectStyle}>Đã bị chặn</Tab>
          </TabList>
        </Tabs>
      </HStack>
      <HStack>
        <InputGroup size="sm" minW="500px">
          <InputLeftAddon p={0} borderWidth={0} borderLeftRadius="md">
            <Select
              size="sm"
              w="full"
              focusBorderColor="none"
              borderRightWidth={0}
              borderLeftRadius="md"
              defaultValue="option1"
            >
              <option value="option1">Tên sản phẩm</option>
              <option value="option2">SKU</option>
            </Select>
          </InputLeftAddon>
          <Input
            focusBorderColor="none"
            borderRightRadius="md"
            colorScheme="brand"
            variant="outline"
            placeholder="Tìm kiếm"
          />
        </InputGroup>
      </HStack>
      {isProductsLoading && (
        <Center w="full">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="md"
          />
        </Center>
      )}
      <Table variant="striped" colorScheme="gray" size="sm">
        <Thead>
          <Tr>
            <Th>Tên sản phẩm</Th>
            <Th>SKU</Th>
            <Th>Giá</Th>
            <Th>Kho hàng</Th>
            <Th>Đã bán</Th>
          </Tr>
        </Thead>
        <Tbody>
          {!isProductsLoading &&
            products?.map((p, idx) => (
              <ProductRow key={idx} product={p} shopId={shopId} />
            ))}
        </Tbody>
      </Table>
      {!isProductsLoading && (
        <Pagination
          pageNo={response?.page_no ?? 1}
          pageSize={response?.page_size ?? 20}
          totalPages={response?.total_page ?? 2}
          onPageChange={(nextPage) => setPageNo(nextPage)}
        />
      )}
    </VStack>
  );
};

const handler: NextSsrIronHandler = async function ({ req, res, query }) {
  const auth = req.session.get(IronSessionKey.AUTH);
  const { shop_id, page_no, status } = query;
  if (auth === undefined || !shop_id || shop_id === "") {
    res.setHeader("location", "/");
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    [
      FETCH_SHOP_PRODUCTS_MERCH,
      auth,
      shop_id as string,
      status ?? ProductStatus.PENDING,
      `${page_no ?? 1}`,
    ],
    ({ queryKey }) =>
      fetchShopProductsForMerch(
        queryKey[1],
        queryKey[2],
        queryKey[3] as ProductStatus,
        { page: parseInt(queryKey[4]) }
      )
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      layout: LayoutType.MERCH,
      token: auth,
      shopId: shop_id,
    },
  };
};

export const getServerSideProps = withSession(handler);

export default MerchantProducts;
