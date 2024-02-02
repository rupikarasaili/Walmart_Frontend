// app/providers.tsx
"use client";

import { AuthContextProvider } from "@/contexts/AuthContext";
import { CartContextProvider } from "@/contexts/CartContext";
import { ChakraProvider } from "@chakra-ui/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider>
      <AuthContextProvider>
        <CartContextProvider>{children}</CartContextProvider>
      </AuthContextProvider>
    </ChakraProvider>
  );
}
