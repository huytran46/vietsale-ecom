import { Box, HStack, VStack } from "@chakra-ui/layout";
import { NextPage } from "next";
import { useRouter } from "next/router";

const ProductDetail: NextPage = () => {
  const router = useRouter();
  const { pid } = router.query;
  return (
    <VStack h="fit-content" minHeight="full">
      <HStack>
        <Box>{pid}</Box>
      </HStack>
    </VStack>
  );
};

export default ProductDetail;
