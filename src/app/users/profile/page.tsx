"use client";
import { backendClient } from "@/app/helpers/axios";
import {
  determinePasswordStrength,
  getColorAsPasswordStrength,
} from "@/app/helpers/determinePasswordStrength";
import { PasswordInput } from "@/components/common/PasswordInput";
import { useAuthContext } from "@/contexts/AuthContext";
import { MainLayout } from "@/layout/mainLayout";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { isAxiosError } from "axios";
import { useFormik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";

interface ProfileUpdateValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

const PROFILE_UPDATE_FORM = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at-least 2 characters"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Please input valid email")
    .required("Email is required"),
  password: Yup.string()
    .nullable()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,12}$/,
      "Password must be 8-12 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character (@, $, !, %, *, ?, &, #)"
    ),
  confirmPassword: Yup.string()
    .nullable()
    .test("passwords-match", "Passwords must match", function (value) {
      return this.parent.password === value;
    }),
  phoneNumber: Yup.string().required("Phone number is required"),
});

export default function Profile() {
  const { push } = useRouter();
  const { get } = useSearchParams();

  const { user, setUser } = useAuthContext();
  const toast = useToast();
  const [genericError, setGenericError] = useState<Array<string>>([]);

  const handleProfileUpdate = async (values: ProfileUpdateValues) => {
    try {
      let data = {};
      if (values.password.length > 0) {
        const { confirmPassword, ..._values } = values;
        data = _values;
      } else {
        const { password, confirmPassword, ..._values } = values;
        data = _values;
      }
      const response = await backendClient.patch(
        `/users/${user?.id}/profile`,
        data
      );
      setUser(response.data);
      toast({
        title: "Updated profile successfully",
        isClosable: true,
        status: "success",
      });
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

  const form = useFormik<ProfileUpdateValues>({
    initialValues: {
      email: user?.email!,
      firstName: user?.firstName!,
      lastName: user?.lastName!,
      password: "",
      confirmPassword: "",
      phoneNumber: user?.phoneNumber!,
    },
    onSubmit: handleProfileUpdate,
    validationSchema: PROFILE_UPDATE_FORM,
    enableReinitialize: true,
  });

  return (
    <MainLayout>
      <Flex flexDirection={"column"} alignItems={"center"} gap={2}>
        <Heading>Hi, {user?.firstName}</Heading>
        <Text textAlign={"center"}>Keep your profile shine!</Text>
      </Flex>

      <Grid w={"5xl"} templateColumns="repeat(2, 1fr)" gap={5} padding={10}>
        {get("password_expired") && (
          <GridItem colSpan={2}>
            <Alert status="warning">
              <AlertIcon />
              <AlertTitle>
                Your password is more than 60 days old, please change it!
              </AlertTitle>
            </Alert>
          </GridItem>
        )}
        {!user?.verified && (
          <GridItem colSpan={2}>
            <Alert status="warning">
              <AlertIcon />
              <AlertTitle>Please verify your account.</AlertTitle>
            </Alert>
          </GridItem>
        )}
        <GridItem>
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
        </GridItem>

        <GridItem>
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
        </GridItem>

        <FormControl isInvalid={!!(form.errors.email && form.touched.email)}>
          <FormLabel>Email</FormLabel>
          <Input
            onChange={form.handleChange}
            name="email"
            disabled
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

        <GridItem>
          <Button colorScheme="orange" onClick={form.submitForm} minW={"200px"}>
            Update
          </Button>
        </GridItem>
      </Grid>
    </MainLayout>
  );
}
