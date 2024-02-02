import { useAuthContext } from "@/contexts/AuthContext";
import { ICart, ICartProduct, useCartContext } from "@/contexts/CartContext";
import {
  Button,
  Flex,
  Grid,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { UserCartCheckoutModal } from "../products/UserCheckoutModel";

export const UserCart = () => {
  const { getProducts, cart } = useCartContext();
  const { user } = useAuthContext();
  const { push } = useRouter();
  const { onClose, onOpen, isOpen } = useDisclosure();

  function calculateTotal(cart: ICart): number {
    if (!cart.products) {
      return 0;
    }

    return Object.values(cart.products).reduce((total, cartProduct) => {
      return total + cartProduct.price * cartProduct.quantity;
    }, 0);
  }

  const products: Record<string, ICartProduct> | null = getProducts();

  return (
    <Flex flexDirection={"column"} gap={5}>
      <Flex justifyContent={"space-between"}>
        <Heading>Your Cart</Heading>
        {user && (
          <Button colorScheme="orange" onClick={onOpen}>
            Check out
          </Button>
        )}
        {!user && (
          <Button colorScheme="orange" onClick={() => push("/users/login")}>
            Login to continue
          </Button>
        )}
      </Flex>

      <UserCartCheckoutModal
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
      />

      {products && Object.keys(products).length > 0 ? (
        <Grid>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Category</Th>
                  <Th>Quantity</Th>
                  <Th isNumeric>Total Price</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Object.values(products).map((product) => {
                  return (
                    <Tr>
                      <Td>{product.name}</Td>
                      <Td>{product.category.name}</Td>
                      <Td isNumeric>{product.quantity}</Td>
                      <Td isNumeric>Rs. {product.quantity * product.price}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
              <Tr>
                <Td></Td>
                <Td></Td>
                <Td isNumeric>Total</Td>
                <Td textAlign={"right"}>Rs. {calculateTotal(cart)}</Td>
              </Tr>
            </Table>
          </TableContainer>
        </Grid>
      ) : (
        <Heading>No items in cart</Heading>
      )}
    </Flex>
  );
};
