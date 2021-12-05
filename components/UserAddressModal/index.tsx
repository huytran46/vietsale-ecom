import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  Text,
  Box,
  VStack,
  Grid,
  GridItem,
  Select,
  HStack,
  StackDivider,
  Wrap,
  WrapItem,
  Flex,
  Spacer,
  Checkbox,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  useToast,
  Input,
} from "@chakra-ui/react";

import { useUser } from "context/UserProvider";
import { useMutation, useQueryClient } from "react-query";
import {
  doAddAddress,
  doUpdateAddress,
  FETCH_DEFAULT_ADDRESS_URI,
} from "services/user";
import { useFormik } from "formik";
import { AddAddressPayload } from "models/UserAddress";
import Empty from "components/common/Empty";

type Props = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  token?: string;
};

const UserAddressModal: React.FC<Props> = ({
  isOpen,
  onOpen,
  onClose,
  children,
}) => {
  const queryClient = useQueryClient();
  const toaster = useToast();
  const {
    userAddresses,
    provinces,
    doFetchProvinces,
    districts,
    wards,
    setSelectedProvince,
    setSelectedDistrict,
    setSelectedWard,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    token,
  } = useUser();

  const [selectedAddr, setAddr] = useState<string>();

  const { mutate: createAddress } = useMutation((payload: AddAddressPayload) =>
    doAddAddress(token ?? "", payload)
  );

  const {
    handleChange,
    values,
    setFieldValue,
    handleSubmit,
    isSubmitting,
    isValid,
  } = useFormik<AddAddressPayload>({
    initialValues: {
      fullname: "",
      phone: "",
      address: "",
      provinceID: 0,
      districtID: 0,
      wardID: 0,
      isDefault: false,
    },
    onSubmit(values, actions) {
      if (!token) {
        toaster({
          title: "Lỗi",
          description: "Thêm địa chỉ giao hàng thất bại [error-1]",
          status: "error",
        });
        return;
      }
      actions.setSubmitting(true);

      // alert(JSON.stringify(values));
      createAddress(values, {
        onSuccess() {
          toaster({
            description: "Thêm địa chỉ giao hàng thành công",
            status: "success",
          });
        },
        async onSettled() {
          await queryClient.invalidateQueries([
            FETCH_DEFAULT_ADDRESS_URI,
            token,
          ]);
          actions.setSubmitting(false);
          actions.resetForm();
        },
      });
    },
  });

  const { mutate: updateAddress } = useMutation((payload: AddAddressPayload) =>
    doUpdateAddress(token ?? "", selectedAddr ?? "", payload)
  );

  const updateDefaultAddress = useCallback(() => {
    if (!userAddresses || userAddresses.length < 1) return;
    const target = userAddresses.find((ud) => ud.id === selectedAddr);
    if (!target) return;
    updateAddress(
      {
        address: target.address,
        phone: target.phone,
        fullname: target.fullname,
        provinceID: target.edges.in_province.id,
        districtID: target.edges.in_district.id,
        wardID: target.edges.in_ward.id,
        isDefault: true,
      },
      {
        onSuccess() {
          toaster({
            status: "success",
            title: "Thành công",
            description: "Cập nhật thông tin thành công",
            duration: 3000,
          });
        },
        onError() {
          toaster({
            status: "error",
            title: "Lỗi",
            description: "Cập nhật thông tin thất bại",
            duration: 3000,
          });
        },
      }
    );
  }, [userAddresses, selectedAddr, updateAddress, toaster]);

  useEffect(() => {
    if (!provinces || provinces.length > 0) return;
    doFetchProvinces();
  }, [provinces]);

  useEffect(() => {
    if (userAddresses.length < 1) return;
    userAddresses.forEach((ud) => {
      if (Boolean(ud.is_default)) {
        setAddr(ud.id);
      }
    });
  }, [userAddresses]);

  useEffect(() => {
    if (selectedProvince) {
      setFieldValue("provinceID", selectedProvince.id);
    }
    if (selectedDistrict) {
      setFieldValue("districtID", selectedDistrict.id);
    }
    if (selectedWard) {
      setFieldValue("wardID", selectedWard.id);
    }
  }, [selectedWard, selectedProvince, selectedDistrict, setFieldValue]);

  return (
    <>
      {React.cloneElement(children as any, { onClick: onOpen })}
      <Modal size="6xl" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader borderBottomWidth="1px" borderBottomColor="gray.100">
            <Box d="flex" justifyContent="center">
              <Text>Địa chỉ giao hàng</Text>
            </Box>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <HStack w="full" alignItems="start" divider={<StackDivider />}>
              <VStack w="full" h="full" spacing={6}>
                <Text color="gray.500" fontSize="sm">
                  Hãy chọn địa chỉ nhận hàng để được dự báo thời gian giao hàng
                  cùng phí đóng gói, vận chuyển một cách chính xác nhất.
                </Text>
                {!token && (
                  <Button
                    borderColor="brand.700"
                    bgGradient="linear(to-r, brand.100, brand.300, brand.500)"
                  >
                    Đăng nhập để chọn địa chỉ giao hàng
                  </Button>
                )}
                {token && userAddresses ? (
                  <VStack w="full" h="full" spacing={6} flex={1}>
                    <Flex w="full">
                      <Text fontWeight="medium" color="brand.500">
                        Chọn địa chỉ giao hàng
                      </Text>
                      <Spacer />
                      <Button
                        size="sm"
                        color="brand.500"
                        variant="outline"
                        disabled={!Boolean(selectedAddr)}
                        onClick={updateDefaultAddress}
                      >
                        Đổi
                      </Button>
                    </Flex>
                    <RadioGroup
                      colorScheme="brand"
                      flex={1}
                      w="full"
                      h="full"
                      overflowY="auto"
                      overflowX="hidden"
                      onChange={setAddr}
                      value={selectedAddr}
                    >
                      <Wrap w="full" h="full" maxH="full">
                        {userAddresses?.map((ud, idx) => (
                          <WrapItem
                            key={idx}
                            p="2"
                            d="flex"
                            borderWidth="1px"
                            borderRadius="md"
                          >
                            <Flex w="full" gridGap={3}>
                              <VStack alignItems="flex-start" spacing={1}>
                                <HStack w="full" divider={<StackDivider />}>
                                  <Text fontSize="xs" fontWeight="medium">
                                    {ud.fullname}
                                  </Text>
                                  <Text fontSize="xs">{ud.phone}</Text>
                                </HStack>
                                <Text fontSize="xs">{ud.address}</Text>
                              </VStack>
                              <Spacer />
                              <VStack
                                justifyContent="flex-start"
                                spacing={1}
                                pt={0.5}
                              >
                                <Radio cursor="pointer" value={ud.id} />
                              </VStack>
                            </Flex>
                          </WrapItem>
                        ))}
                      </Wrap>
                    </RadioGroup>
                  </VStack>
                ) : (
                  <Empty />
                )}
              </VStack>
              <VStack w="full" alignItems="start" spacing={6} px={3}>
                <Text
                  w="full"
                  textAlign="center"
                  textTransform="uppercase"
                  fontSize="xl"
                  fontWeight="medium"
                  color="brand.500"
                >
                  Thêm địa chỉ mới
                </Text>
                <HStack w="full" mt={6}>
                  <FormControl id="fullname" size="sm" isRequired>
                    <FormLabel>Tên người nhận</FormLabel>
                    <Input
                      name="fullname"
                      type="text"
                      placeholder="Ví dụ: Nguyen Van A"
                      value={values.fullname}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl id="phone" size="sm" isRequired>
                    <FormLabel>SĐT</FormLabel>
                    <Input
                      name="phone"
                      type="phone"
                      placeholder="Ví dụ: 0123456789"
                      value={values.phone}
                      onChange={handleChange}
                    />
                  </FormControl>
                </HStack>
                <Grid w="full" my={6} templateColumns="repeat(3, 1fr)" gap={6}>
                  <GridItem d="flex" alignItems="center">
                    <FormLabel>Tỉnh/thành</FormLabel>
                  </GridItem>
                  <GridItem d="flex" alignItems="center" colSpan={2}>
                    <Select
                      borderRadius="md"
                      placeholder="Vui lòng chọn tỉnh/thành phố"
                      cursor="pointer"
                      size="sm"
                      value={selectedProvince?.id}
                      onChange={(e) => {
                        const targetProvince = provinces?.find(
                          (prov) => prov.id === parseInt(e.target.value)
                        );
                        if (targetProvince) {
                          setSelectedProvince(targetProvince);
                        }
                      }}
                    >
                      {provinces?.map((prov, idx) => (
                        <option key={idx} value={prov.id}>
                          {prov.name}
                        </option>
                      ))}
                    </Select>
                  </GridItem>
                  <GridItem d="flex" alignItems="center">
                    <FormLabel>Quận/huyện</FormLabel>
                  </GridItem>
                  <GridItem d="flex" alignItems="center" colSpan={2}>
                    <Select
                      borderRadius="md"
                      placeholder="Vui lòng chọn quận/huyện"
                      cursor="pointer"
                      size="sm"
                      value={selectedDistrict?.id}
                      onChange={(e) => {
                        const targetDistrict = districts.find(
                          (dist) => dist.id === parseInt(e.target.value)
                        );
                        if (targetDistrict) {
                          setSelectedDistrict(targetDistrict);
                        }
                      }}
                    >
                      {districts?.map((dist, idx) => (
                        <option key={idx} value={dist.id}>
                          {dist.name}
                        </option>
                      ))}
                    </Select>
                  </GridItem>
                  <GridItem d="flex" alignItems="center">
                    <FormLabel>Phường/xã</FormLabel>
                  </GridItem>
                  <GridItem d="flex" alignItems="center" colSpan={2}>
                    <Select
                      borderRadius="md"
                      placeholder="Vui lòng chọn phường/xã"
                      cursor="pointer"
                      size="sm"
                      value={selectedWard?.id}
                      onChange={(e) => {
                        const targetWard = wards?.find(
                          (prov) => prov.id === parseInt(e.target.value)
                        );
                        if (targetWard) {
                          setSelectedWard(targetWard);
                        }
                      }}
                    >
                      {wards?.map((ward, idx) => (
                        <option key={idx} value={ward.id}>
                          {ward.name}
                        </option>
                      ))}
                    </Select>
                  </GridItem>
                  <GridItem d="flex" alignItems="center" colSpan={3}>
                    <FormControl id="address" isRequired>
                      <FormLabel>Tên đường</FormLabel>
                      <Input
                        name="address"
                        placeholder="Nhập số nhà, tên đường (ví dụ: 243 Lê Duẩn)"
                        value={values.address}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem d="flex" alignItems="center" colSpan={3}>
                    <HStack w="full">
                      <Checkbox
                        id="isDefault"
                        name="isDefault"
                        colorScheme="brand"
                        size="md"
                        checked={values.isDefault}
                        onChange={handleChange}
                      />
                      <Text fontSize="md">Dùng làm địa chỉ mặc định?</Text>
                    </HStack>
                  </GridItem>
                </Grid>
                <Button
                  w="full"
                  bg="red.500"
                  borderColor="red.700"
                  disabled={isSubmitting || !isValid}
                  _active={{
                    bg: "red.500",
                  }}
                  _selected={{
                    bg: "red.500",
                  }}
                  _focus={{
                    bg: "red.500",
                  }}
                  _hover={{
                    bg: "red.500",
                  }}
                  onClick={() => handleSubmit()}
                >
                  {/* Giao đến địa chỉ này */}
                  <Text fontSize="sm" colorScheme="brand" variant="link">
                    Thêm
                  </Text>
                </Button>
              </VStack>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserAddressModal;
