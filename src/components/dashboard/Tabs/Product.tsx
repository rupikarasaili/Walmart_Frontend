"use client";
import { backendClient } from "@/app/helpers/axios";
import { IProduct } from "@/components/products/UserProductList";
import {
  Button,
  ButtonGroup,
  IconButton,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { AddProductModal } from "../modals/AddProductModal";
import { EditProductModal } from "../modals/EditProductModal";

dayjs.extend(relativeTime);

export const ProductTab = () => {
  const [products, setProducts] = useState<Array<IProduct>>([]);
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isProductDeleting, setIsProductDeleting] = useState(false);
  const {
    isOpen: isEditOpen,
    onClose: onEditClose,
    onOpen: onEditOpen,
  } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await backendClient.get("/products");

      setProducts(response.data);
    } catch (error) {
      toast({
        title: "Failed to fetch products",
        status: "error",
      });
    }
  };

  const deleteProduct = async (id: string) => {
    setIsProductDeleting(true);
    try {
      const response = await backendClient.delete(`/products/${id}`);

      toast({
        title: "Deleted successfully",
        status: "success",
      });
      fetchProducts();
    } catch (error) {
      toast({
        title: "Failed to delete product",
        status: "error",
      });
    } finally {
      setIsProductDeleting(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <TableContainer width={"100%"}>
      <AddProductModal
        callback={fetchProducts}
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
      />
      {selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          callback={fetchProducts}
          isOpen={isEditOpen}
          onClose={onEditClose}
          onOpen={onEditOpen}
        />
      )}
      <Button
        justifySelf={"flex-end"}
        mb={5}
        colorScheme="orange"
        onClick={onOpen}
      >
        Add Product
      </Button>
      <Table variant="striped" colorScheme="orange">
        {" "}
        <Thead>
          <Tr>
            <Th>Id</Th>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>Image</Th>
            <Th>Category</Th>
            <Th>Price (Rs)</Th>
            <Th>In Stock</Th>
            <Th>Created At</Th>
            <Th>Updated At</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.map((product) => (
            <Tr>
              <Td>
                <Tooltip label={product.id}>
                  <Text isTruncated maxW={250}>
                    {product.id}
                  </Text>
                </Tooltip>
              </Td>
              <Td>{product.name}</Td>
              <Td>
                <Link
                  textDecoration={"underline"}
                  href={product.imageUrl}
                  target="_blank"
                >
                  Open Image
                </Link>
              </Td>
              <Td>
                <Text isTruncated maxW={250}>
                  <Tooltip label={product.description}>
                    {product.description}
                  </Tooltip>
                </Text>
              </Td>
              <Td>{product.category.name}</Td>
              <Td>{product.price}</Td>
              <Td>{product.inStock ? "IN STOCK" : "OUT OF STOCK"}</Td>
              <Td>{dayjs(product.createdAt).fromNow()}</Td>
              <Td>{dayjs(product.updatedAt).fromNow()}</Td>
              <Td>
                <ButtonGroup size={"sm"}>
                  <IconButton
                    aria-label="delete"
                    colorScheme={"red"}
                    icon={<MdDelete fontSize="18px" />}
                    isLoading={isProductDeleting}
                    onClick={() => deleteProduct(product.id)}
                  ></IconButton>
                  <IconButton
                    aria-label="edit"
                    colorScheme={"orange"}
                    icon={<MdEdit fontSize="18px" />}
                    onClick={() => {
                      setSelectedProduct(product);
                      onEditOpen();
                    }}
                  ></IconButton>
                </ButtonGroup>
              </Td>
            </Tr>
          ))}
          {products.length === 0 && (
            <Tr>No items found, create a new product!</Tr>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
