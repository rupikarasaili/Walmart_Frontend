import { backendClient } from "@/app/helpers/axios";
import { useCartContext } from "@/contexts/CartContext";
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

export interface UserCartCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

interface CheckoutFormValues {
  name: string;
  number: string;
  cvv: string;
  date: string;
}

const CHECKOUT_FORM = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "First name must be at-least 2 characters"),
  number: Yup.string().required("Card number is required"),
  cvv: Yup.string().required("CVV number is required"),
  date: Yup.string().required("Expiry date is required"),
});

export const UserCartCheckoutModal = ({
  isOpen,
  onClose,
  onOpen,
}: UserCartCheckoutModalProps) => {
  const { cart, resetCart } = useCartContext();
  const toast = useToast();
  const handleCheckout = async (value: CheckoutFormValues) => {
    const products = Object.values(cart.products!).map((product) => ({
      id: product.id,
      quantity: product.quantity,
    }));

    try {
      await backendClient.post("/products/buy", {
        products: products,
        card: value,
      });

      toast({
        title: "Submitted Successfully",
        status: "success",
      });
      resetCart();
      onClose();
    } catch (error) {
      toast({
        title: "Failed to submit",
        status: "error",
      });
    }
  };

  const form = useFormik({
    initialValues: {
      cvv: "",
      name: "",
      date: "",
      number: "",
    } as CheckoutFormValues,
    onSubmit: handleCheckout,
    validationSchema: CHECKOUT_FORM,
  });

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Checkout</ModalHeader>
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
                  placeholder="Enter First Name"
                  value={form.values.name}
                  onBlur={form.handleBlur}
                />
                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={!!(form.errors.number && form.touched.number)}
              >
                <FormLabel>Cart Number</FormLabel>
                <Input
                  onChange={form.handleChange}
                  name="number"
                  placeholder="Enter Card Number"
                  value={form.values.number}
                  onBlur={form.handleBlur}
                />
                <FormErrorMessage>{form.errors.number}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!(form.errors.cvv && form.touched.cvv)}>
                <FormLabel>CVV Name</FormLabel>
                <Input
                  onChange={form.handleChange}
                  name="cvv"
                  placeholder="Enter CVV"
                  value={form.values.cvv}
                  onBlur={form.handleBlur}
                />
                <FormErrorMessage>{form.errors.cvv}</FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={!!(form.errors.date && form.touched.date)}
              >
                <FormLabel>Expiry Date</FormLabel>
                <Input
                  onChange={form.handleChange}
                  name="date"
                  placeholder="Enter Date"
                  value={form.values.date}
                  onBlur={form.handleBlur}
                />
                <FormErrorMessage>{form.errors.date}</FormErrorMessage>
              </FormControl>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="orange" onClick={form.submitForm}>
              Finish
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
