import React from "react";
import { Center, Text } from "@chakra-ui/react";

const Empty: React.FC = () => {
  return (
    <Center bg="white" p={10} h="full" w="full">
      <Text fontSize="xl">Đang tải trang...</Text>
    </Center>
  );
};
export default Empty;
