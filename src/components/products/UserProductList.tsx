import { backendClient } from "@/app/helpers/axios";
import {
  Flex,
  Grid,
  GridItem,
  Heading,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { UserProduct } from "./UserProduct";

export interface ICategory {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: ICategory;
}

export const UserProductList = () => {
  const toast = useToast();
  const [products, setProducts] = useState<Array<IProduct>>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await backendClient.get("/products/");
      setProducts(response.data);
    } catch (error) {
      console.error(error);
      toast({
        status: "error",
        title: "Failed to fetch products",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Grid templateColumns={"repeat(6, 1fr)"} width={"100%"} gap={10}>
      <GridItem colSpan={6}>
        <Heading>Products</Heading>
      </GridItem>

      {isLoading && (
        <GridItem colSpan={6}>
          <Flex
            alignItems={"center"}
            flexDirection={"row"}
            minH={"500px"}
            gap={4}
            width={"100%"}
            height={"100%"}
            justifyContent={"center"}
          >
            <Heading size={"md"}>Loading</Heading>
            <Spinner />
          </Flex>
        </GridItem>
      )}

      {!isLoading && products.length === 0 && (
        <Heading>No Products Found</Heading>
      )}

      {!isLoading &&
        products.map((product) => (
          <GridItem>
            <UserProduct product={product} />
          </GridItem>
        ))}
    </Grid>
  );
};
