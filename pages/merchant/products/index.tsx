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
import { Product } from "models/Product";
import { formatCcy } from "utils";
import Pagination from "components/Pagination";

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
  const [currentItems, setCurrentItems] = React.useState<Product[]>([]);
  const [mode, setMode] = React.useState<number>(0);
  const handleTabChange = React.useCallback(
    (tabIdx: number) => setMode(tabIdx),
    []
  );
  const {
    data: response,
    isLoading,
    isFetching,
    isRefetching,
  } = useQuery({
    queryKey: [FETCH_SHOP_PRODUCTS_MERCH, token, shopId],
    queryFn: ({ queryKey }) =>
      fetchShopProductsForMerch(queryKey[1], queryKey[2]),
  });

  const products = React.useMemo(
    () => response?.data.products ?? [],
    [response?.data.products]
  );
  const isProductsLoading = React.useMemo(
    () => isLoading || isFetching || isRefetching || !products,
    [products, isLoading, isFetching, isRefetching]
  );

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
          index={mode}
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
      <Pagination
        items={products}
        itemPerPage={20}
        setCurrentItems={setCurrentItems}
      />
    </VStack>
  );
};

const handler: NextSsrIronHandler = async function ({ req, res, query }) {
  const auth = req.session.get(IronSessionKey.AUTH);
  const { shop_id } = query;
  if (auth === undefined || !shop_id || shop_id === "") {
    res.setHeader("location", "/");
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    [FETCH_SHOP_PRODUCTS_MERCH, auth, shop_id as string],
    ({ queryKey }) => fetchShopProductsForMerch(queryKey[1], queryKey[2])
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
