import React from "react";
import { useDropzone } from "react-dropzone";
import {
  useToast,
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
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Grid,
} from "@chakra-ui/react";
import { MdRemoveCircleOutline } from "react-icons/md";

import { MyImage } from "components/common/MyImage";
import { useMutation, useQueryClient, useQuery } from "react-query";
import {
  doUploadFile,
  fetchShopFilesForMerch,
  FETCH_SHOP_FILES_MERCH,
  UploadProgressCallback,
} from "services/merchant";
import { useFileCtx } from "context/FileProvider";

enum PANEL {
  UPLOAD = 0,
  PICK = 1,
  MULTI_PICK = 2,
}

type Props = {
  token: string;
  shopId: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  defaultPanel?: PANEL;
};

type TemporaryFile = {
  id: number;
  name: string;
  src: string;
  raw: File;
  uploaded: number;
};

const selectStyle = {
  _selected: {
    borderColor: "gray.300",
    borderBottomColor: "white",
    boxShadow: "none",
  },
};

const UploadFileModal: React.FC<Props> = ({
  token,
  shopId,
  isOpen,
  onOpen,
  onClose,
  defaultPanel,
  children,
}) => {
  const queryClient = useQueryClient();

  const {
    selectedFileIds,
    handleSelectFileId,
    setFiles,
    setFileId,
    selectedFileId,
  } = useFileCtx();

  const [singleMode, setSingleMode] = React.useState(true);
  const [tab, setTab] = React.useState<number>(defaultPanel ?? PANEL.UPLOAD);

  const { data: response } = useQuery({
    queryKey: [FETCH_SHOP_FILES_MERCH, shopId],
    queryFn: ({ queryKey }) => fetchShopFilesForMerch(token, queryKey[1]),
  });

  const { mutate: upload } = useMutation({
    mutationFn: (file: FormData) => doUploadFile(token, shopId, file),
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

  const removeTempFiles = React.useCallback(
    (ids: number[]) => {
      const next = [...tempFiles];
      setTempFiles(next.filter((f) => ids.indexOf(f.id) === -1));
    },
    [tempFiles]
  );

  const onSubmit = React.useCallback(() => {
    if (tempFiles.length < 1) return;
    const successFileIds: number[] = [];
    tempFiles.forEach((file, idx) => {
      const formData = new FormData();
      formData.append("uploadFile", file.raw);
      upload(formData, {
        onSuccess(data) {
          if (data.success === false || !data) {
            toast({
              variant: "subtle",
              status: "error",
              description:
                data?.message ?? "Đã xảy ra lỗi, không thể tải tệp lên",
            });
            return;
          }

          queryClient.invalidateQueries([FETCH_SHOP_FILES_MERCH, shopId]);
          toast({
            variant: "subtle",
            status: "success",
            description: "Tải tệp lên thành công",
          });
          successFileIds.push(idx);
        },
      });
    });
    removeTempFiles(successFileIds);
  }, [tempFiles, queryClient, shopId, toast, upload, removeTempFiles]);

  const files = React.useMemo(
    () => response?.data?.upload_files ?? [],
    [response]
  );

  const isSelected = React.useCallback(
    (fid: string) => {
      if (singleMode) {
        return fid === selectedFileId;
      }
      return selectedFileIds.indexOf(fid) > -1;
    },
    [singleMode, selectedFileId, selectedFileIds]
  );

  const handleFilePicking = React.useCallback(
    (fid: string) => {
      if (singleMode) {
        setFileId(fid);
      } else {
        handleSelectFileId(fid);
      }
    },
    [singleMode, handleSelectFileId, setFileId]
  );

  const handleTabChange = React.useCallback(
    (tabIdx: number) => setTab(tabIdx),
    [setTab]
  );

  React.useEffect(() => setFiles(files), [setFiles, files]);

  React.useEffect(() => {
    setTab(defaultPanel ?? PANEL.UPLOAD);
    if (defaultPanel === PANEL.PICK) {
      return setSingleMode(true);
    }
    return setSingleMode(false);
  }, [defaultPanel]);

  React.useEffect(() => {
    if (tab === PANEL.PICK) {
      return setSingleMode(true);
    }
    return setSingleMode(false);
  }, [tab]);

  React.useEffect(() => {
    return () => {
      setTempFiles([]);
      setSingleMode(true);
      setFileId(undefined);
      handleSelectFileId(undefined);
    };
  }, []);

  return (
    <>
      {React.cloneElement(children as any, { onClick: onOpen })}
      <Modal size="4xl" onClose={onClose} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <Tabs
            size="sm"
            variant="enclosed"
            defaultIndex={defaultPanel ?? PANEL.UPLOAD}
            onChange={handleTabChange}
            index={tab}
            isLazy
          >
            <ModalHeader>
              <Flex w="full" alignItems="center" p={3}>
                <TabList w="full">
                  <Tab {...selectStyle}>Tải lên</Tab>
                  <Tab
                    {...selectStyle}
                    isDisabled={defaultPanel === PANEL.MULTI_PICK}
                    opacity={defaultPanel === PANEL.MULTI_PICK ? 0.3 : 1}
                  >
                    Chọn 1 tệp
                  </Tab>
                  <Tab
                    {...selectStyle}
                    isDisabled={defaultPanel === PANEL.PICK}
                    opacity={defaultPanel === PANEL.PICK ? 0.3 : 1}
                  >
                    Chọn nhiều tệp cùng lúc
                  </Tab>
                  <Spacer />
                  <ModalCloseButton top="24px" />
                </TabList>
              </Flex>
            </ModalHeader>
            <ModalBody p={3}>
              <TabPanels>
                <TabPanel>
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
                          <b>Kéo thả</b> hoặc <b>nhấn vào đây</b> để chọn tệp
                          tải lên...
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
                          <ListItem
                            bg={idx % 2 === 0 ? "gray.50" : ""}
                            p={0}
                            pr={1}
                          >
                            <Flex w="full" alignItems="center">
                              <MyImage
                                size="sm"
                                src={f.src}
                                width="48px"
                                height="48px"
                              />
                              <Text
                                marginLeft="8px"
                                as="b"
                                isTruncated
                                fontSize="sm"
                              >
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
                </TabPanel>
                <TabPanel p={0}>
                  <HStack maxH="500px" overflowY="auto">
                    <Grid templateColumns="repeat(6, 1fr)" gap={3}>
                      {files.map((f, idx) => (
                        <Box
                          key={idx}
                          position="relative"
                          p={3}
                          cursor="pointer"
                          onClick={() => handleFilePicking(f.id)}
                          borderWidth="2px"
                          borderColor={
                            isSelected(f.id) ? "brand.500" : "transparent"
                          }
                          borderRadius="md"
                        >
                          <MyImage
                            src={f.file_thumbnail}
                            width="120px"
                            height="120px"
                            borderRadius="md"
                          />
                          <Text
                            position="absolute"
                            bottom="0"
                            left="0"
                            right="0"
                            fontSize="xs"
                            textAlign="center"
                            color="gray.500"
                            isTruncated
                          >
                            {f.file_name}
                          </Text>
                        </Box>
                      ))}
                    </Grid>
                  </HStack>
                </TabPanel>
                <TabPanel p={0}>
                  <HStack maxH="500px" overflowY="auto">
                    <Grid templateColumns="repeat(6, 1fr)" gap={3}>
                      {files.map((f, idx) => (
                        <Box
                          key={idx}
                          position="relative"
                          p={3}
                          cursor="pointer"
                          onClick={() => handleFilePicking(f.id)}
                          borderWidth="2px"
                          borderColor={
                            isSelected(f.id) ? "brand.500" : "transparent"
                          }
                          borderRadius="md"
                        >
                          <MyImage
                            src={f.file_thumbnail}
                            width="120px"
                            height="120px"
                            borderRadius="md"
                          />
                          <Text
                            position="absolute"
                            bottom="0"
                            left="0"
                            right="0"
                            fontSize="xs"
                            textAlign="center"
                            color="gray.500"
                            isTruncated
                          >
                            {f.file_name}
                          </Text>
                        </Box>
                      ))}
                    </Grid>
                  </HStack>
                </TabPanel>
              </TabPanels>
            </ModalBody>
          </Tabs>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UploadFileModal;
