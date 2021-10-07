import React from "react";
import NextLink from "next/link";
import {
  Box,
  LinkOverlay,
  BoxProps,
  LinkOverlayProps,
} from "@chakra-ui/layout";

type Props = BoxProps & {
  href: string;
  innerProp?: LinkOverlayProps;
};

const MyLinkOverlay: React.FC<Props> = ({
  href,
  children,
  innerProp,
  ...props
}) => {
  return (
    <Box
      as="span"
      position="relative"
      w="fit-content"
      h="fit-content"
      {...props}
    >
      <NextLink href={href} passHref>
        <LinkOverlay {...innerProp}>{children}</LinkOverlay>
      </NextLink>
    </Box>
  );
};
export default MyLinkOverlay;
