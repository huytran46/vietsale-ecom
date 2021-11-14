import React from "react";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import {
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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  List,
  ListItem,
  ListIcon,
  Flex,
  Spacer,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { BsImage, BsCircle, BsCheckCircle } from "react-icons/bs";
import { useMutation, useQuery } from "react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import _debounce from "lodash/debounce";
import Highlighter from "react-highlight-words";

import withSession, { NextSsrIronHandler } from "utils/session";
import { IronSessionKey } from "constants/session";
import { LayoutType } from "constants/common";
import {
  CREATE_SHOP_PRODUCT_MERCH,
  doCreateShopProduct,
} from "services/merchant";
import { CreateProductPayload } from "models/request-response/Merchant";
import styles from "./add.module.css";
import { formatCcy } from "utils";
import UploadFileModal from "components/UploadFileModal";
import { useFileCtx } from "context/FileProvider";
import { MyImage } from "components/common/MyImage";
import { FETCH_CATEGORIES, fetchProductCategories } from "services/public";
import { useUser } from "context/UserProvider";

type MyFormControlProps = {
  id: string;
  isInvalid?: boolean;
  label: string;
  helperTxt?: string;
  errorTxt?: string;
};

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

const NUMBER_OF_PLACEHOLDERS = 8;

const MerchantAddProducts: NextPage<{ token: string; shopId: string }> = ({
  token,
  shopId,
}) => {
  const [categoryName, setCategoryName] = React.useState("");
  const [selectedCategoryIds, setCategoryIds] = React.useState<string[]>([]);
  const [isProductCategoryPopup, setPCPopup] = React.useState(false);
  const openPopup = () => setPCPopup(true);
  const closePopup = () => setPCPopup(false);

  const { selectedMyFile, selectedMyFiles } = useFileCtx();

  const [isUploadFileOpen, uploadModalHandler] = useBoolean();
  const { mutateAsync } = useMutation({
    mutationKey: CREATE_SHOP_PRODUCT_MERCH,
    mutationFn: (payload: CreateProductPayload) =>
      doCreateShopProduct(token, shopId, payload),
  });

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
    touched,
    handleChange,
    isSubmitting,
    setFieldValue,
  } = useFormik<CreateProductPayload>({
    initialValues: {
      productName: "",
      cover: "",
      unitValueID: 1,
      cateIDs: [],
      fileIDs: [],
      desc: "",
      isPercentDiscount: false,
      discountValue: 0,
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

  const { shopInfo } = useUser();

  const [selectedUOM, setUOM] = React.useState<number>();

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

  const addCategory = React.useCallback(
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
    if (!categoryName || categoryName === "") return;
    openPopup();
  }, [categoryName]);

  React.useEffect(() => {
    setFieldValue("cateIDs", selectedCategoryIds);
  }, [selectedCategoryIds, setFieldValue]);

  return (
    <VStack spacing={6} pb={12}>
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
        <Box>
          <MyFormControl label="Chọn danh mục sản phẩm" id="cateName">
            <Popover
              returnFocusOnClose={true}
              isOpen={isProductCategoryPopup}
              onClose={closePopup}
              placement="bottom"
              closeOnBlur={false}
              autoFocus={false}
            >
              <PopoverTrigger>
                <Input
                  id="cateName"
                  name="cateName"
                  type="text"
                  focusBorderColor="none"
                  borderLeftRadius="sm"
                  colorScheme="brand"
                  variant="outline"
                  placeholder="Nhập tên danh mục"
                  onChange={_debounce(
                    (e) => setCategoryName(e.target.value),
                    500,
                    { trailing: true }
                  )}
                />
              </PopoverTrigger>
              <PopoverContent>
                <PopoverHeader>
                  <HStack>
                    <Text fontWeight="semibold">Chọn danh mục sản phẩm</Text>
                    <PopoverCloseButton top="8px" />
                  </HStack>
                </PopoverHeader>
                <PopoverArrow />
                <PopoverBody minH="300px" maxH="500px" overflowY="auto">
                  {!isCategoriesLoading && (
                    <List size="sm" w="full" spacing={3}>
                      {productCategories
                        ?.filter((pc) =>
                          pc.category_name
                            .trim()
                            .toLowerCase()
                            .includes(categoryName.trim().toLowerCase())
                        )
                        .map((pc, idx) => (
                          <ListItem key={idx}>
                            <Flex alignItems="center" w="full">
                              <Text fontSize="sm" isTruncated>
                                <Highlighter
                                  searchWords={[categoryName]}
                                  autoEscape={true}
                                  textToHighlight={pc.category_name}
                                />
                              </Text>
                              <Spacer />
                              <ListIcon
                                as={BsCircle}
                                bg={
                                  selectedCategoryIds.indexOf(pc.id) > -1
                                    ? "brand.500"
                                    : ""
                                }
                                color={
                                  selectedCategoryIds.indexOf(pc.id) > -1
                                    ? "brand.900"
                                    : ""
                                }
                                onClick={() => addCategory(pc.id)}
                                borderRadius="50%"
                                cursor="pointer"
                              />
                            </Flex>
                          </ListItem>
                        ))}
                    </List>
                  )}
                  {isCategoriesLoading && (
                    <Center minH="300px" w="full" h="full">
                      <Spinner
                        thickness="4px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color="blue.500"
                        size="xl"
                      />
                    </Center>
                  )}
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </MyFormControl>
        </Box>

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
                d="grid"
                placeItems="center"
                borderWidth="1px"
                borderRadius="sm"
                h="32px"
                px={1}
              >
                <Text fontSize="xs">{pc.category_name}</Text>
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
                    isOpen={isUploadFileOpen}
                    token={token}
                    shopId={shopId}
                    onClose={uploadModalHandler.off}
                    onOpen={uploadModalHandler.on}
                    defaultPanel={1}
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
              <MyFormControl label="Ảnh mô tả" id="fileIDs">
                <UploadFileModal
                  isOpen={isUploadFileOpen}
                  token={token}
                  shopId={shopId}
                  onClose={uploadModalHandler.off}
                  onOpen={uploadModalHandler.on}
                  defaultPanel={1}
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
              <MyFormControl label="Tên sản phẩm" id="productName">
                <Input
                  id="productName"
                  name="productName"
                  type="text"
                  focusBorderColor="none"
                  borderLeftRadius="sm"
                  colorScheme="brand"
                  variant="outline"
                  placeholder="Tên sản phẩm"
                  onChange={_debounce(handleChange, 500, { trailing: true })}
                />
              </MyFormControl>
            </WrapItem>

            <WrapItem minW="400px">
              <MyFormControl label="Mô tả ngắn" id="shortDesc">
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
                  onChange={_debounce(handleChange, 500, { trailing: true })}
                />
              </MyFormControl>
            </WrapItem>
          </Wrap>

          <Wrap spacing={12} maxW="full">
            <WrapItem>
              <MyFormControl id="quantity" label="Số lượng">
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
                    onChange={_debounce(
                      (_, num) => setFieldValue("quantity", num),
                      500,
                      { trailing: true }
                    )}
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
                label="Đơn vị"
                id="unitValueID"
                helperTxt="Chọn đơn vị cho sản phẩm"
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
          </Wrap>

          <Wrap spacing={12} maxW="full">
            <WrapItem>
              <MyFormControl
                id="price"
                label="Giá sản phẩm"
                helperTxt={`Giá hiển thị ${formatCcy(values.price)}đ`}
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
                    min={1}
                    defaultValue={1}
                    onChange={_debounce(
                      (_, num) => setFieldValue("price", num),
                      500,
                      { trailing: true }
                    )}
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
                      onChange={_debounce(
                        (e) =>
                          setFieldValue(
                            "isPercentDiscount",
                            e.target.value === "true"
                          ),
                        500,
                        { trailing: true }
                      )}
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
                    onChange={_debounce(
                      (_, num) => setFieldValue("discountValue", num),
                      500,
                      { trailing: true }
                    )}
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
        <Box maxW="full">
          <MyFormControl id="desc" label="Mô tả đầy đủ sản phẩm">
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
