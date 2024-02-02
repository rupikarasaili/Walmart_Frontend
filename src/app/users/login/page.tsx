"use client";
import { backendClient } from "@/app/helpers/axios";
import { PasswordInput } from "@/components/common/PasswordInput";
import { useAuthContext } from "@/contexts/AuthContext";
import { AuthLayout } from "@/layout/authLayout";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
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

interface LoginFormValues {
  email: string;
  password: string;
}

const LOGIN_FORM = Yup.object().shape({
  email: Yup.string()
    .email("Please input valid email")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function Login() {
  const { setToken, setUser } = useAuthContext();

  const { push } = useRouter();
  const toast = useToast();
  const [genericError, setGenericError] = useState<Array<string>>([]);

  const handleLogin = async (values: LoginFormValues) => {
    try {
      const response = await backendClient.post("/users/login", values);
      toast({
        title: "Logged In",
        isClosable: true,
        status: "success",
      });

      const token = response.data.access_token;
      const requiresPasswordChange = response.data.requiresChange;
      const user = response.data.user;
      setUser(user);
      setToken(token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("requiresPasswordChange", requiresPasswordChange);

      if (requiresPasswordChange) {
        push("/users/profile?password_expired=1");
      } else {
        if (user.isAdmin) {
          push("/users/dashboard");
        } else {
          push("/");
        }
      }
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
          title: "Failed to login",
          status: "error",
          isClosable: true,
        });
      }
    }
  };

  const form = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: handleLogin,
    validationSchema: LOGIN_FORM,
  });

  return (
    <AuthLayout>
      <Flex flexDirection={"column"} alignItems={"center"} gap={2}>
        <Heading>Login</Heading>
        <Text textAlign={"center"}>
          Login to experience shopping to the next level and buy amazing crafts.
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
          isInvalid={!!(form.errors.password && form.touched.password)}
        >
          <FormLabel>Password</FormLabel>
          <PasswordInput
            setValue={form.handleChange}
            name="password"
            value={form.values.password}
            handleBlur={form.handleBlur}
          />
          <FormErrorMessage>{form.errors.password}</FormErrorMessage>
        </FormControl>

        <Button colorScheme="orange" onClick={form.submitForm}>
          Login
        </Button>

        <Flex flexDirection={"column"} alignItems={"center"} gap={1}>
          <Link
            onClick={() => push("/users/register")}
            textDecoration={"underline"}
          >
            No Account? Create a new account
          </Link>

          <Link
            onClick={() => push("/users/register")}
            textDecoration={"underline"}
          >
            Forgot Password
          </Link>
        </Flex>
      </Flex>
    </AuthLayout>
  );
}
