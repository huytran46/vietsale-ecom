import React from "react";
import type { NextPage } from "next";
import {
  VStack,
  HStack,
  Alert,
  AlertDescription,
  AlertTitle,
  AlertIcon,
} from "@chakra-ui/react";
import MyLinkOverlay from "components/common/MyLinkOverlay";

const SuccessCheckout: NextPage = () => {
  return (
    <VStack
      h="fit-content"
      alignItems="flex-start"
      w="full"
      spacing={6}
      py={16}
    >
      <HStack w="full">
        <Alert
          status="success"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
          borderRadius="md"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Tạo đơn hàng thành công
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            Cảm ơn bạn đã mua hàng ở Việt Sale.
            <br />
            Theo dõi trạng thái đơn hàng vừa tạo ở{" "}
            <MyLinkOverlay href="/order" color="brand.500">
              đây
            </MyLinkOverlay>
            .
            <br />
            Xem thêm nhiều sản phẩm khác ở{" "}
            <MyLinkOverlay href="/products" color="brand.500">
              đây
            </MyLinkOverlay>
            .
            <br />
          </AlertDescription>
        </Alert>
      </HStack>
    </VStack>
  );
};

export default SuccessCheckout;
