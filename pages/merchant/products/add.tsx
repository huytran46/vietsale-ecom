import React from "react";
import type { NextPage } from "next";
import {
  Stack,
  VStack,
  Button,
  Box,
  Text,
  HStack,
  InputGroup,
  InputRightAddon,
  InputLeftAddon,
  Input,
  Icon,
  Wrap,
  WrapItem,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
} from "@chakra-ui/react";
import { BsImage } from "react-icons/bs";
import { useMutation } from "react-query";
import { useFormik } from "formik";
import * as Yup from "yup";

import withSession, { NextSsrIronHandler } from "utils/session";
import { IronSessionKey } from "constants/session";
import { LayoutType } from "constants/common";
import {
  CREATE_SHOP_PRODUCT_MERCH,
  doCreateShopProduct,
} from "services/merchant";

import { CreateProductPayload } from "models/request-response/Merchant";

type MyFormControlProps = {
  id: string;
  isInvalid?: boolean;
  label: string;
  helperTxt?: string;
  errorTxt?: string;
};
const MyFormControl: React.FC<MyFormControlProps> = ({
  id,
  isInvalid,
  label,
  helperTxt,
  errorTxt,
  children,
}) => {
  return (
    <FormControl isInvalid={Boolean(isInvalid)} id={id}>
      <FormLabel fontSize="sm" fontWeight="medium">
        {label}
      </FormLabel>
      {children}
      <FormHelperText fontSize="xs">{helperTxt}</FormHelperText>
      <FormErrorMessage>{errorTxt}</FormErrorMessage>
    </FormControl>
  );
};

const CreateProductSchema = Yup.object().shape({
  productName: Yup.string()
    .min(5, "Tên sản phẩm phải có ít nhất 5 kí tự")
    .nullable(false)
    .required("Không thể thiếu tên sản phẩm"),
  cover: Yup.string().nullable(false).required("Không thể thiếu ảnh đại diện"),
  sku: Yup.string().nullable(false).required("Không thể thiếu SKU sản phẩm"),
  unitValueID: Yup.number()
    .min(0, "Đơn vị tính không hợp lệ")
    .nullable(false)
    .required("Không thể thiếu đơn vị tính"),
  price: Yup.number()
    .min(0, "Giá sản phẩm không hợp lệ")
    .nullable(false)
    .required("Không thể thiếu giá sản phẩm"),
  desc: Yup.string()
    .min(50, "Ít nhất 50 kí tự")
    .nullable(false)
    .required("Không thể thiếu mô tả cho sản phẩm"),
  isPercentDiscount: Yup.boolean().required("Không thể thiếu cách tính giá"),
  cateIDs: Yup.array()
    .of(Yup.string())
    .required("Không thể thiếu danh mục cho sản phẩm"),
  quantity: Yup.number()
    .min(1, "Số lượng sản phẩm không thể nhỏ hơn 1")
    .nullable(false)
    .required("Không thể thiếu số lượng kho"),
  weight: Yup.number()
    .min(0, "Cân nặng không thể âm")
    .nullable(false)
    .required("Không thể thiếu cân nặng"),
  width: Yup.number()
    .min(0, "Chiều rộng không thể âm")
    .nullable(false)
    .required("Không thể thiếu chiều rộng"),
  length: Yup.number()
    .min(0, "Chiều dài không thể âm")
    .nullable(false)
    .required("Không thể thiếu chiều dài"),
  height: Yup.number()
    .min(0, "Chiều cao không thể âm")
    .nullable(false)
    .required("Không thể thiếu chiều cao"),
});

