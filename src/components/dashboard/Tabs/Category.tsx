import { backendClient } from "@/app/helpers/axios";
import { ICategory } from "@/components/products/UserProductList";
import {
  Button,
  ButtonGroup,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { AddCategoryModal } from "../modals/AddCategoryModal";

dayjs.extend(relativeTime);

export const CategoryTab = () => {
  const [categories, setCategories] = useState<Array<ICategory>>([]);
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const fetchCategories = async () => {
    try {
      const response = await backendClient.get("/products/category");

      setCategories(response.data);
    } catch (error) {
      toast({
        title: "Failed to fetch categories",
        status: "error",
      });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <TableContainer width={"100%"}>
      <AddCategoryModal
        callback={fetchCategories}
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
      />
      <Button
        justifySelf={"flex-end"}
        mb={5}
        colorScheme="orange"
        onClick={onOpen}
      >
        Add Category
      </Button>
      <Table variant="striped" colorScheme="orange">
        {" "}
        <Thead>
          <Tr>
            <Th>Id</Th>
            <Th>Name</Th>
            <Th>Created At</Th>
            <Th>Updated At</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {categories.map((category) => (
            <Tr>
              <Td>{category.id}</Td>
              <Td>{category.name}</Td>
              <Td>{dayjs(category.createdAt).fromNow()}</Td>
              <Td>{dayjs(category.updatedAt).fromNow()}</Td>
              <Td>
                <ButtonGroup size={"sm"}>
                  <IconButton
                    aria-label="delete"
                    colorScheme={"red"}
                    icon={<MdDelete fontSize="18px" />}
                  ></IconButton>
                  <IconButton
                    aria-label="edit"
                    colorScheme={"orange"}
                    icon={<MdEdit fontSize="18px" />}
                  ></IconButton>
                </ButtonGroup>
              </Td>
            </Tr>
          ))}
          {categories.length === 0 && (
            <Tr>No items found, create a new category!</Tr>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
