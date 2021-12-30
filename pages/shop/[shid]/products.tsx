import React, { useCallback, useMemo, useState } from "react";
import type { NextPage, GetServerSideProps } from "next";
import {
  VStack,
  HStack,
  Box,
  Grid,
  GridItem,
  Avatar,
  Text,
  ButtonGroup,
  Button,
  Icon,
  Wrap,
  WrapItem,
  Input,
  Divider,
  FormControl,
  FormLabel,
  Select,
  SimpleGrid,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import { BsPlus, BsChatDots } from "react-icons/bs";
import { FaRegHandshake } from "react-icons/fa";
import { AiOutlineShop } from "react-icons/ai";
import { dehydrate, QueryClient, useQuery } from "react-query";
import _debounce from "lodash/debounce";

import withSession, { NextSsrIronHandler } from "utils/session";
import { LayoutType } from "constants/common";
import {
  fetchShopCategories,
  fetchShopDetail,
  fetchShopProducts,
  FETCH_SHOP_CATEGORIES,
  FETCH_SHOP_DETAIL,
  FETCH_SHOP_PRODUCTS,
} from "services/shop";
import moment from "moment";
import ProductItem from "components/ProductItem";
import Empty from "components/common/Empty";

const MetaInfo: React.FC<{
  label: string;
  icon: IconType;
  value?: string | number;
}> = ({ label, icon, value }) => (
  <HStack w="full">
    <Icon fontSize="xl" as={icon} />
    <Text>{label}:</Text>
    <Text color="brand.500" fontSize="sm" fontWeight="medium">
      {value ?? "-"}
    </Text>
  </HStack>
);

const CategoryItem: React.FC<{
  isSelected: boolean;
  label: string;
  onClick: () => void;
}> = ({ isSelected, label, onClick }) => (
  <WrapItem
    p={1}
    px={3}
    borderWidth="1px"
    borderRadius="sm"
    cursor="pointer"
    onClick={onClick}
    bg="white"
    bgGradient={isSelected ? "linear(to-b, brand.300, brand.700)" : "none"}
    borderColor={isSelected ? "brand.700" : "gray.300"}
  >
    <Text
      fontWeight={isSelected ? "medium" : "normal"}
      color={isSelected ? "white" : "gray.500"}
    >
      {label}
    </Text>
  </WrapItem>
);

const ShopProducts: NextPage<{ shop_id?: string }> = ({ shop_id }) => {
  // states
  const [selCateId, setSelCateId] = useState<string | undefined>();
  const [page, setPage] = useState<number>(1);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  // external data
  const { data: shopDetail } = useQuery(
    [FETCH_SHOP_DETAIL, shop_id],
    ({ queryKey }) => fetchShopDetail(`${queryKey[1]}`),
    { enabled: Boolean(shop_id) }
  );

  const { data: categoriesInShop } = useQuery(
    [FETCH_SHOP_CATEGORIES, shop_id],
    ({ queryKey }) => fetchShopCategories(`${queryKey[1]}`),
    { enabled: Boolean(shop_id) }
  );

  const {
    data: productsInShop,
    isLoading: productLoading,
    isRefetching: productRefetching,
  } = useQuery(
    [FETCH_SHOP_PRODUCTS, shop_id, page, searchKeyword, selCateId],
    ({ queryKey }) =>
      fetchShopProducts(`${queryKey[1]}`, {
        page: parseInt(`${queryKey[2]}`),
        _q: `${queryKey[3]}`,
        cateIDs: [`${queryKey[4]}`],
      }),
    { enabled: Boolean(shop_id) }
  );

  // external data //

  // memoized
  const joinDates = useMemo(
    () => moment().diff(moment(shopDetail?.created_at), "days"),
    [shopDetail?.created_at]
  );

  const isShouldNotShow = useMemo(
    () => !shopDetail && !categoriesInShop && !productsInShop,
    [shopDetail, categoriesInShop, productsInShop]
  );

  const isProductLoading = useMemo(
    () => productLoading || productRefetching || !productsInShop,
    [productLoading, productRefetching, productsInShop]
  );

  // eslint-disable-next-line
  const onSearchInputHandler = useCallback(
    _debounce(
      (e: React.ChangeEvent<HTMLInputElement>) =>
        setSearchKeyword(e.target.value),
      500,
      { trailing: true }
    ),
    []
  );

  if (isShouldNotShow) {
    return <Box w="full">Đang tải...</Box>;
  }

  return (
    <VStack w="full" spacing={6} pb={6}>
      <HStack
        w="full"
        bg="white"
        alignItems="start"
        justifyContent="center"
        mt={6}
        p={10}
        spacing={6}
      >
        <VStack
          flex={1}
          w="full"
          bgGradient="linear(to-b, brand.700, brand.300)"
          p={6}
          pb={4}
          borderRadius="md"
          alignItems="center"
          justifyContent="center"
        >
          <HStack
            w="full"
            alignItems="start"
            justifyContent="center"
            spacing={3}
          >
            <Avatar
              src={shopDetail?.edges?.avatar?.file_thumbnail}
              borderWidth="2px"
              borderColor="white"
            />
            <VStack w="full" alignItems="start" color="white" spacing={0}>
              <Text fontWeight="bold">{shopDetail?.shop_name}</Text>
              <Text fontSize="sm">{shopDetail?.email}</Text>
            </VStack>
          </HStack>
          <ButtonGroup
            spacing={1}
            paddingTop={3}
            variant="outline"
            colorScheme="brand"
            size="sm"
            w="full"
            borderRadius="md"
          >
            <Button
              disabled
              flex={1}
              borderWidth="2px"
              borderColor="white"
              bg="whiteAlpha.100"
              color="white"
              boxShadow="none"
              shadow="none"
              textTransform="uppercase"
              fontWeight="bold"
              fontSize="xs"
              // _hover={{
              //   bg: "white",
              //   color: "brand.500",
              // }}
            >
              <Icon as={BsPlus} />
              &nbsp;Theo dõi
            </Button>
            <Button
              disabled
              flex={1}
              borderWidth="2px"
              borderColor="white"
              bg="whiteAlpha.100"
              color="white"
              boxShadow="none"
              shadow="none"
              textTransform="uppercase"
              fontWeight="bold"
              fontSize="xs"
              // _hover={{
              //   bg: "white",
              //   color: "brand.500",
              // }}
            >
              <Icon as={BsChatDots} />
              &nbsp;Chat với shop
            </Button>
          </ButtonGroup>
        </VStack>

        <Grid
          flex={2}
          h="full"
          w="full"
          templateColumns="repeat(3, 1fr)"
          pb={6}
          gap={6}
        >
          <GridItem>
            <MetaInfo
              label="Sản phẩm"
              icon={AiOutlineShop}
              value={shopDetail?.edges.products?.length}
            />
          </GridItem>

          <GridItem>
            <MetaInfo
              label="Tham gia"
              icon={FaRegHandshake}
              value={`${joinDates} Ngày Trước`}
            />
          </GridItem>
        </Grid>
      </HStack>
      <VStack w="full" bg="white" px={10} py={6} alignItems="start" spacing={4}>
        <Text fontWeight="medium" textTransform="uppercase">
          Danh mục sản phẩm
        </Text>
        <Wrap w="full">
          <CategoryItem
            isSelected={selCateId === undefined}
            label="Tất cả"
            onClick={() => setSelCateId(undefined)}
          />
          {categoriesInShop?.map((cate, idx) => (
            <CategoryItem
              key={idx}
              isSelected={selCateId === cate.id}
              label={cate.category_name}
              onClick={() => setSelCateId(cate.id)}
            />
          ))}
        </Wrap>
        <Divider orientation="horizontal" />
        <Text fontWeight="medium" textTransform="uppercase">
          Tìm kiếm nâng cao
        </Text>
        <HStack w="full" alignItems="end">
          <FormControl size="sm" isDisabled>
            <FormLabel>Theo thứ tự</FormLabel>
            <Select maxW="400px" size="sm" placeholder="Không có">
              <option value="created_at,desc">Mới nhất</option>
              <option value="created_at,asc">Cũ nhất</option>
              <option value="price,desc">Giá giảm dần</option>
              <option value="price,asc">Giá tăng dần</option>
            </Select>
          </FormControl>
          <FormControl size="sm">
            <FormLabel>Tên sản phẩm</FormLabel>
            <Input
              colorScheme="brand"
              maxW="400px"
              placeholder="Nhập tên sản phẩm để tìm kiếm"
              onChange={onSearchInputHandler}
            />
          </FormControl>
        </HStack>
      </VStack>
      <br />
      <Text
        color="brand.500"
        fontWeight="medium"
        fontSize="2xl"
        textTransform="uppercase"
      >
        Sản phẩm của cửa hàng
      </Text>

      {!isProductLoading && (productsInShop?.length ?? 0) < 1 && (
        <Box w="full">
          <Empty />
        </Box>
      )}
      <SimpleGrid columns={[1, 2, 4, 6]} gap={3} w="full">
        {!isProductLoading &&
          productsInShop?.map((prod, idx) => (
            <ProductItem key={idx} product={prod} />
          ))}
      </SimpleGrid>

      {isProductLoading && (
        <Center w="full" h="full" minHeight="300px">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Center>
      )}
    </VStack>
  );
};

const handler: NextSsrIronHandler = async function ({ query }) {
  if (!query) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { shid, page } = query;
  if (!shid) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const queryClient = new QueryClient();

  // shpo detail
  await queryClient.prefetchQuery([FETCH_SHOP_DETAIL, shid], ({ queryKey }) =>
    fetchShopDetail(queryKey[1] as string)
  );

  // shop categories
  await queryClient.prefetchQuery(
    [FETCH_SHOP_CATEGORIES, shid],
    ({ queryKey }) => fetchShopCategories(queryKey[1] as string)
  );

  // shop categories
  await queryClient.prefetchQuery(
    [FETCH_SHOP_PRODUCTS, shid, page ?? 10],
    ({ queryKey }) =>
      fetchShopProducts(`${queryKey[1]}`, { page: parseInt(`${queryKey[2]}`) })
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      layout: LayoutType.MAIN,
      shop_id: shid as string,
    },
  };
};

export const getServerSideProps: GetServerSideProps = withSession(handler);

export default ShopProducts;
