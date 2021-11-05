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
  isBlank?: boolean;
};

const MyLinkOverlay: React.FC<Props> = ({
  href,
  children,
  innerProp,
  isBlank,
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
        <LinkOverlay {...innerProp} target={isBlank ? "_blank" : "_self"}>
          {children}
        </LinkOverlay>
      </NextLink>
    </Box>
  );
};
export default MyLinkOverlay;
