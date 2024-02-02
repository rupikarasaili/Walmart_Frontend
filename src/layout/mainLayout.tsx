import { Navbar } from "@/components/common/Navbar";
import { Flex } from "@chakra-ui/react";
import React from "react";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex flexDirection={"column"}>
      <Navbar />
      <Flex
        minH={"100vh"}
        w={"100vw"}
        justifyContent={"center"}
        margin={"auto"}
        alignItems={"center"}
        flexDirection={"column"}
        gap={1}
      >
        {children}
      </Flex>
    </Flex>
  );
};
