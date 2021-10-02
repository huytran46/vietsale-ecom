import { chakra } from "@chakra-ui/react";
import NextImage from "next/image";

export const MyImage = chakra(NextImage, {
  shouldForwardProp: (prop) =>
    ["width", "height", "src", "alt", "quality", "layout"].includes(prop),
});
