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
  StackDivider,
  HStack,
} from "@chakra-ui/react";
import MyLinkOverlay from "components/common/MyLinkOverlay";
import { MyImage } from "components/common/MyImage";

type Props = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const DownloadAppModal: React.FC<Props> = ({
  isOpen,
  onOpen,
  onClose,
  children,
}) => {
  return (
    <>
      {React.cloneElement(children as any, { onClick: onOpen })}
      <Modal size="xl" onClose={onClose} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader borderBottomWidth="1px" borderBottomColor="gray.100">
            <Box d="flex" justifyContent="center">
              <Text>Tải ứng dụng</Text>
            </Box>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack w="full" p={3} spacing={12}>
              <Text fontSize="sm">
                Ứng dụng mua sắm trực tuyến <b>Việt Sale</b> hiện đã có mặt trên
                2 nền tảng <b>Android</b> và <b>iOS</b>. Chọn nền tảng bên dưới.
              </Text>
              <HStack w="full" divider={<StackDivider />}>
                <Box
                  flex="1"
                  d="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <MyLinkOverlay
                    isBlank
                    href="https://play.google.com/store/apps/details?id=com.vietsale.dev"
                  >
                    <MyImage src="/ch-play.png" width="200" height="80" />
                  </MyLinkOverlay>
                </Box>
                <Box
                  flex="1"
                  d="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <MyLinkOverlay
                    isBlank
                    href="https://apps.apple.com/vn/app/vi%E1%BB%87t-sale/id1584535498?l=vi"
                  >
                    <MyImage src="/app-store.png" width="200" height="56" />
                  </MyLinkOverlay>
                </Box>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DownloadAppModal;
