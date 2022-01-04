import React from "react";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import {
  useToast,
  useBoolean,
  Stack,
  VStack,
  Button,
  Box,
  Text,
  HStack,
  Select,
  InputGroup,
  InputRightAddon,
  InputLeftAddon,
  Input,
  Icon,
  Wrap,
  WrapItem,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  ListItem,
  AlertIcon,
  Alert,
  AlertTitle,
  AlertDescription,
  OrderedList,
} from "@chakra-ui/react";
import { BsImage, BsXCircle } from "react-icons/bs";
import {
  useMutation,
  useQuery,
  useQueryClient,
  QueryClient,
  dehydrate,
} from "react-query";
import { useFormik } from "formik";
import * as Yup from "yup";

import withSession, { NextSsrIronHandler } from "utils/session";
import { IronSessionKey } from "constants/session";
import { LayoutType } from "constants/common";
import {
  doEditShopProduct,
  fetchShopProductDetailForMerch,
  FETCH_SHOP_PRODUCT_DETAIL_MERCH,
  UPDATE_SHOP_PRODUCT_MERCH,
} from "services/merchant";
import { CreateProductPayload } from "models/request-response/Merchant";
import styles from "./add.module.css";
import { formatCcy } from "utils";
import UploadFileModal from "components/UploadFileModal";
import { useFileCtx } from "context/FileProvider";
import { MyImage } from "components/common/MyImage";
import { FETCH_CATEGORIES, fetchProductCategories } from "services/public";
import { useUser } from "context/UserProvider";
import MyFormControl from "components/MyFormControl";
import { Autocomplete } from "components/common/Autocomplete";
import { useRouter } from "next/router";

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const UpdateProductSchema = Yup.object().shape({
  productName: Yup.string().min(5, "Tên sản phẩm phải có ít nhất 5 kí tự"),
  cover: Yup.string(),
  sku: Yup.string(),
  unitValueID: Yup.number().min(0, "Đơn vị tính không hợp lệ"),
  price: Yup.number().min(0, "Giá sản phẩm không hợp lệ"),
  desc: Yup.string().min(50, "Mô tả phải ít nhất 50 kí tự"),
  isPercentDiscount: Yup.boolean(),
  cateIDs: Yup.array().of(Yup.string()),
  quantity: Yup.number().min(1, "Số lượng sản phẩm không thể nhỏ hơn 1"),
  weight: Yup.number().min(0, "Cân nặng không thể âm"),
  width: Yup.number().min(0, "Chiều rộng không thể âm"),
  length: Yup.number().min(0, "Chiều dài không thể âm"),
  height: Yup.number().min(0, "Chiều cao không thể âm"),
});

const NUMBER_OF_PLACEHOLDERS = 8;

