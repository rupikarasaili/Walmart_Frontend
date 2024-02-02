import { useRouter } from "next/navigation";
import React from "react";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  verified: boolean;
  suspended: boolean;
  type: string;
  created_at: Date;
  updated_at: Date;
  isAdmin: boolean;
}

export interface AuthContextProps {
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  user: User | null;
}

export const AuthContext = React.createContext<AuthContextProps>({
  setToken: (token: string) => {},
  setUser: (user: User) => {},
  logout: () => {},
  user: null,
});

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [token, setToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("user")) {
        try {
          setUser(JSON.parse(localStorage.getItem("user")!));
          setToken(localStorage.getItem("token")!);
        } catch (error) {}
      }
    }
  }, []);

  const storeToken = (token: string) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const storeUser = (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    router.replace("/users/login");
    localStorage.clear();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        logout,
        setToken: storeToken,
        setUser: storeUser,
        user: user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return React.useContext(AuthContext);
};
