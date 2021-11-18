import React from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";

type MyFormControlProps = {
  id: string;
  isInvalid?: boolean;
  label: string;
  helperTxt?: string;
  errorTxt?: string;
};

const MyFormControl: React.FC<MyFormControlProps> = ({
  id,
  isInvalid,
  label,
  helperTxt,
  errorTxt,
  children,
}) => {
  return (
    <FormControl isInvalid={Boolean(isInvalid)} id={id}>
      <FormLabel fontSize="sm" fontWeight="medium">
        {label}
      </FormLabel>
      {children}
      <FormHelperText fontSize="xs">{helperTxt}</FormHelperText>
      <FormErrorMessage fontSize="sm">{errorTxt}</FormErrorMessage>
    </FormControl>
  );
};

export default MyFormControl;
