import type { NextPage } from "next";
import {
  VStack,
  Box,
  Grid,
  GridItem,
  Image,
  Heading,
  StackDivider,
  Wrap,
  WrapItem,
  Avatar,
  Text,
} from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper";

const Home: NextPage = () => {
  return (
    <VStack h="100vh" w="full" spacing={10} py={10}>
      {/* Banner */}
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
            {new Array(10).fill(10).map((_, idx) => (
              <SwiperSlide key={idx}>
                <Box bg="brand.500" w="full" h={300}>
                  <Image
                    src="https://fakeimg.pl/700/"
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
        <Wrap w="full">
          {new Array(10).fill("a").map((_, idx) => (
            <WrapItem
              key={idx}
              p={2}
              d="flex"
              flexDir="column"
              alignItems="center"
              justifyContent="center"
            >
              <Avatar
                size="lg"
                name="Dan Abrahmov"
                src="https://bit.ly/dan-abramov"
              />
              <Text>Dan Abrahmov</Text>
            </WrapItem>
          ))}
        </Wrap>
      </VStack>

      {/* Highlight products */}

      {/* All products */}
    </VStack>
  );
};

export default Home;
