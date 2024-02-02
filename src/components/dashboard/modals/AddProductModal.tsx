"use client";
import { backendClient } from "@/app/helpers/axios";
import { ICategory } from "@/components/products/UserProductList";
import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";

export interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  callback: () => void;
}

interface AddProductModalValues {
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
  inStock: boolean;
}

const ADD_CATEGORY_FORM = Yup.object().shape({
  name: Yup.string().required("Product name is required"),
  price: Yup.number().required("Price is required"),
  category: Yup.string().required("Category is required"),
  description: Yup.string().required("Description is required"),
  imageUrl: Yup.string()
    .url("Valid URL is required")
    .required("URL is required"),
  inStock: Yup.boolean().default(false),
});

export const AddProductModal = ({
  isOpen,
  onClose,
  onOpen,
  callback,
}: AddProductModalProps) => {
  const toast = useToast();

  const [categories, setCategories] = useState<Array<ICategory>>([]);

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

  const handleSubmit = async (value: AddProductModalValues) => {
    try {
      await backendClient.post("/products", {
        ...value,
      });

      toast({
        title: "Created Successfully",
        status: "success",
      });
      onClose();
      callback();
    } catch (error) {
      toast({
        title: "Failed to submit",
        status: "error",
      });
    }
  };

  const form = useFormik({
    initialValues: {
      name: "",
      category: "",
      description: "",
      imageUrl: "",
      inStock: false,
      price: 0,
    } as AddProductModalValues,
    onSubmit: handleSubmit,
    validationSchema: ADD_CATEGORY_FORM,
  });

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDirection={"column"} w={"100%"} gap={4} padding={2}>
              <FormControl
                isInvalid={!!(form.errors.name && form.touched.name)}
              >
                <FormLabel> Name</FormLabel>
                <Input
                  onChange={form.handleChange}
                  name="name"
                  placeholder="Enter Product Name"
                  value={form.values.name}
                  onBlur={form.handleBlur}
                />
                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={
                  !!(form.errors.description && form.touched.description)
                }
              >
                <FormLabel>Description</FormLabel>
                <Textarea
                  onChange={form.handleChange}
                  name="description"
                  placeholder="Enter Product Description"
                  value={form.values.description}
                  onBlur={form.handleBlur}
                />
                <FormErrorMessage>{form.errors.description}</FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={!!(form.errors.price && form.touched.price)}
              >
                <FormLabel>Price</FormLabel>
                <Input
                  onChange={form.handleChange}
                  name="price"
                  placeholder="Enter Product Price"
                  value={form.values.price}
                  onBlur={form.handleBlur}
                  type="number"
                />
                <FormErrorMessage>{form.errors.price}</FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={!!(form.errors.imageUrl && form.touched.imageUrl)}
              >
                <FormLabel>Image URL</FormLabel>
                <Input
                  onChange={form.handleChange}
                  name="imageUrl"
                  placeholder="Enter Product URL"
                  value={form.values.imageUrl}
                  onBlur={form.handleBlur}
                />
                <FormErrorMessage>{form.errors.imageUrl}</FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={!!(form.errors.imageUrl && form.touched.imageUrl)}
              >
                <FormLabel>In Stock</FormLabel>
                <Checkbox
                  colorScheme="orange"
                  onChange={form.handleChange}
                  name="inStock"
                  isChecked={form.values.inStock}
                  onBlur={form.handleBlur}
                />
                <FormErrorMessage>{form.errors.imageUrl}</FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={!!(form.errors.category && form.touched.category)}
              >
                <FormLabel>Category</FormLabel>
                <Select
                  name="category"
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                >
                  {categories?.map((category) => (
                    <option value={category.id}>{category.name}</option>
                  ))}
                </Select>
                <FormErrorMessage>{form.errors.category}</FormErrorMessage>
              </FormControl>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="orange" onClick={form.submitForm}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
