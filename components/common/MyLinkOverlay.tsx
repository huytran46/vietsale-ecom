import React from "react";
import NextLink from "next/link";
import { Box, LinkOverlay } from "@chakra-ui/layout";

type Props = {
  href: string;
};

const MyLinkOverlay: React.FC<Props> = ({ href, children }) => {
  return (
    <h2 style={{ position: "relative" }}>
      <NextLink href={href} passHref>
        <LinkOverlay>{children}</LinkOverlay>
      </NextLink>
    </h2>
  );
};
export default MyLinkOverlay;
