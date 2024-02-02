"use client";
import { backendClient } from "@/app/helpers/axios";
import {
  determinePasswordStrength,
  getColorAsPasswordStrength,
} from "@/app/helpers/determinePasswordStrength";
import { PasswordInput } from "@/components/common/PasswordInput";
import { AuthLayout } from "@/layout/authLayout";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
  useToast,
} from "@chakra-ui/react";
import { isAxiosError } from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";

interface RegistrationFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

const REGISTRATION_FORM = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at-least 2 characters"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Please input valid email")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,12}$/,
      "Password must be 8-12 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character (@, $, !, %, *, ?, &, #)"
    ),
  phoneNumber: Yup.string().required("Phone number is required"),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .test("passwords-match", "Passwords must match", function (value) {
      return this.parent.password === value;
    }),
});

export default function Register() {
  const { push } = useRouter();
  const toast = useToast();
  const [genericError, setGenericError] = useState<Array<string>>([]);

  const handleRegistration = async (values: RegistrationFormValues) => {
    try {
      const { confirmPassword, ...data } = values;
      const response = await backendClient.post("/users", data);
      toast({
        title: "Successful Registration",
        description: "You will be navigated to login page inorder to login",
        isClosable: true,
        status: "success",
      });
      push("/users/login");
    } catch (error) {
      const isAxios = isAxiosError(error);

      if (isAxios) {
        if (Array.isArray(error.response?.data.message)) {
          setGenericError(error.response?.data.message);
        } else {
          toast({
            title: error.response?.data.message,
            status: "error",
            isClosable: true,
          });
        }
      } else {
        toast({
          title: "Failed to register",
          status: "error",
          isClosable: true,
        });
      }
    }
  };

  const form = useFormik<RegistrationFormValues>({
    initialValues: {
      confirmPassword: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      phoneNumber: "",
    },
    onSubmit: handleRegistration,
    validationSchema: REGISTRATION_FORM,
  });

  return (
    <AuthLayout>
      <Flex flexDirection={"column"} alignItems={"center"} gap={2}>
        <Heading>Register</Heading>
        <Text textAlign={"center"}>
          Sign up for free to experience shopping to the next level and buy
          amazing crafts.
        </Text>
      </Flex>

      <Flex
        flexDirection={"column"}
        w={"100%"}
        gap={4}
        border={"1px solid orange"}
        padding={10}
        borderRadius={4}
      >
        <FormControl
          isInvalid={!!(form.errors.firstName && form.touched.firstName)}
        >
          <FormLabel>First Name</FormLabel>
          <Input
            onChange={form.handleChange}
            name="firstName"
            placeholder="Enter First Name"
            value={form.values.firstName}
            onBlur={form.handleBlur}
          />
          <FormErrorMessage>{form.errors.firstName}</FormErrorMessage>
        </FormControl>

        <FormControl
          isInvalid={!!(form.errors.lastName && form.touched.lastName)}
        >
          <FormLabel>Last Name</FormLabel>
          <Input
            onChange={form.handleChange}
            name="lastName"
            placeholder="Enter Last Name"
            value={form.values.lastName}
            onBlur={form.handleBlur}
          />
          <FormErrorMessage>{form.errors.lastName}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!(form.errors.email && form.touched.email)}>
          <FormLabel>Email</FormLabel>
          <Input
            onChange={form.handleChange}
            name="email"
            placeholder="Enter Email"
            value={form.values.email}
            onBlur={form.handleBlur}
          />
          <FormErrorMessage>{form.errors.email}</FormErrorMessage>
        </FormControl>

        <FormControl
          isInvalid={!!(form.errors.phoneNumber && form.touched.phoneNumber)}
        >
          <FormLabel>Phone Number</FormLabel>
          <Input
            onChange={form.handleChange}
            name="phoneNumber"
            placeholder="Enter Phone Number"
            value={form.values.phoneNumber}
            onBlur={form.handleBlur}
          />
          <FormErrorMessage>{form.errors.phoneNumber}</FormErrorMessage>
        </FormControl>

        <FormControl
          isInvalid={!!(form.errors.password && form.touched.password)}
        >
          <FormLabel>Password</FormLabel>
          <PasswordInput
            setValue={form.handleChange}
            name="password"
            placeholder="Enter Password"
            value={form.values.password}
            handleBlur={form.handleBlur}
          />
          <FormErrorMessage>{form.errors.password}</FormErrorMessage>
          {form.values.password.length > 0 && (
            <FormHelperText
              color={getColorAsPasswordStrength(
                determinePasswordStrength(form.values.password)
              )}
            >
              Strength: {determinePasswordStrength(form.values.password)}
            </FormHelperText>
          )}
        </FormControl>

        <FormControl
          isInvalid={
            !!(form.errors.confirmPassword && form.touched.confirmPassword)
          }
        >
          <FormLabel>Confirm Password</FormLabel>
          <PasswordInput
            setValue={form.handleChange}
            name="confirmPassword"
            placeholder="Enter Confirm Password"
            value={form.values.confirmPassword}
            handleBlur={form.handleBlur}
          />
          <FormErrorMessage>{form.errors.confirmPassword}</FormErrorMessage>
        </FormControl>

        <Button colorScheme="orange" onClick={form.submitForm}>
          Register
        </Button>
        <Flex flexDirection={"column"} alignItems={"center"} gap={1}>
          <Link
            onClick={() => push("/users/login")}
            textDecoration={"underline"}
          >
            Already Have Account? Login Here
          </Link>
        </Flex>
      </Flex>
    </AuthLayout>
  );
}
