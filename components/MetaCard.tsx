import React from "react";
import {
  Box,
  BoxProps,
  Heading,
  StackDivider,
  VStack,
} from "@chakra-ui/layout";

type Props = {
  title: string;
  titleColor?: string;
  titleBg?: string;
  titleBgGradient?: string;
  noBody?: boolean;
  bodyProps?: BoxProps;
};

const MetaCard: React.FC<Props> = ({
  children,
  title,
  titleBg,
  titleBgGradient,
  titleColor,
  noBody,
  bodyProps,
}) => {
  if (Boolean(noBody)) {
    return (
      <VStack
        alignItems="flex-start"
        justifyContent="center"
        w="full"
        spacing={0}
      >
        <Heading
          bg={titleBg ?? "gray.light"}
          bgGradient={titleBgGradient ?? undefined}
          color={titleColor ?? undefined}
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
        <Box
          w="full"
          borderTopColor="gray.300"
          borderTopWidth="1px"
          py={3}
          {...bodyProps}
        >
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
      <Heading
        bgGradient={titleBgGradient ?? undefined}
        bg={titleBg ?? undefined}
        color={titleColor ?? undefined}
        textTransform="uppercase"
        p={3}
        pb={1}
        size="sm"
      >
        {title}
      </Heading>
      {children}
    </VStack>
  );
};

export default MetaCard;
