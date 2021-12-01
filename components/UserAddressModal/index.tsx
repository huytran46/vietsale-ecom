import React, { useEffect } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  ModalFooter,
  Text,
  Box,
  VStack,
  Divider,
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
} from "@chakra-ui/react";

import { useUser } from "context/UserProvider";
import { useMutation } from "react-query";
import { doAddAddress } from "services/user";

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
  token,
  children,
}) => {
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
  } = useUser();

  // const {} = useMutation(() => doAddAddress(token));

  useEffect(() => {
    if (provinces.length > 0) return;
    doFetchProvinces();
  }, [provinces]);

  return (
    <>
      {React.cloneElement(children as any, { onClick: onOpen })}
      <Modal size="xl" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader borderBottomWidth="1px" borderBottomColor="gray.100">
            <Box d="flex" justifyContent="center">
              <Text>Địa chỉ giao hàng</Text>
            </Box>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack w="full" p={0} pb={6} spacing={3}>
              <Text color="gray.500" fontSize="sm">
                Hãy chọn địa chỉ nhận hàng để được dự báo thời gian giao hàng
                cùng phí đóng gói, vận chuyển một cách chính xác nhất.
              </Text>
              {!userAddresses && (
                <Button
                  borderColor="brand.700"
                  bgGradient="linear(to-r, brand.100, brand.300, brand.500)"
                >
                  Đăng nhập để chọn địa chỉ giao hàng
                </Button>
              )}
              <Wrap w="full">
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
                      <VStack justifyContent="flex-start" spacing={1} pt={0.5}>
                        <Checkbox defaultChecked={Boolean(ud.is_default)} />
                      </VStack>
                    </Flex>
                  </WrapItem>
                ))}
              </Wrap>
            </VStack>
            <Divider orientation="horizontal" />
            <Text
              mt={3}
              w="full"
              textAlign="center"
              textTransform="uppercase"
              fontSize="md"
              fontWeight="medium"
            >
              Thêm địa chỉ mới
            </Text>
            <Grid my={6} templateColumns="repeat(3, 1fr)" gap={6}>
              <GridItem d="flex" alignItems="center">
                <Text fontSize="sm">Tỉnh/thành</Text>
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
                <Text fontSize="sm">Quận/huyện</Text>
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
                <Text fontSize="sm">Phường/xã</Text>
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
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button
              w="full"
              bg="red.500"
              borderColor="red.700"
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
              onClick={onClose}
            >
              Giao đến địa chỉ này
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserAddressModal;
