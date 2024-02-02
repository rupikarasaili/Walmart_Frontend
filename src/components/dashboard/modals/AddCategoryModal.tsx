import { backendClient } from "@/app/helpers/axios";
import {
  Button,
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
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";

export interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  callback: () => void;
}

interface AddCategoryModalValues {
  name: string;
}

const ADD_CATEGORY_FORM = Yup.object().shape({
  name: Yup.string().required("Category name is required"),
});

export const AddCategoryModal = ({
  isOpen,
  onClose,
  onOpen,
  callback,
}: AddCategoryModalProps) => {
  const toast = useToast();

  const handleSubmit = async (value: AddCategoryModalValues) => {
    try {
      await backendClient.post("/products/category", {
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
    } as AddCategoryModalValues,
    onSubmit: handleSubmit,
    validationSchema: ADD_CATEGORY_FORM,
  });

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Category</ModalHeader>
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
                  placeholder="Enter Category Name"
                  value={form.values.name}
                  onBlur={form.handleBlur}
                />
                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
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
