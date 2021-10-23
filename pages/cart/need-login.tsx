import React from "react";
import type { NextPage } from "next";
import Empty from "components/common/Empty";
import { Box } from "@chakra-ui/react";
import MyLinkOverlay from "components/common/MyLinkOverlay";

const EmptyCart: NextPage = () => {
  return (
    <Empty>
      <Box p={6}>
        Bạn cần phải&nbsp;
        <MyLinkOverlay href="/login" color="brand.500">
          đăng nhập
        </MyLinkOverlay>
        &nbsp;để sử dụng tính năng này.
      </Box>
    </Empty>
  );
};

export default EmptyCart;
