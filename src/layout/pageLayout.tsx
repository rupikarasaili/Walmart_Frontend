"use client";
import { Navbar } from "@/components/common/Navbar";
import { Flex } from "@chakra-ui/react";
import React from "react";

export const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex flexDirection={"column"}>
      <Navbar />
      <Flex
        minH={"100vh"}
        w={"100vw"}
        margin={"auto"}
        flexDirection={"column"}
        gap={1}
        padding={10}
      >
        {children}
      </Flex>
    </Flex>
  );
};
