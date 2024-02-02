import {
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import React, { ChangeEventHandler } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface PasswordInputProps {
  placeholder?: string;
  value: string;
  setValue: ChangeEventHandler<HTMLInputElement> | undefined;
  tabIndex?: number;
  name?: string;
  handleBlur?: React.FocusEventHandler<HTMLInputElement> | undefined;
}

export const PasswordInput = ({
  setValue,
  value,
  placeholder,
  tabIndex,
  name,
  handleBlur,
}: PasswordInputProps) => {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <InputGroup size="md">
      <Input
        tabIndex={tabIndex}
        type={show ? "text" : "password"}
        placeholder={placeholder ? placeholder : `Enter password`}
        value={value}
        onChange={setValue}
        name={name}
        onBlur={handleBlur}
      />
      <InputRightElement width="4.5rem">
        <IconButton
          icon={show ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
          aria-label="Password Icon"
          size="sm"
          onClick={handleClick}
          tabIndex={-1}
        />
      </InputRightElement>
    </InputGroup>
  );
};
