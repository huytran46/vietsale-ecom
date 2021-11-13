import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  Text,
  Box,
  HStack,
  List,
  ListItem,
  Button,
  Flex,
  Spacer,
  Icon,
  Fade,
} from "@chakra-ui/react";
import { MdRemoveCircleOutline } from "react-icons/md";
import { MyImage } from "components/common/MyImage";

type Props = {
  token: string;
  shopId: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const PickFileModal: React.FC<Props> = ({
  token,
  shopId,
  isOpen,
  onOpen,
  onClose,
  children,
}) => {
  return (
    <>
      {React.cloneElement(children as any, { onClick: onOpen })}
      <Modal size="4xl" onClose={onClose} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader borderBottomWidth="1px" borderBottomColor="gray.100">
            <Text>Chọn tệp đã tải lên</Text>
          </ModalHeader>
          <ModalCloseButton top="16px" />
          <ModalBody p={3}></ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PickFileModal;
