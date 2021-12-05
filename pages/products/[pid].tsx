import React from "react";
import {
  Box,
  Text,
  VStack,
  Flex,
  Image,
  Wrap,
  WrapItem,
  Badge,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberIncrementStepper,
  Grid,
  GridItem,
  HStack,
  Avatar,
  Icon,
  StackDivider,
  Button,
  Table,
  Tbody,
  Td,
  Tr,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Accordion,
  SimpleGrid,
  Spinner,
  useDisclosure,
  Spacer,
} from "@chakra-ui/react";
import { BsStarFill, BsChatDots } from "react-icons/bs";
import { AiOutlineShop } from "react-icons/ai";
import { FaShippingFast, FaShoppingCart } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import ImageViewer from "react-simple-image-viewer";
import ReactHtmlParser from "react-html-parser";

import { NextPage } from "next";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from "react-query";

import {
  fetchProductDetail,
  fetchProductDetailRelatives,
  FETCH_PRODUCT_DETAIL_RELATIVE_URI,
  FETCH_PRODUCT_DETAIL_URI,
} from "services/product";
import { brandRing, formatCcy, randInt } from "utils";
import { useUser } from "context/UserProvider";
import MetaCard from "components/MetaCard";
import ProductItem from "components/ProductItem";
import UserAddressModal from "components/UserAddressModal";
import { useCartCtx } from "context/CartProvider";
import MyLinkOverlay from "components/common/MyLinkOverlay";
import withSession, { NextSsrIronHandler } from "utils/session";
import { IronSessionKey } from "constants/session";

const DEFAULT_QTY = 1;
const MINIMUM_QTY = 1;

