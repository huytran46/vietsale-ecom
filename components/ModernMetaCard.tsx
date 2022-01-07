import React from "react";
import { Box, BoxProps, Heading, VStack } from "@chakra-ui/layout";

type Props = {
  title: string;
  headingCenter?: boolean;
  bodyStyleProps?: BoxProps;
};

const ModernMetaCard: React.FC<Props> = ({
  children,
  title,
  headingCenter,
  bodyStyleProps,
}) => {
  const styleObj = headingCenter
    ? {
        w: "full",
        d: "flex",
        alignItems: "center",
        justifyContent: "center",
      }
    : {};
  return (
    <VStack
      alignItems="flex-start"
      justifyContent="center"
      w="full"
      spacing={0}
      bg="transparent"
    >
      <Heading
        textTransform="uppercase"
        size="md"
        m={0}
        my={2}
        color="brand.500"
        bgColor="rgb(234, 255, 224)"
        borderRadius="md"
        p={3}
        borderColor="brand.500"
        border="1px dashed"
        {...styleObj}
      >
        {title}
      </Heading>
      <Box w="full" py={3} {...bodyStyleProps}>
        {children}
      </Box>
    </VStack>
  );
};

export default ModernMetaCard;
