import React, { useEffect, useMemo, useState } from "react";
import {
  useClipboard,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Input,
  FormControl,
  FormHelperText,
  Icon,
} from "@chakra-ui/react";
import { CgTrash } from "react-icons/cg";
import { IoIosCopy } from "react-icons/io";
import { useMutation, useQueryClient } from "react-query";

import { ConfirmDeleteProductModalProps } from "./ConfirmDeleteProductModal.type";
import {
  deleteShopProduct,
  DELETE_SHOP_PRODUCT_MERCH,
} from "services/merchant";

export const ConfirmDeleteProductModal: React.FC<
  ConfirmDeleteProductModalProps
> = (props) => {
  const { productName, params, currentQueryKey } = props;
  const { hasCopied, onCopy } = useClipboard(productName);
  const toaster = useToast({
    duration: 3000,
    position: "bottom",
    isClosable: true,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputValue, setInputValue] = useState("");
  const [showCopiedText, setShowCopiedText] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: doDeleteProduct } = useMutation(
    DELETE_SHOP_PRODUCT_MERCH,
    () => deleteShopProduct(params.token, params.shopId, params.productId)
  );

  const isCorrect = useMemo(
    () => inputValue === productName,
    [inputValue, productName]
  );

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  }

  function handleOnConfirmDelete() {
    doDeleteProduct(undefined, {
      onSuccess() {
        toaster({
          description: `Sản phẩm [${productName}] đã bị xoá`,
          status: "success",
        });
      },
      onError() {
        toaster({
          description: "Không thể xoá sản phẩm",
          status: "error",
        });
      },
      async onSettled() {
        await queryClient.invalidateQueries(currentQueryKey);
        onClose();
      },
    });
  }

  return (
    <>
      <Icon cursor="pointer" ml={2} as={CgTrash} onClick={onOpen} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Lưu ý</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text m={3} as="p">
              Bạn có chắc là muốn xoá sản phẩm:
              <br />
              <strong>
                {productName}&nbsp;
                {hasCopied ? (
                  <Text as="span" fontSize="xx-small">
                    Đã sao chép
                  </Text>
                ) : (
                  <Icon onClick={onCopy} as={IoIosCopy} />
                )}
              </strong>
              ?
            </Text>
            <Text m={3} as="p">
              Nhập lại tên sản phẩm để xoá:
            </Text>
            <FormControl m={3} isRequired>
              <Input
                colorScheme="brand"
                placeholder={`Hãy nhập: ${productName}`}
                onChange={handleChange}
              />
              {!isCorrect && (
                <FormHelperText>Nhập chưa đúng tên sản phẩm</FormHelperText>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button mr={2} onClick={onClose} variant="ghost">
              Đóng
            </Button>
            <Button
              disabled={!isCorrect}
              colorScheme="red"
              mr={3}
              onClick={handleOnConfirmDelete}
            >
              Xoá
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