const MerchantAddProducts: NextPage<{ token: string; shopId: string }> = ({
  token,
  shopId,
}) => {
  const { mutateAsync } = useMutation({
    mutationKey: CREATE_SHOP_PRODUCT_MERCH,
    mutationFn: (payload: CreateProductPayload) =>
      doCreateShopProduct(token, shopId, payload),
  });

  const { handleSubmit, values, errors, touched, handleChange, isSubmitting } =
    useFormik<CreateProductPayload>({
      initialValues: {
        productName: "",
        cover: "",
        unitValueID: 1,
        cateIDs: [],
        fileIDs: [],
        desc: "",
        isPercentDiscount: false,
        height: 0.1,
        width: 0.1,
        length: 0.1,
        sku: "",
        price: 1,
        quantity: 1,
        weight: 0.1,
      },
      validationSchema: CreateProductSchema,
      onSubmit(values) {
        mutateAsync(values)
          .then()
          .catch((e) => console.log(e))
          .finally();
      },
    });

  return (
    <VStack spacing={6}>
      <VStack
        bg="white"
        h="fit-content"
        alignItems="flex-start"
        w="full"
        spacing={6}
        p={6}
        boxShadow="md"
        borderRadius="sm"
      >
        <Box>
          <MyFormControl label="Chọn danh mục sản phẩm" id="cateIDs">
            <Input
              id="cateIDs"
              type="text"
              focusBorderColor="none"
              borderLeftRadius="sm"
              colorScheme="brand"
              variant="outline"
              placeholder="Nhập tên danh mục sản phẩm"
              onChange={handleChange}
            />
          </MyFormControl>
        </Box>
      </VStack>
      <VStack
        bg="white"
        h="fit-content"
        alignItems="flex-start"
        w="full"
        spacing={6}
        p={6}
        boxShadow="md"
        borderRadius="sm"
      >
        <VStack spacing={6} alignItems="flex-start" as="form" w="full">
          <Wrap spacing={12} maxW="full">
            <WrapItem>
              <MyFormControl label="Hình ảnh đại diện" id="cover">
                <VStack alignItems="flex-start">
                  <Box
                    h="120px"
                    w="120px"
                    borderWidth="1px"
                    borderColor="gray.300"
                    borderRadius="sm"
                    d="grid"
                    placeItems="center"
                  >
                    <Icon fontSize="xx-large" as={BsImage} />
                  </Box>
                  <Button
                    size="xs"
                    w="120px"
                    variant="ghost"
                    borderColor="gray.300"
                    borderRadius="sm"
                    boxShadow="none"
                    _hover={{
                      bg: "gray.light",
                    }}
                    _active={{
                      bg: "gray.light",
                    }}
                    _focus={{
                      ring: 0,
                    }}
                  >
                    Chọn tệp
                  </Button>
                </VStack>
              </MyFormControl>
            </WrapItem>
            <WrapItem>
              <MyFormControl label="Ảnh mô tả" id="fileIDs">
                <Wrap>
                  {Array.from(Array(8).keys()).map((_, idx) => (
                    <WrapItem key={idx}>
                      <Box
                        h="60px"
                        w="60px"
                        borderWidth="1px"
                        borderStyle="dashed"
                        borderColor="gray.300"
                        borderRadius="sm"
                        d="grid"
                        placeItems="center"
                      >
                        <Icon fontSize="xl" as={BsImage} />
                      </Box>
                    </WrapItem>
                  ))}
                </Wrap>
              </MyFormControl>
            </WrapItem>
          </Wrap>

          <Wrap spacing={12} maxW="full">
            <WrapItem>
              <MyFormControl label="Tên sản phẩm" id="productName">
                <Input
                  id="productName"
                  type="text"
                  focusBorderColor="none"
                  borderLeftRadius="sm"
                  colorScheme="brand"
                  variant="outline"
                  placeholder="Tên sản phẩm"
                  onChange={handleChange}
                />
              </MyFormControl>
            </WrapItem>
            <WrapItem minW="400px">
              <MyFormControl label="Mô tả ngắn" id="shortDesc">
                <Textarea
                  id="shortDesc"
                  type="text"
                  focusBorderColor="none"
                  borderLeftRadius="sm"
                  colorScheme="brand"
                  variant="outline"
                  fontSize="sm"
                  placeholder="Mô tả nội dung, tính năng, điểm nổi bật sản phẩm..."
                  onChange={handleChange}
                />
              </MyFormControl>
            </WrapItem>
          </Wrap>

          <Wrap spacing={12} maxW="full">
            <WrapItem>
              <MyFormControl label="Giá sản phẩm" id="price">
                <InputGroup w="200px">
                  <InputLeftAddon borderLeftRadius="sm">đ</InputLeftAddon>
                  <NumberInput
                    id="price"
                    size="sm"
                    colorScheme="brand"
                    focusBorderColor="none"
                    borderLeftRadius="sm"
                    defaultValue={1}
                    min={1}
                    onChange={handleChange}
                    allowMouseWheel
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </InputGroup>
              </MyFormControl>
            </WrapItem>
          </Wrap>

          <Wrap spacing={12} maxW="full">
            <WrapItem>
              <MyFormControl
                label="Kích thước"
                id="size"
                helperTxt="Kích thước sẽ được dùng để tính cước vận chuyển cho món hàng."
              >
                <Stack direction={["column", "row"]} spacing={1} w="full">
                  <InputGroup w="200px">
                    <Input
                      focusBorderColor="none"
                      borderLeftRadius="sm"
                      colorScheme="brand"
                      variant="outline"
                      placeholder="Chiều rộng"
                    />
                    <InputRightAddon borderRightRadius="sm">cm</InputRightAddon>
                  </InputGroup>
                  <InputGroup w="200px">
                    <Input
                      focusBorderColor="none"
                      borderLeftRadius="sm"
                      colorScheme="brand"
                      variant="outline"
                      placeholder="Chiều dài"
                    />
                    <InputRightAddon borderRightRadius="sm">cm</InputRightAddon>
                  </InputGroup>
                  <InputGroup w="200px">
                    <Input
                      focusBorderColor="none"
                      borderLeftRadius="sm"
                      colorScheme="brand"
                      variant="outline"
                      placeholder="Chiều cao"
                    />
                    <InputRightAddon borderRightRadius="sm">cm</InputRightAddon>
                  </InputGroup>
                </Stack>
              </MyFormControl>
            </WrapItem>
          </Wrap>
        </VStack>
      </VStack>

      <VStack
        bg="white"
        h="fit-content"
        alignItems="flex-start"
        w="full"
        spacing={6}
        p={6}
        boxShadow="md"
        borderRadius="sm"
      >
        <Box>
          <MyFormControl label="Mô tả đầy đủ sản phẩm" id="cateIDs">
            <Input
              id="cateIDs"
              type="text"
              focusBorderColor="none"
              borderLeftRadius="sm"
              colorScheme="brand"
              variant="outline"
              placeholder="Nhập tên danh mục sản phẩm"
              onChange={handleChange}
            />
          </MyFormControl>
        </Box>
      </VStack>
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
  return {
    props: {
      token: auth,
      shopId: shop_id,
      layout: LayoutType.MERCH,
    },
  };
};

export const getServerSideProps = withSession(handler);

export default MerchantAddProducts;
