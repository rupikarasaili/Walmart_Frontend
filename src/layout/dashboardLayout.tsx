"use client";
import { Navbar } from "@/components/common/Navbar";
import { Sidebar } from "@/components/dashboard/Tabs";
import { useAuthContext } from "@/contexts/AuthContext";
import { Flex, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const toast = useToast();
  const { replace } = useRouter();
  const { user } = useAuthContext();

  React.useEffect(() => {
    if (user && !user?.isAdmin) {
      replace("/");
      toast({
        title: "You are not allowed to view this",
        status: "error",
      });
    }
  }, [user]);

  return (
    <Flex flexDirection={"column"} gap={4}>
      <Navbar />
      <Sidebar />
    </Flex>
  );
};