const ProductDetail: NextPage<{ token?: string }> = ({ token }) => {
  const router = useRouter();
  const { pid } = router.query;
  const { data: productDetail, isLoading } = useQuery(
    [FETCH_PRODUCT_DETAIL_URI, pid],
    ({ queryKey }) => fetchProductDetail(queryKey[1] as string),
    {
      enabled: (pid?.length ?? 0) > 0,
    }
  );
  const { data: productRelatives, isLoading: isRelativeLoading } = useQuery(
    [FETCH_PRODUCT_DETAIL_RELATIVE_URI, pid],
    ({ queryKey }) => fetchProductDetailRelatives(queryKey[1] as string),
    {
      enabled: (pid?.length ?? 0) > 0,
    }
  );

  const [amt, setValue] = React.useState(DEFAULT_QTY);

  const productCoverUrl = React.useMemo(
    () =>
      productDetail?.edges?.cover?.file_thumbnail || "https://fakeimg.pl/600/",
    [productDetail?.edges?.cover?.file_thumbnail]
  );

  const [coverUrl, setCoverUrl] = React.useState<string>(productCoverUrl);
  const [currentImage, setCurrentImage] = React.useState(0);
  const [isViewerOpen, setIsViewerOpen] = React.useState(false);
  const { user, fullDetailAddress, defaultAddress } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { updateCartItem } = useCartCtx();

  const shopInfo = React.useMemo(
    () => productDetail?.edges?.owner,
    [productDetail]
  );

  const productFiles = React.useMemo(
    () => productDetail?.edges?.files?.map((f) => f.file_thumbnail) || [],
    [productDetail?.edges?.files]
  );

  const isDiscount = React.useMemo(() => {
    return (
      productDetail?.discount_price !== 0 &&
      Boolean(productDetail?.discount_price)
    );
  }, [productDetail]);

  const openImageViewer = React.useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const fileImgIdx = React.useCallback(
    (url: string) => {
      if (!productFiles) return 0;
      const fidx = productFiles.indexOf(url);
      return fidx < 0 ? 0 : fidx;
    },
    [productFiles]
  );

  const productCategories = React.useMemo(
    () => productDetail?.edges?.categories?.map((pc) => pc.category_name) ?? [],
    [productDetail?.edges?.categories]
  );

  const descHTML = React.useMemo(
    () =>
      productDetail?.desc !==
      '<p dir="ltr" style="margin-top:0; margin-bottom:0;"></p>' ? (
        <Box fontSize="sm">{ReactHtmlParser(productDetail?.desc ?? "")}</Box>
      ) : (
        <Text fontSize="sm">Không có mô tả cho sản phẩm này.</Text>
      ),
    [productDetail?.desc]
  );

  const productsYouMayLike = React.useMemo(() => {
    if (!productRelatives) return [];
    const idx = randInt(productRelatives.length - 6);
    return productRelatives && productRelatives.slice(idx, idx + 6);
  }, [productRelatives]);

  React.useEffect(() => {
    setCoverUrl(productCoverUrl);
  }, [productCoverUrl]);

  if (isLoading) return <Text>Đang tải trang...</Text>;
  if (!productDetail) return null;

  const handleChangeAmt = (_: string, valueAsNumber: number) =>
    setValue(valueAsNumber);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  const handleAddToCart = () => {
    if (!productDetail) return;
    updateCartItem(productDetail.id, amt);
  };

  return (
    <VStack py={10} h="fit-content" minHeight="full" spacing={10}>
      <Flex
        borderWidth="1px"
        borderColor="gray.200"
        borderRadius="md"
        p={5}
        bg="white"
        h="fit-content"
        w="full"
        gridGap={3}
      >
        <VStack flex={1} spacing={3}>
          <Box cursor="pointer">
            <Image
              h="500px"
              w="full"
              maxH="full"
              maxW="full"
              src={coverUrl}
              alt={productDetail?.name ?? "product-cover"}
              onClick={() => openImageViewer(fileImgIdx(coverUrl))}
            />
          </Box>
          {isViewerOpen && (
            <ImageViewer
              src={productFiles}
              currentIndex={currentImage}
              disableScroll={false}
              closeOnClickOutside={true}
              onClose={closeImageViewer}
            />
          )}
          <Wrap flex={1} direction="row" w="full">
            {productFiles.map((fileUrl, idx) => (
              <WrapItem
                key={idx}
                h="100px"
                w="100px"
                borderWidth={coverUrl === fileUrl ? "2px" : "0px"}
                borderColor={coverUrl === fileUrl ? "brand.700" : "gray.200"}
                onMouseEnter={() => setCoverUrl(fileUrl)}
                onClick={() => openImageViewer(idx)}
                cursor="pointer"
              >
                <Image
                  maxH="full"
                  maxW="full"
                  h="full"
                  w="full"
                  src={fileUrl}
                  alt={fileUrl}
                />
              </WrapItem>
            ))}
          </Wrap>
        </VStack>

        <VStack alignItems="flex-start" spacing={6} flex={2}>
          <VStack spacing={1} alignItems="flex-start">
            <Text fontSize="2xl">{productDetail.name}</Text>
            <HStack divider={<StackDivider />} alignItems="center">
              <HStack>
                <Icon color="yellow.300" as={BsStarFill} />
                <Icon color="yellow.300" as={BsStarFill} />
                <Icon color="yellow.300" as={BsStarFill} />
                <Icon color="yellow.300" as={BsStarFill} />
                <Icon color="yellow.300" as={BsStarFill} />
              </HStack>
              <Text m={0} fontSize="sm" fontWeight="medium" color="gray.500">
                Đã bán {productDetail.sales_volume ?? 0}
              </Text>
            </HStack>
          </VStack>
          <Grid
            h="full"
            w="full"
            templateColumns={[
              "repeat(1, 1fr)",
              "repeat(3, 1fr)",
              "repeat(5, 1fr)",
            ]}
            gap={3}
          >
            <GridItem d="flex" flexDir="column" gridGap={3} colSpan={[1, 2, 3]}>
              <HStack spacing="2">
                <Text fontSize="2xl" fontWeight="bold" color="red.500">
                  {isDiscount
                    ? formatCcy(productDetail.discount_price) + " đ"
                    : Boolean(productDetail.orig_price)
                    ? formatCcy(productDetail.orig_price) + " đ"
                    : "Liên hệ để báo giá"}
                </Text>
                {isDiscount && (
                  <Box d="flex" alignItems="flex-end">
                    <Text
                      color="gray.500"
                      textDecorationLine="line-through"
                      fontSize="lg"
                    >
                      {formatCcy(productDetail.orig_price)} đ
                    </Text>
                  </Box>
                )}
                {isDiscount && (
                  <Box d="flex" alignItems="center">
                    <Badge
                      borderWidth="1px"
                      borderColor="red.500"
                      colorScheme="red"
                      textTransform="none"
                    >
                      <Text color="red.500" fontSize="md">
                        -{formatCcy(productDetail.discount_value)}
                        {productDetail.is_percent_discount ? "%" : " đ"}
                      </Text>
                    </Badge>
                  </Box>
                )}
              </HStack>
              <Box py={3}>
                <Text fontSize="sm">
                  {productDetail.short_desc ?? "Không có miêu tả ngắn"}
                </Text>
              </Box>
              <Box
                p={3}
                borderWidth="1px"
                borderColor="gray.300"
                borderRadius="md"
              >
                {Boolean(user) && (
                  <VStack spacing={1} alignItems="flex-start">
                    <Flex w="full">
                      <Text fontSize="sm" fontWeight="medium">
                        Giao đến
                      </Text>
                      <Spacer />
                      <UserAddressModal
                        isOpen={isOpen}
                        onOpen={onOpen}
                        onClose={onClose}
                      >
                        <Text
                          cursor="pointer"
                          fontSize="sm"
                          fontWeight="medium"
                          color="brand.500"
                        >
                          Thay đổi
                        </Text>
                      </UserAddressModal>
                    </Flex>
                    <HStack divider={<StackDivider />} w="full">
                      <Text fontSize="xs" fontWeight="medium" color="brand.500">
                        {defaultAddress?.fullname}
                      </Text>
                      <Text fontSize="xs" fontWeight="medium">
                        {defaultAddress?.phone}
                      </Text>
                    </HStack>
                    <Text fontSize="xs">{fullDetailAddress}</Text>
                  </VStack>
                )}

                {(!Boolean(user) || !Boolean(token)) && (
                  <VStack>
                    <Text fontSize="xs">
                      Hãy{" "}
                      <MyLinkOverlay
                        href="/login"
                        cursor="pointer"
                        fontWeight="semibold"
                        color="brand.500"
                        fontSize="xs"
                      >
                        đăng nhập
                      </MyLinkOverlay>{" "}
                      để nhận thông tin về phí giao hàng chính xác nhất.
                    </Text>
                  </VStack>
                )}

                {Boolean(user) && Boolean(token) && !Boolean(defaultAddress) && (
                  <VStack>
                    <Text fontSize="xs">
                      Hãy nhập địa chỉ để nhận báo giá chính xác về phí vận
                      chuyển
                    </Text>
                    <UserAddressModal
                      isOpen={isOpen}
                      onOpen={onOpen}
                      onClose={onClose}
                      token={token}
                    >
                      <Text
                        cursor="pointer"
                        fontWeight="semibold"
                        color="brand.500"
                        fontSize="xs"
                      >
                        Nhập địa chỉ <Icon fontSize="md" as={FaShippingFast} />
                      </Text>
                    </UserAddressModal>
                  </VStack>
                )}
              </Box>
              <Box>
                <Text mt={3} mb={2} fontSize="sm" fontWeight="medium">
                  Thông tin chi tiết
                </Text>
                <Box borderWidth="1px" borderColor="gray.300" borderRadius="md">
                  <Table size="sm">
                    <Tbody>
                      <Tr>
                        <Td borderTopLeftRadius="md">
                          <Text fontSize="xs">Danh mục</Text>
                        </Td>
                        <Td borderTopRightRadius="md">
                          <Text fontSize="xs">
                            {productCategories.join(", ")}
                          </Text>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td border="none">
                          <Text fontSize="xs">Số lượng trong kho</Text>
                        </Td>
                        <Td border="none">
                          <Text fontSize="xs">{productDetail.quantity}</Text>
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </Box>
              </Box>
              <Spacer />
              <HStack mt={6} spacing={3}>
                <NumberInput
                  maxW="100px"
                  value={amt}
                  min={MINIMUM_QTY}
                  max={productDetail.quantity}
                  onChange={handleChangeAmt}
                  {...brandRing}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                {user ? (
                  <Button
                    w="full"
                    disabled={productDetail.quantity === amt}
                    leftIcon={<Icon as={FaShoppingCart} />}
                    bg="red.500"
                    _focus={{
                      ringColor: "red.100",
                      ring: 4,
                      bg: "red.600",
                    }}
                    _active={{
                      bg: "red.600",
                    }}
                    _hover={{
                      bg: "red.600",
                    }}
                    onClick={handleAddToCart}
                    borderColor="red.700"
                    textShadow="md"
                  >
                    Thêm vào giỏ
                  </Button>
                ) : (
                  <Box
                    fontSize="sm"
                    w="full"
                    h="full"
                    p={3}
                    borderWidth="1px"
                    borderStyle="dashed"
                    borderRadius="md"
                  >
                    Vui lòng{" "}
                    <MyLinkOverlay color="brand.700" href="/login">
                      đăng nhập
                    </MyLinkOverlay>{" "}
                    để đặt hàng, nếu chưa có tài khoản bấm vào{" "}
                    <MyLinkOverlay color="brand.700" href="/register">
                      đây
                    </MyLinkOverlay>{" "}
                    để tạo tài khoản.
                  </Box>
                )}
              </HStack>
            </GridItem>
            <GridItem colSpan={[1, 1, 2]}>
              <VStack
                borderWidth="1px"
                borderColor="gray.300"
                borderRadius="md"
                p={2}
                spacing={3}
              >
                <HStack
                  w="full"
                  alignItems="center"
                  justifyContent="flex-start"
                  mt={3}
                >
                  <Avatar
                    borderWidth="1px"
                    borderColor="gray.300"
                    src={
                      shopInfo?.edges?.avatar?.file_thumbnail ?? "/favicon.png"
                    }
                  />
                  <VStack spacing={1} alignItems="flex-start">
                    <Text fontWeight="semibold">{shopInfo?.shop_name}</Text>
                    <Text fontSize="xs">{shopInfo?.email}</Text>
                  </VStack>
                </HStack>
                <VStack w="full" spacing={1} alignItems="flex-start">
                  <Text fontWeight="medium" color="brand.700" fontSize="sm">
                    <Icon fontSize="sm" as={HiLocationMarker} />
                    &nbsp;Địa chỉ
                  </Text>
                  <Text fontSize="xs">{shopInfo?.shop_address}</Text>
                </VStack>
                <HStack
                  w="full"
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <Button
                    variant="outline"
                    color="brand.700"
                    size="sm"
                    w="full"
                    leftIcon={<Icon fontSize="16px" as={AiOutlineShop} />}
                    onClick={async () =>
                      await router.push(`/shop/${shopInfo?.id}/products`)
                    }
                  >
                    Xem shop
                  </Button>
                  <Button
                    disabled
                    variant="outline"
                    color="brand.700"
                    size="sm"
                    w="full"
                    leftIcon={<Icon fontSize="16px" as={BsChatDots} />}
                  >
                    Chat với shop
                  </Button>
                </HStack>
              </VStack>
            </GridItem>
          </Grid>
        </VStack>
      </Flex>

      <VStack
        borderWidth="1px"
        borderColor="gray.200"
        borderRadius="md"
        bg="white"
        w="full"
        alignItems="flex-start"
        p={3}
      >
        <Text mb={1} fontSize="xl" fontWeight="medium">
          Có thể bạn quan tâm
        </Text>
        <SimpleGrid w="full" rowGap={3} columnGap={1} columns={[1, 2, 4, 6]}>
          {isRelativeLoading && (
            <Spinner
              colorScheme="brand"
              color="brand.500"
              speed="1s"
              size="sm"
            />
          )}
          {productsYouMayLike.map((p, idx) => (
            <ProductItem key={idx} product={p} />
          ))}
        </SimpleGrid>
      </VStack>

      <Accordion
        allowMultiple
        w="full"
        borderRadius="md"
        borderWidth="1px"
        borderColor="gray.100"
        bg="white"
      >
        <AccordionItem border="none">
          <AccordionButton _focus={{ ring: 0 }}>
            <Box flex="1" textAlign="left">
              <Text fontSize="xl" fontWeight="medium">
                Mô tả chi tiết sản phẩm
              </Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>{descHTML}</AccordionPanel>
        </AccordionItem>
      </Accordion>

      <MetaCard
        title="Sản phẩm tương tự"
        bodyProps={{
          bg: "white",
        }}
        noBody
      >
        <SimpleGrid rowGap={3} columnGap={1} columns={[1, 2, 4, 6]}>
          {isRelativeLoading && (
            <Spinner
              colorScheme="brand"
              color="brand.500"
              speed="1s"
              size="sm"
            />
          )}
          {productRelatives?.map((prod, idx) => (
            <ProductItem key={idx} product={prod} />
          ))}
        </SimpleGrid>
      </MetaCard>
    </VStack>
  );
};

const handler: NextSsrIronHandler = async function ({ req, res, query }) {
  const auth = req.session.get(IronSessionKey.AUTH);

  if (!query) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { pid } = query;
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

  await queryClient.prefetchQuery(
    [FETCH_PRODUCT_DETAIL_RELATIVE_URI, pid],
    ({ queryKey }) => fetchProductDetailRelatives(queryKey[1] as string)
  );

  return {
    props: {
      token: auth,
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export const getServerSideProps = withSession(handler);

export default ProductDetail;
