import React from "react";
import { Center, VStack, Text, Icon } from "@chakra-ui/react";
import { BsQuestionCircle } from "react-icons/bs";

const Empty: React.FC = ({ children }) => {
  return (
    <Center bg="white" mt={16} p={10} h="full" w="full">
      <VStack>
        <Text d="flex" alignItems="center" color="gray.300" fontSize="xl">
          Không có dữ liệu&nbsp;
          <Icon as={BsQuestionCircle} />
        </Text>
        {children}
      </VStack>
    </Center>
  );
};
export default Empty;
