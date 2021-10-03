import React from "react";
import type { NextPage } from "next";
import {
  VStack,
  Box,
  Grid,
  GridItem,
  Image,
  Heading,
  StackDivider,
  Avatar,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { fetchHome, FETCH_HOME_URI } from "@services/home";
import { HomeInfo } from "@models/request-response/Home";
import { ProductCategory } from "@models/ProductCategory";

const Home: NextPage = () => {
  const { data, isLoading, isFetching } = useQuery<HomeInfo>(
    FETCH_HOME_URI,
    fetchHome
  );

  const productCategories = React.useMemo(() => {
    if (!data?.product_categories) return [];
    return data.product_categories.sort(
      (a: ProductCategory, b: ProductCategory) => {
        const aP = a.priority ?? 0;
        const bP = b.priority ?? 0;
        if (aP < bP) return 1;
        if (aP > bP) return -1;
        return 0;
      }
    );
  }, [data?.product_categories]);

  if (isLoading || isFetching) return null;
  if (!data) return null;

  return (
    <VStack h="100vh" w="full" spacing={10} py={10}>
      {/* Banner */}
      {data?.banners && (
        <Grid columnGap={2} templateColumns="repeat(4, 1fr)" w="full" h="auto">
          <GridItem colSpan={3} w="full">
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              spaceBetween={50}
              slidesPerView={1}
              autoplay={{ delay: 3000 }}
              pagination={{ clickable: true }}
              navigation
            >
              {data?.banners &&
                data.banners.map((banner, idx) => (
                  <SwiperSlide key={idx}>
                    <Box bg="brand.500" w="full" h={300}>
                      <Image
                        src={banner.edges?.cover?.file_thumbnail}
                        alt="a-shop-in-vs"
                        w="full"
                        maxH="full"
                        maxW="full"
                      />
                    </Box>
                  </SwiperSlide>
                ))}
            </Swiper>
          </GridItem>
          <GridItem colSpan={1} w="full">
            <VStack w="full" h={300}>
              <Box w="full" h="50%">
                <Image
                  src="https://fakeimg.pl/300/"
                  alt="a-shop-in-vs"
                  maxH="full"
                  maxW="full"
                  w="full"
                />
              </Box>
              <Box w="full" h="47%">
                <Image
                  src="https://fakeimg.pl/300/"
                  alt="a-shop-in-vs"
                  maxH="full"
                  maxW="full"
                  w="full"
                />
              </Box>
            </VStack>
          </GridItem>
        </Grid>
      )}

      {/* Hot deals */}

      <VStack
        divider={<StackDivider />}
        alignItems="flex-start"
        w="full"
        bg="gray.100"
        p={3}
        rounded="md"
      >
        <Heading p={2} size="sm">
          Danh mục sản phẩm
        </Heading>
        <SimpleGrid columns={[4, 6, 8]} w="full">
          {productCategories.map((cate, idx) => (
            <Box
              key={idx}
              p={2}
              d="flex"
              flexDir="column"
              alignItems="center"
              justifyContent="center"
              w="120px"
            >
              <Avatar
                size="md"
                name={cate.category_name}
                src={cate.edges?.icon?.file_thumbnail}
                mb={2}
              />
              <Text maxWidth="full" fontSize="xs" isTruncated>
                {cate.category_name}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </VStack>

      {/* Highlight products */}

      {/* All products */}
    </VStack>
  );
};

export async function getStaticProps() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(FETCH_HOME_URI, fetchHome);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default Home;