const MerchantAddProducts: NextPage<{
  token: string;
  shopId: string;
  pid: string;
}> = ({ token, shopId, pid }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [categoryName, setCategoryName] = React.useState("");
  const [isUploadFileOpen, uploadModalHandler] = useBoolean();

  const { mutate } = useMutation({
    mutationKey: UPDATE_SHOP_PRODUCT_MERCH,
    mutationFn: (payload: CreateProductPayload) =>
      doEditShopProduct(token, shopId, pid, payload),
    onSettled: () => {
      queryClient.invalidateQueries([
        FETCH_SHOP_PRODUCT_DETAIL_MERCH,
        token,
        shopId,
        pid,
      ]);
    },
  });

  const {
    data: productDetail,
    isLoading: pd1,
    isFetching: pd2,
    isRefetching: pd3,
  } = useQuery({
    queryKey: [FETCH_SHOP_PRODUCT_DETAIL_MERCH, token, shopId, pid],
    queryFn: ({ queryKey }) =>
      fetchShopProductDetailForMerch(queryKey[1], queryKey[2], queryKey[3]),
  });

  const isProductDetailLoading = React.useMemo(
    () => !Boolean(productDetail) || pd1 || pd2 || pd3,
    [pd1, pd2, pd3, productDetail]
  );

  const {
    data: productCategories,
    isLoading: pc1,
    isFetching: pc2,
    isRefetching: pc3,
  } = useQuery({
    queryKey: FETCH_CATEGORIES,
    queryFn: fetchProductCategories,
  });

  const isCategoriesLoading = React.useMemo(
    () => !Boolean(productCategories) || pc1 || pc2 || pc3,
    [pc1, pc2, pc3, productCategories]
  );

  const {
    handleSubmit,
    values,
    errors,
    handleChange,
    isSubmitting,
    isValid,
    setFieldValue,
  } = useFormik<CreateProductPayload>({
    initialValues: {
      productName: productDetail?.name ?? "",
      cover: productDetail?.edges?.cover?.id ?? "",
      unitValueID: productDetail?.edges?.uom_using?.id ?? 0,
      cateIDs: productDetail?.edges?.categories?.map((ct) => ct.id) ?? [],
      fileIDs: productDetail?.edges?.files?.map((f) => f.id) ?? [],
      // shortDesc: productDetail?.short_desc ?? "",
      desc: productDetail?.desc ?? "",
      isPercentDiscount: productDetail?.is_percent_discount ?? false,
      discountValue: productDetail?.discount_value ?? 0,
      height: productDetail?.height ?? 1,
      width: productDetail?.width ?? 1,
      length: productDetail?.length ?? 1,
      sku: productDetail?.sku ?? "",
      price: productDetail?.orig_price ?? 1000,
      quantity: productDetail?.quantity ?? 1,
      weight: productDetail?.weight ?? 1,
    },
    validationSchema: UpdateProductSchema,
    onSubmit(values, actions) {
      mutate(values, {
        onSettled() {
          queryClient.invalidateQueries([
            FETCH_SHOP_PRODUCT_DETAIL_MERCH,
            token,
            shopId,
            pid,
          ]);
          actions.setSubmitting(false);
        },
        onSuccess(res) {
          if (!res.success) {
            toast({
              status: "error",
              title: "Lỗi",
              description: res.message,
            });
            return;
          }
          toast({
            status: "success",
            title: "Thành công",
            description: "Cập nhật sản phẩm thành công, vui lòng đợi QTV duyệt",
          });
          router.back();
        },
      });
    },
  });

  const [selectedCategoryIds, setCategoryIds] = React.useState<string[]>(
    productDetail?.edges?.categories?.map((ct) => ct.id) ?? []
  );

  const { selectedMyFile, selectedMyFiles, setSelFileIds, setFileId } =
    useFileCtx();

  const { shopInfo } = useUser();

  const [selectedUOM, setUOM] = React.useState<number>();

  const [uploadMode, setUploadMode] = React.useState<number>(1);

  const UOMs = React.useMemo(() => {
    const units = shopInfo?.edges?.unitOfMeasures ?? [];
    setUOM(units[0]?.id);
    return units;
  }, [shopInfo]);

  const UOMValues = React.useMemo(() => {
    const selectedValues =
      UOMs.find((u) => u.id === selectedUOM)?.edges?.values ?? [];
    setFieldValue("unitValueID", selectedValues[0]?.id);
    return selectedValues;
  }, [selectedUOM, UOMs, setFieldValue]);

  const computedDiscountValue = React.useMemo(() => {
    if (values.isPercentDiscount) {
      const discounted = (values.price * (values.discountValue ?? 0)) / 100;
      return (values.price - discounted).toFixed(2);
    }
    return values.price - (values.discountValue ?? 0);
  }, [values.discountValue, values.price, values.isPercentDiscount]);

  const placeholdersItems = React.useMemo(
    () =>
      NUMBER_OF_PLACEHOLDERS -
        selectedMyFiles.filter((_) => Boolean(_)).length >
      0
        ? NUMBER_OF_PLACEHOLDERS -
          selectedMyFiles.filter((_) => Boolean(_)).length
        : 0,
    [selectedMyFiles]
  );

  const toggleCategory = React.useCallback(
    (pcid: string) => {
      const idx = selectedCategoryIds.indexOf(pcid);
      const next = [...selectedCategoryIds];
      if (idx < 0) {
        next.push(pcid);
      } else {
        next.splice(idx, 1);
      }
      setCategoryIds(next);
    },
    [selectedCategoryIds]
  );

  const selectedProductCategories = React.useMemo(() => {
    if (!productCategories) return;
    return productCategories.filter(
      (pc) => selectedCategoryIds.indexOf(pc.id) > -1
    );
  }, [selectedCategoryIds, productCategories]);

  React.useEffect(() => {
    if (!productDetail) return;
    setFileId(productDetail.edges?.cover?.id ?? "");
    setSelFileIds(productDetail?.edges?.files?.map((f) => f.id) ?? []);
    const uomValueId = productDetail?.edges?.uom_using?.id;
    if (!uomValueId) return;
    const uom = UOMs.find((u) =>
      u.edges.values.find((uv) => uv.id === uomValueId)
    );
    setUOM(uom?.id);
    setFieldValue("unitValueID", uomValueId);
  }, [productDetail, setSelFileIds, setFileId, setFieldValue, UOMs]);

  React.useEffect(() => {
    setFieldValue("cateIDs", selectedCategoryIds);
  }, [selectedCategoryIds, setFieldValue]);

  React.useEffect(() => {
    setFieldValue("cover", selectedMyFile?.id);
  }, [selectedMyFile, setFieldValue]);

  React.useEffect(() => {
    const nextFiles = selectedMyFiles
      ?.filter((_) => Boolean(_))
      .map((f) => f?.id);

    if (nextFiles.length > NUMBER_OF_PLACEHOLDERS) {
      return;
    }

    setFieldValue(
      "fileIDs",
      selectedMyFiles?.filter((_) => Boolean(_)).map((f) => f?.id)
    );
  }, [selectedMyFiles, setFieldValue]);

  if (isProductDetailLoading) {
    return (
      <Box w="full" p={3}>
        <Text>Đang tải...</Text>
      </Box>
    );
  }

  return (
    <VStack spacing={6} pb={12}>
      <Box w="full">
        <Alert status="info" flexDirection="column" alignItems="center">
          <AlertIcon />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Quy trình cập nhật sản phẩm
          </AlertTitle>
          <AlertDescription fontSize="sm" maxWidth="xl">
            <Text>
              Sau khi cập nhật thông tin sản phẩm, đội Quản trị viên{" "}
              <b>Việt Sale</b> sẽ kiểm duyệt sản phẩm trong vòng 24h. Nếu sản
              phẩm đạt chuẩn sẽ được xuất hiện trên hệ thống, người dùng có thể
              mua được.
            </Text>
            <Text>
              <b>Lưu ý:</b> Nếu số lượng sản phẩm bằng 0 <b>HOẶC</b> bị chặn bởi
              quản trị viên <b>HOẶC</b> chưa được duyệt thì sẽ không xuất hiện
              trên hệ thống, người dùng sẽ không nhìn thấy được sản phẩm của
              bạn.
            </Text>
          </AlertDescription>
        </Alert>
      </Box>

      {Object.values(errors).length > 0 && (
        <Box w="full">
          <Alert
            status="error"
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="center"
          >
            <AlertTitle d="flex" mt={4} mb={1} fontSize="lg">
              <AlertIcon />
              Lỗi
            </AlertTitle>
            <AlertDescription fontSize="sm" maxWidth="sm">
              <OrderedList w="full">
                {Object.values(errors).map((e, idx) => (
                  <ListItem key={idx}>{e}</ListItem>
                ))}
              </OrderedList>
            </AlertDescription>
          </Alert>
        </Box>
      )}

      <HStack
        bg="white"
        h="fit-content"
        alignItems="flex-start"
        w="full"
        spacing={6}
        p={6}
        boxShadow="md"
        borderRadius="sm"
      >
        <MyFormControl
          id="cateName"
          label="Chọn danh mục sản phẩm"
          errorTxt={`${errors.cateIDs}`}
        >
          <Autocomplete
            isLoading={isCategoriesLoading}
            placeholder="Nhập tên danh mục"
            headerText="Chọn danh mục sản phẩm"
            suggestions={
              productCategories?.map((pc, idx) => ({
                idx,
                label: pc.category_name,
                id: pc.id,
              })) ?? []
            }
            selectedSuggestions={selectedCategoryIds}
            userInput={categoryName}
            onChange={(input: string) => {
              setCategoryName(input);
            }}
            onSelect={(id: string) => toggleCategory(id)}
          />
        </MyFormControl>

        <MyFormControl label="Danh mục đang chọn" id="cateIDs">
          <Wrap>
            {(!selectedProductCategories ||
              selectedProductCategories.length < 1) && (
              <WrapItem
                d="grid"
                placeItems="center"
                borderWidth="1px"
                borderRadius="sm"
                borderStyle="dashed"
                h="32px"
                px={1}
              >
                <Text fontSize="xs" color="gray.400">
                  Danh mục 1
                </Text>
              </WrapItem>
            )}
            {selectedProductCategories?.map((pc, idx) => (
              <WrapItem
                key={idx}
                d="flex"
                alignItems="center"
                borderWidth="1px"
                borderRadius="sm"
                h="32px"
                px={1}
                cursor="pointer"
                onClick={() => toggleCategory(pc.id)}
              >
                <Text fontSize="xs" mr={2}>
                  {pc.category_name}
                </Text>
                <Icon color="gray" as={BsXCircle} />
              </WrapItem>
            ))}
          </Wrap>
        </MyFormControl>
      </HStack>

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
              <MyFormControl
                id="cover"
                label="Hình ảnh đại diện"
                errorTxt={errors.cover}
              >
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
                    {selectedMyFile ? (
                      <VStack position="relative">
                        <MyImage
                          src={selectedMyFile.file_thumbnail}
                          height="120px"
                          width="120px"
                        />
                        <Text
                          position="absolute"
                          bottom="0"
                          left="0"
                          right="0"
                          fontSize="xs"
                          bg="white"
                          textAlign="center"
                          borderTopWidth="1px"
                          borderTop="gray.300"
                          color="brand.500"
                          isTruncated
                        >
                          {selectedMyFile.file_name}
                        </Text>
                      </VStack>
                    ) : (
                      <Icon fontSize="xx-large" as={BsImage} />
                    )}
                  </Box>

                  <UploadFileModal
                    isOpen={isUploadFileOpen && uploadMode === 1}
                    token={token}
                    shopId={shopId}
                    onClose={uploadModalHandler.off}
                    onOpen={() => {
                      setUploadMode(1);
                      uploadModalHandler.on();
                    }}
                    defaultPanel={uploadMode}
                  >
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
                  </UploadFileModal>
                </VStack>
              </MyFormControl>
            </WrapItem>

            <WrapItem>
              <MyFormControl
                label="Ảnh mô tả"
                id="fileIDs"
                errorTxt={errors.fileIDs}
              >
                <UploadFileModal
                  isOpen={isUploadFileOpen && uploadMode === 2}
                  token={token}
                  shopId={shopId}
                  onClose={uploadModalHandler.off}
                  onOpen={() => {
                    setUploadMode(2);
                    uploadModalHandler.on();
                  }}
                  defaultPanel={uploadMode}
                >
                  <Wrap>
                    {selectedMyFiles.map((f, idx) => (
                      <WrapItem key={idx}>
                        <Box
                          h="60px"
                          w="60px"
                          d="grid"
                          placeItems="center"
                          cursor="pointer"
                        >
                          <MyImage
                            src={f?.file_thumbnail ?? ""}
                            height="120px"
                            width="120px"
                          />
                        </Box>
                      </WrapItem>
                    ))}
                    {Array.from(Array(placeholdersItems).keys()).map(
                      (_, idx) => (
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
                            cursor="pointer"
                          >
                            <Icon fontSize="xl" as={BsImage} />
                          </Box>
                        </WrapItem>
                      )
                    )}
                  </Wrap>
                </UploadFileModal>
              </MyFormControl>
            </WrapItem>
          </Wrap>

          <Wrap spacing={12} maxW="full">
            <WrapItem>
              <MyFormControl
                id="productName"
                label="Tên sản phẩm"
                errorTxt={errors.productName}
              >
                <Input
                  id="productName"
                  name="productName"
                  type="text"
                  focusBorderColor="none"
                  borderLeftRadius="sm"
                  colorScheme="brand"
                  variant="outline"
                  placeholder="Tên sản phẩm"
                  value={values.productName}
                  onChange={handleChange}
                />
              </MyFormControl>
            </WrapItem>

            <WrapItem>
              <MyFormControl
                id="sku"
                label="SKU"
                helperTxt="Mã sản phẩm chủ shop tự quản lý"
                errorTxt={errors.sku}
              >
                <Input
                  id="sku"
                  name="sku"
                  type="text"
                  focusBorderColor="none"
                  borderLeftRadius="sm"
                  colorScheme="brand"
                  variant="outline"
                  placeholder="Ví dụ: SK01ABD,..."
                  value={values.sku}
                  onChange={handleChange}
                />
              </MyFormControl>
            </WrapItem>

            {/* <WrapItem minW="400px">
              <MyFormControl
                id="shortDesc"
                label="Mô tả ngắn"
                errorTxt={errors.shortDesc}
              >
                <Textarea
                  id="shortDesc"
                  name="shortDesc"
                  type="text"
                  focusBorderColor="none"
                  borderLeftRadius="sm"
                  colorScheme="brand"
                  variant="outline"
                  fontSize="sm"
                  placeholder="Mô tả nội dung, tính năng, điểm nổi bật sản phẩm..."
                  value={values.shortDesc}
                  onChange={handleChange}
                  // onChange={handleChange}
                />
              </MyFormControl>
            </WrapItem> */}
          </Wrap>

          <Wrap spacing={12} maxW="full">
            <WrapItem>
              <MyFormControl
                label="Đơn vị"
                id="unitValueID"
                helperTxt="Chọn đơn vị cho sản phẩm"
                errorTxt={errors.unitValueID}
              >
                <InputGroup size="sm" w="300px">
                  <InputLeftAddon borderLeftRadius="sm" px={0}>
                    <Select
                      size="sm"
                      focusBorderColor="none"
                      borderLeftRadius="sm"
                      colorScheme="brand"
                      borderWidth="0px"
                      fontSize="sm"
                      m={0}
                      w="full"
                      onChange={(e) => setUOM(parseInt(e.target.value))}
                      value={selectedUOM}
                    >
                      {UOMs.map((uom, idx) => (
                        <option key={idx} value={uom.id}>
                          {uom.measure_name}
                        </option>
                      ))}
                    </Select>
                  </InputLeftAddon>
                  <Select
                    id="unitValueID"
                    name="unitValueID"
                    focusBorderColor="none"
                    borderLeftRadius="sm"
                    colorScheme="brand"
                    value={`${values.unitValueID}`}
                    onChange={(e) =>
                      setFieldValue("unitValueID", parseInt(e.target.value))
                    }
                  >
                    {UOMValues.map((uomval, idx) => (
                      <option key={idx} value={uomval.id}>
                        {uomval.measure_value}
                      </option>
                    ))}
                  </Select>
                </InputGroup>
              </MyFormControl>
            </WrapItem>

            <WrapItem>
              <MyFormControl
                id="quantity"
                label="Số lượng"
                errorTxt={errors.quantity}
              >
                <InputGroup w="200px">
                  <InputLeftAddon borderLeftRadius="sm">
                    {
                      UOMValues.find((u) => u.id === values.unitValueID)
                        ?.measure_value
                    }
                  </InputLeftAddon>
                  <NumberInput
                    id="quantity"
                    name="quantity"
                    size="sm"
                    colorScheme="brand"
                    focusBorderColor="none"
                    borderLeftRadius="sm"
                    min={1}
                    defaultValue={1}
                    onChange={(_, num) => setFieldValue("quantity", num)}
                    value={values.quantity}
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

            <WrapItem>
              <MyFormControl
                id="weight"
                label="Cân nặng"
                errorTxt={errors.weight}
              >
                <InputGroup w="200px">
                  <NumberInput
                    id="weight"
                    name="weight"
                    size="sm"
                    colorScheme="brand"
                    focusBorderColor="none"
                    borderLeftRadius="sm"
                    min={1}
                    defaultValue={1}
                    onChange={(_, num) => setFieldValue("weight", num)}
                    value={values.weight}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <InputRightAddon borderRightRadius="sm">gram</InputRightAddon>
                </InputGroup>
              </MyFormControl>
            </WrapItem>
          </Wrap>

          <Wrap spacing={12} maxW="full">
            <WrapItem>
              <MyFormControl
                id="price"
                label="Giá sản phẩm"
                helperTxt={`Giá hiển thị ${
                  values.price
                    ? `${formatCcy(values.price)}đ`
                    : '"Liên hệ báo giá"'
                }`}
                errorTxt={errors.price}
              >
                <InputGroup w="200px">
                  <InputLeftAddon borderLeftRadius="sm">đ</InputLeftAddon>
                  <NumberInput
                    id="price"
                    name="price"
                    size="sm"
                    colorScheme="brand"
                    focusBorderColor="none"
                    borderLeftRadius="sm"
                    min={0}
                    step={1000}
                    defaultValue={1000}
                    onChange={(_, num) => setFieldValue("price", num)}
                    value={values.price}
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

            <WrapItem>
              <MyFormControl
                id="discountValue"
                label="Giảm"
                helperTxt={`Giá sau khi giảm ${formatCcy(
                  computedDiscountValue
                )}đ`}
                errorTxt={errors.discountValue}
              >
                <InputGroup size="sm" w="200px">
                  <InputLeftAddon p={0} borderLeftRadius="sm">
                    <Select
                      id="isPercentDiscount"
                      name="isPercentDiscount"
                      size="sm"
                      borderRadius="sm"
                      m={0}
                      h="full"
                      borderWidth="0px"
                      _focus={{ ring: 0 }}
                      onChange={(e) =>
                        setFieldValue(
                          "isPercentDiscount",
                          e.target.value === "true"
                        )
                      }
                      value={`${values.isPercentDiscount}`}
                    >
                      <option value="true">%</option>
                      <option value="false">đ</option>
                    </Select>
                  </InputLeftAddon>
                  <NumberInput
                    id="discountValue"
                    name="discountValue"
                    size="sm"
                    colorScheme="brand"
                    focusBorderColor="none"
                    borderLeftRadius="sm"
                    defaultValue={0}
                    min={0}
                    max={Boolean(values.isPercentDiscount) ? 100 : values.price}
                    onChange={(_, num) => setFieldValue("discountValue", num)}
                    value={values.discountValue}
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
                id="size"
                label="Kích thước"
                helperTxt="Kích thước sẽ được dùng để tính cước vận chuyển cho món hàng."
                errorTxt={errors.length ?? errors.width ?? errors.height}
              >
                <Stack
                  alignItems="center"
                  direction={["column", "row"]}
                  divider={
                    <Text fontSize="sm" mx={3} color="gray.400">
                      x
                    </Text>
                  }
                  spacing={1}
                  w="full"
                >
                  <InputGroup w="240px" size="sm">
                    <InputLeftAddon borderLeftRadius="sm">Rộng</InputLeftAddon>
                    <NumberInput
                      id="width"
                      name="width"
                      focusBorderColor="none"
                      borderLeftRadius="sm"
                      colorScheme="brand"
                      variant="outline"
                      placeholder="Chiều rộng"
                      min={1}
                      defaultValue={1}
                      onChange={(_, num) => setFieldValue("width", num)}
                      value={values.width}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <InputRightAddon borderRightRadius="sm">cm</InputRightAddon>
                  </InputGroup>
                  <InputGroup w="240px" size="sm">
                    <InputLeftAddon borderLeftRadius="sm">Dài</InputLeftAddon>
                    <NumberInput
                      id="length"
                      name="length"
                      focusBorderColor="none"
                      borderLeftRadius="sm"
                      colorScheme="brand"
                      variant="outline"
                      placeholder="Chiều dài"
                      min={1}
                      defaultValue={1}
                      onChange={(_, num) => setFieldValue("length", num)}
                      value={values.length}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <InputRightAddon borderRightRadius="sm">cm</InputRightAddon>
                  </InputGroup>
                  <InputGroup w="240px" size="sm">
                    <InputLeftAddon borderLeftRadius="sm">Cao</InputLeftAddon>
                    <NumberInput
                      id="height"
                      name="height"
                      focusBorderColor="none"
                      borderLeftRadius="sm"
                      colorScheme="brand"
                      variant="outline"
                      placeholder="Chiều cao"
                      min={1}
                      defaultValue={1}
                      onChange={(_, num) => setFieldValue("height", num)}
                      value={values.height}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
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
        <Box maxW="full">
          <MyFormControl
            id="desc"
            label="Mô tả đầy đủ sản phẩm"
            errorTxt={errors.desc}
          >
            <QuillNoSSRWrapper
              id="desc"
              modules={modules}
              formats={formats}
              className={styles.Quill}
              onChange={(content) => setFieldValue("desc", content)}
              value={values.desc}
              theme="snow"
            />
          </MyFormControl>
        </Box>

        <HStack w="full" justifyContent="flex-end">
          <Button
            bg="red.500"
            borderColor="red.700"
            _focus={{
              ring: 0,
            }}
            _hover={{
              bg: "red.600",
            }}
            _active={{
              bg: "red.700",
            }}
            onClick={handleSubmit as any}
            disabled={isSubmitting || !isValid}
          >
            Cập nhật sản phẩm
          </Button>
        </HStack>
      </VStack>
    </VStack>
  );
};

const handler: NextSsrIronHandler = async function ({ req, res, query }) {
  const auth = req.session.get(IronSessionKey.AUTH);
  const { shop_id, pid } = query;
  if (auth === undefined || !shop_id || shop_id === "" || !pid || pid === "") {
    res.setHeader("location", "/");
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    [FETCH_SHOP_PRODUCT_DETAIL_MERCH, auth, shop_id as string, pid as string],
    ({ queryKey }) =>
      fetchShopProductDetailForMerch(queryKey[1], queryKey[2], queryKey[3])
  );
  await queryClient.prefetchQuery(FETCH_CATEGORIES, fetchProductCategories);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      token: auth,
      shopId: shop_id,
      pid,
      layout: LayoutType.MERCH,
    },
  };
};

export const getServerSideProps = withSession(handler);

export default MerchantAddProducts;
