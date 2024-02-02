import { useCartContext } from "@/contexts/CartContext";
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { IProduct } from "./UserProductList";

export const UserProduct = ({ product }: { product: IProduct }) => {
  const { addItem } = useCartContext();
  const { push } = useRouter();

  return (
    <Card maxW="sm">
      <Badge pos={"absolute"} top={-2} right={0} colorScheme="orange">
        {product.category.name}
      </Badge>
      <CardBody>
        <Image
          src={product.imageUrl}
          alt={product.name}
          borderRadius="lg"
          height={"200px"}
          width={"200px"}
          objectFit={"contain"}
        />
        <Stack mt="6" spacing="3">
          <Heading size="md">{product.name}</Heading>
          <Text>{product.description}</Text>
          <Text color="blue.600" fontSize="2xl">
            Rs. {product.price}
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <ButtonGroup spacing="2">
          <Button
            variant="solid"
            colorScheme="orange"
            onClick={() => {
              addItem(product);
              push("/users/cart");
            }}
          >
            Buy now
          </Button>
          <Button
            variant="ghost"
            colorScheme="orange"
            onClick={() => addItem(product)}
          >
            Add to cart
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};
