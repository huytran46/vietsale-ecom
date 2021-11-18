import React from "react";
import type { NextPage } from "next";
import {
  useBoolean,
  Button,
  VStack,
  Text,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Spacer,
  Avatar,
  Icon,
} from "@chakra-ui/react";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { BsGrid, BsListUl } from "react-icons/bs";
import { AiOutlineCloudUpload } from "react-icons/ai";

import withSession, { NextSsrIronHandler } from "utils/session";
import { IronSessionKey } from "constants/session";
import { LayoutType } from "constants/common";
import {
  fetchShopFilesForMerch,
  FETCH_SHOP_FILES_MERCH,
} from "services/merchant";
import { MyFile } from "models/MyFile";
import moment from "moment";
import { formatCcy } from "utils";
import UploadFileModal from "components/UploadFileModal";
import Pagination from "components/Pagination";

const FileRow: React.FC<{ file: MyFile }> = ({ file }) => {
  return (
    <Tr>
      <Td isTruncated>
        <HStack w="full">
          <Avatar src={file.file_thumbnail} />
          <Text isTruncated as="b">
            {file.file_name}
          </Text>
        </HStack>
      </Td>
      <Td>
        <Text>{formatCcy(file.file_size)}&nbsp;B</Text>
      </Td>
      <Td>
        <Text as="b">{file.file_type}</Text>
      </Td>
      <Td>
        <Text>{moment(file.created_at).format("HH:mm:ss DD/MM/YYYY")}</Text>
      </Td>
    </Tr>
  );
};

enum ViewMode {
  GRID = "grid",
  TABLE = "table",
}
const ITEM_PER_PAGE = 20;

const MerchantFiles: NextPage<{ token: string; shopId: string }> = ({
  token,
  shopId,
}) => {
  const [currentItems, setCurrentItems] = React.useState<MyFile[]>([]);
  const [isOpen, uploadModalHandler] = useBoolean();
  const [viewMode, setViewMode] = React.useState<ViewMode>(ViewMode.TABLE);

  const { data: response } = useQuery({
    queryKey: [FETCH_SHOP_FILES_MERCH, token, shopId],
    queryFn: ({ queryKey }) => fetchShopFilesForMerch(queryKey[1], queryKey[2]),
    enabled: shopId.length > 0 && token.length > 0,
  });

  const files = React.useMemo(
    () => response?.data?.upload_files ?? [],
    [response]
  );

  const onSwitchViewMode = (nextMode: ViewMode) => setViewMode(nextMode);

  return (
    <VStack
      bg="white"
      h="fit-content"
      alignItems="flex-start"
      w="full"
      spacing={6}
      p={6}
      boxShadow="md"
    >
      <Flex w="full" gridGap={2} justifyContent="flex-end">
        <UploadFileModal
          token={token}
          shopId={shopId}
          isOpen={isOpen}
          onClose={uploadModalHandler.off}
          onOpen={uploadModalHandler.on}
        >
          <Button
            leftIcon={
              <Icon fontWeight="medium" size="lg" as={AiOutlineCloudUpload} />
            }
            size="sm"
            borderColor="brand.700"
          >
            Tải tệp lên
          </Button>
        </UploadFileModal>

        <Spacer />
        <Button
          size="sm"
          borderWidth="1px"
          borderRadius="md"
          p={1}
          px={3}
          cursor="pointer"
          borderColor={viewMode === ViewMode.TABLE ? "brand.700" : "gray.300"}
          bg={viewMode === ViewMode.TABLE ? "brand.500" : "white"}
          color={viewMode === ViewMode.TABLE ? "white" : "gray.400"}
          onClick={() => onSwitchViewMode(ViewMode.TABLE)}
        >
          <Icon
            m={0}
            as={BsListUl}
            color={viewMode === ViewMode.TABLE ? "white" : "gray.400"}
          />
        </Button>
        <Button
          disabled
          _hover={{
            bg: "none",
          }}
          _active={{
            bg: "none",
          }}
          size="sm"
          borderWidth="1px"
          borderRadius="md"
          p={1}
          px={3}
          cursor="pointer"
          borderColor={viewMode === ViewMode.GRID ? "brand.700" : "gray.300"}
          bg={viewMode === ViewMode.GRID ? "brand.500" : "white"}
          color={viewMode === ViewMode.GRID ? "white" : "gray.400"}
          onClick={() => onSwitchViewMode(ViewMode.GRID)}
        >
          <Icon
            m={0}
            as={BsGrid}
            color={viewMode === ViewMode.GRID ? "white" : "gray.400"}
          />
        </Button>
      </Flex>

      <Table variant="striped" colorScheme="gray" size="sm">
        <Thead>
          <Tr>
            <Th>Tên tệp</Th>
            <Th>Kích thước tệp</Th>
            <Th>Loại tệp</Th>
            <Th>Ngày tạo</Th>
          </Tr>
        </Thead>
        <Tbody>
          {currentItems?.map((f, idx) => (
            <FileRow key={idx} file={f} />
          ))}
        </Tbody>
      </Table>
      <Pagination
        items={files}
        itemPerPage={ITEM_PER_PAGE}
        setCurrentItems={setCurrentItems}
      />
    </VStack>
  );
};

const handler: NextSsrIronHandler = async function ({ req, res, query }) {
  const auth = req.session.get(IronSessionKey.AUTH);
  const { shop_id } = query;
  if (auth === undefined || !shop_id) {
    res.setHeader("location", "/");
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    [FETCH_SHOP_FILES_MERCH, auth, shop_id as string],
    ({ queryKey }) => fetchShopFilesForMerch(queryKey[1], queryKey[2])
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      layout: LayoutType.MERCH,
      shopId: shop_id,
      token: auth,
    },
  };
};

export const getServerSideProps = withSession(handler);

export default MerchantFiles;
