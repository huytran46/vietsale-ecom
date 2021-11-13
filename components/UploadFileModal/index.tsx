import React from "react";
import { useDropzone } from "react-dropzone";
import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  ModalFooter,
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
  useToast,
} from "@chakra-ui/react";
import { MdRemoveCircleOutline } from "react-icons/md";
import { MyImage } from "components/common/MyImage";
import { useMutation, useQueryClient } from "react-query";
import {
  doUploadFile,
  FETCH_SHOP_FILES_MERCH,
  UploadProgressCallback,
} from "services/merchant";

type Props = {
  token: string;
  shopId: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

type TemporaryFile = {
  id: number;
  name: string;
  src: string;
  raw: File;
  uploaded: number;
};

const UploadFileModal: React.FC<Props> = ({
  token,
  shopId,
  isOpen,
  onOpen,
  onClose,
  children,
}) => {
  const queryClient = useQueryClient();
  const { mutate: upload } = useMutation({
    mutationFn: (file: FormData, cb?: UploadProgressCallback) =>
      doUploadFile(token, shopId, file, cb),
  });

  const toast = useToast();

  const [tempFiles, setTempFiles] = React.useState<TemporaryFile[]>([]);

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        const binaryStr = reader.result;
        if (!binaryStr) return;
        const blob = new Blob([binaryStr]);
        const url = URL.createObjectURL(blob);
        const tempFile = {
          id: idx,
          name: file.name,
          src: url,
          raw: file,
          uploaded: 0,
        };
        setTempFiles((prev) => {
          const next = [...prev];
          next.push(tempFile);
          return next;
        });
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeTempFile = React.useCallback(
    (id: number) => {
      const next = [...tempFiles];
      next.splice(id, 1);
      setTempFiles(next);
    },
    [tempFiles]
  );

  const onSubmit = React.useCallback(() => {
    if (tempFiles.length < 1) return;
    tempFiles.forEach((file, idx) => {
      const formData = new FormData();
      formData.append("uploadFile", file.raw);
      upload(formData, {
        onSuccess(data) {
          if (data.success === false) {
            toast({
              variant: "subtle",
              status: "error",
              description: data.message,
            });
            return;
          }

          queryClient.invalidateQueries([FETCH_SHOP_FILES_MERCH, shopId]);
          toast({
            variant: "subtle",
            status: "success",
            description: "Tải tệp lên thành công",
          });
          removeTempFile(idx);
        },
      });
    });
  }, [tempFiles, queryClient, shopId, toast, upload, removeTempFile]);

  return (
    <>
      {React.cloneElement(children as any, { onClick: onOpen })}
      <Modal size="4xl" onClose={onClose} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader borderBottomWidth="1px" borderBottomColor="gray.100">
            <Text>Tải tệp lên</Text>
          </ModalHeader>
          <ModalCloseButton top="16px" />
          <ModalBody p={3}>
            <HStack w="full" p={3} spacing={2} alignItems="flex-start">
              <Box
                {...getRootProps()}
                flex="2"
                cursor="pointer"
                p={3}
                w="full"
                borderRadius="md"
                d="flex"
                alignItems="center"
                justifyContent="center"
                h="300px"
                borderWidth={isDragActive ? "2px" : "0px"}
                bg={isDragActive ? "brand.50" : "gray.light"}
                borderColor={isDragActive ? "brand.500" : ""}
                borderStyle={isDragActive ? "dashed" : ""}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <Text fontSize="lg" color="white" fontWeight="medium">
                    Thả tệp vào đây để tải lên ...
                  </Text>
                ) : (
                  <Text>
                    <b>Kéo thả</b> hoặc <b>nhấn vào đây</b> để chọn tệp tải
                    lên...
                  </Text>
                )}
              </Box>
              <List
                position="relative"
                flex="1"
                maxH="300px"
                overflowY="auto"
                spacing={2}
              >
                <ListItem>
                  <Flex w="full" alignItems="center">
                    <Text as="b" isTruncated fontSize="xs">
                      Danh sách tệp
                    </Text>
                    <Spacer />
                    <Button
                      variant="ghost"
                      size="xs"
                      colorScheme="brand"
                      borderWidth="0px"
                      color="brand.500"
                      disabled={tempFiles.length < 1}
                      onClick={onSubmit}
                      _focus={{ ring: 0 }}
                    >
                      Tải lên
                    </Button>
                  </Flex>
                </ListItem>
                {tempFiles.map((f, idx) => (
                  <Fade key={idx} in={tempFiles.indexOf(f) > -1}>
                    <ListItem bg={idx % 2 === 0 ? "gray.50" : ""} p={0} pr={1}>
                      <Flex w="full" alignItems="center">
                        <MyImage
                          size="sm"
                          src={f.src}
                          width="48px"
                          height="48px"
                        />
                        <Text marginLeft="8px" as="b" isTruncated fontSize="sm">
                          {f.name}
                        </Text>
                        <Spacer />
                        <Icon
                          cursor="pointer"
                          as={MdRemoveCircleOutline}
                          onClick={() => removeTempFile(idx)}
                        />
                      </Flex>
                    </ListItem>
                  </Fade>
                ))}
              </List>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UploadFileModal;
