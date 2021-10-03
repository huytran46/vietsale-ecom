import React from "react";
import { Box, Heading, StackDivider, VStack } from "@chakra-ui/layout";

type Props = {
  title: string;
  noBody?: boolean;
};

const MetaCard: React.FC<Props> = ({ children, title, noBody }) => {
  if (Boolean(noBody)) {
    return (
      <VStack alignItems="flex-start" w="full" spacing={0}>
        <Heading
          bg="gray.light"
          border="1px solid"
          borderColor="gray.300"
          borderBottomWidth="0"
          borderTopRadius="md"
          textTransform="uppercase"
          p={3}
          pb={1}
          size="sm"
          m={0}
        >
          {title}
        </Heading>
        <Box mt={0} w="full" borderTopColor="gray.300" borderTopWidth="1px" />
        <Box w="full" py={3}>
          {children}
        </Box>
      </VStack>
    );
  }

  return (
    <VStack
      divider={<StackDivider />}
      alignItems="flex-start"
      w="full"
      bg="gray.light"
      border="1px solid"
      borderColor="gray.200"
      rounded="md"
    >
      <Heading textTransform="uppercase" p={3} pb={1} size="sm">
        {title}
      </Heading>
      {children}
    </VStack>
  );
};

export default MetaCard;
