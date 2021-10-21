import React from "react";
import { Center, Text } from "@chakra-ui/react";

const Empty: React.FC = () => {
  return (
    <Center bg="white" p={10} h="full" w="full">
      <Text color="gray.300" fontSize="xl">
        Không có dữ liệu
      </Text>
    </Center>
  );
};
export default Empty;
