import React from "react";
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
} from "@chakra-ui/react";

type Props = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const UserAddressModal: React.FC<Props> = ({
  isOpen,
  onOpen,
  onClose,
  children,
}) => {
  return (
    <>
      {/* <Button onClick={onOpen}>Trigger modal</Button> */}
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
            <VStack w="full" p={3} spacing={3}>
              <Text color="gray.500" fontSize="sm">
                Hãy chọn địa chỉ nhận hàng để được dự báo thời gian giao hàng
                cùng phí đóng gói, vận chuyển một cách chính xác nhất.
              </Text>
              <Button bgGradient="linear(to-r, brand.100, brand.300, brand.500)">
                Đăng nhập để chọn địa chỉ giao hàng
              </Button>
            </VStack>
            <Divider orientation="horizontal" />
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
                >
                  <option value="hcm">HCM</option>
                  <option value="dn">DN</option>
                  <option value="hn">HN</option>
                </Select>
              </GridItem>
              <GridItem d="flex" alignItems="center">
                <Text fontSize="sm">Quận/huyện</Text>
              </GridItem>
              <GridItem d="flex" alignItems="center" colSpan={2}>
                <Select
                  disabled
                  borderRadius="md"
                  placeholder="Vui lòng chọn quận/huyện"
                  cursor="pointer"
                  size="sm"
                >
                  <option value="hcm">HCM</option>
                  <option value="dn">DN</option>
                  <option value="hn">HN</option>
                </Select>
              </GridItem>
              <GridItem d="flex" alignItems="center">
                <Text fontSize="sm">Phường/xã</Text>
              </GridItem>
              <GridItem d="flex" alignItems="center" colSpan={2}>
                <Select
                  disabled
                  borderRadius="md"
                  placeholder="Vui lòng chọn phường/xã"
                  cursor="pointer"
                  size="sm"
                >
                  <option value="hcm">HCM</option>
                  <option value="dn">DN</option>
                  <option value="hn">HN</option>
                </Select>
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button
              w="full"
              bg="red.500"
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
