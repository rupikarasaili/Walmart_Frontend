import { Navbar } from "@/components/common/Navbar";
import { Flex } from "@chakra-ui/react";
import React from "react";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex flexDirection={"column"}>
      <Navbar />
      <Flex
        minH={"90vh"}
        w={"500px"}
        justifyContent={"center"}
        margin={"auto"}
        alignItems={"center"}
        flexDirection={"column"}
        gap={5}
      >
        {children}
      </Flex>
    </Flex>
  );
};
