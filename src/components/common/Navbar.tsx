import { useAuthContext } from "@/contexts/AuthContext";
import { useCartContext } from "@/contexts/CartContext";
import { Button, ButtonGroup, Flex, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const { push } = useRouter();
  const { user, logout, setToken, setUser } = useAuthContext();
  const { length } = useCartContext();
  return (
    <Flex
      h={14}
      width={"100vw"}
      justifyContent={"space-between"}
      alignItems={"center"}
      padding={10}
      boxShadow={"rgba(149, 157, 165, 0.2) 0px 8px 24px"}
      top={0}
    >
      <Heading
        size={"lg"}
        userSelect={"none"}
        onClick={() => push("/")}
        cursor={"pointer"}
      >
        Walmart
      </Heading>
      <Flex alignItems={"center"} gap={5}>
        {user?.firstName && (
          <Text fontWeight={"bold"} fontSize={20}>
            Welcome back, {user.firstName}!
          </Text>
        )}
        <ButtonGroup>
          {!user?.isAdmin && (
            <Button onClick={() => push("/users/cart")}>
              Your Cart ({length})
            </Button>
          )}

          {!user ? (
            <Button onClick={() => push("/users/login")}>Login</Button>
          ) : (
            <>
              {user.isAdmin ? (
                <Button onClick={() => push("/users/dashboard")}>
                  Admin Dashboard
                </Button>
              ) : (
                <Button onClick={() => push("/users/profile")}>Profile</Button>
              )}
              <Button onClick={() => logout()}>Logout</Button>
              <></>
            </>
          )}
        </ButtonGroup>
      </Flex>
    </Flex>
  );
};
