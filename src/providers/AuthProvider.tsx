// "use client";
// import { ServerCall } from "@/types/server";
// import { QueryFunction, QueryKey } from "@tanstack/react-query";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import React, { createContext, Dispatch, use, useState } from "react";

// import { api, API_URL } from "@/services/serverCall";
// import axios from "axios";

// type Props = {
//     children: React.ReactNode;
// };

// const AuthContext = createContext<AuthContext | null>(null);

// const AuthProvider = ({ children }: Props) => {
// const [token, setToken] = useState("")
//     // Generic server call
//  async function serverCall<T = unknown>(
//   config: ServerCall<T>
// ): Promise<T> {
//   try {
//     const response = await api.request<T>({
//       ...config,
//       url: `${API_URL}/${config.url}`,
//       withCredentials: true,
//     });
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {

//       throw error.response?.data;
//     }
//     throw error;
//   }
// }

// // Mutation wrapper for React Query
//  const mutationRequest = <T = unknown, TVariables = ServerCall>(
//   configFn?: (variables: TVariables) => ServerCall
// ) => {
//   return async (variables: TVariables) => {
//     const config = configFn ? configFn(variables) : (variables as ServerCall);
//     return await serverCall(config);
//   };
// };

// // GET request wrapper for React Query
//  const getRequest = <T = unknown>(): QueryFunction<T, QueryKey> => {
//   return async ({ queryKey }) => {
//     let path = "";
//     if (Array.isArray(queryKey)) {
//       path = queryKey.join("/");
//     } else {
//       path = String(queryKey);
//     }

//     return await serverCall<T>({
//       url: path,
//       method: "GET",
//     });
//   };
// };

//     const queryClient = new QueryClient({
//       defaultOptions: {
//         queries: {
//           queryFn: getRequest(),
//           refetchOnWindowFocus: false,
//         },
//         mutations: {
//           mutationFn: mutationRequest(),
//         },
//       },
//     });

//   return (
//       <QueryClientProvider client={queryClient}>

//        {children}
//           <ReactQueryDevtools initialIsOpen={false} />

//       </QueryClientProvider>
//   );
// };

// export default AuthProvider;

// // Custom hook to use the context
// export const useAuth = (): AuthContext => {
//   const context = use(AuthContext);
//   if (!context) {
//     throw new Error("useAuthContext must be used within a ThemeProvider");
//   }
//   return context;
// };

// export type AuthContext = {
// token: string,
// setToken: Dispatch<React.SetStateAction<string>>
// logout: () => void,

// }

"use client";

import React, {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import {
  QueryClient,
  QueryClientProvider,
  QueryKey,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import axios from "axios";
import Cookies from "js-cookie";
import { ServerCall } from "@/types/server";
import { api, API_URL } from "@/services/serverCall";

// ---------------------
// Context Types
// ---------------------
type AuthContextType = {
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
  logout: () => void;
  userInfo: {
    firstName: string;
    lastName: string;
    image: string;
  };
  setUserInfo: Dispatch<
    React.SetStateAction<{
      firstName: string;
      lastName: string;
      image: string;
    }>
  >;
};

const AuthContext = createContext<AuthContextType | null>(null);

// ---------------------
// Auth Provider
// ---------------------
type Props = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const [token, setToken] = useState<string>("");
  const [userInfo, setUserInfo] = useState<AuthContextType["userInfo"]>({
    firstName: "",
    lastName: "",
    image: "",
  });

  // Load token from cookie when the app starts
  useEffect(() => {
    const savedToken = Cookies.get("token");
    if (savedToken) setToken(savedToken);
    const savedUserInfo = Cookies.get("userInfo");
    if (savedUserInfo) setUserInfo(JSON.parse(savedUserInfo));
  }, []);

  // Save token in cookie whenever it changes
  useEffect(() => {
    if (token) {
      Cookies.set("token", token, { expires: 7 });
    } else {
      Cookies.remove("token");
    }
  }, [token]);

  // Logout handler
  const logout = () => {
    setToken("");
    Cookies.remove("token");
    Cookies.remove("userInfo");
  };

  // Generic request handler
  async function serverCall<T = unknown>(config: ServerCall<T>): Promise<T> {
    try {
      const response = await api.request<T>({
        ...config,
        url: `${API_URL}/${config.url}`,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(config.headers || {}),
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data;
      }
      throw error;
    }
  }

  // React Query default handlers
  const queryFn = async ({ queryKey }: { queryKey: QueryKey }) => {
    const path = Array.isArray(queryKey)
      ? queryKey.join("/")
      : String(queryKey);
    return await serverCall({ url: path, method: "GET" });
  };

  const mutationFn = async <T = unknown, TVariables = ServerCall>(
    variables: TVariables
  ) => {
    const config = variables as ServerCall<T>;
    return await serverCall<T>(config);
  };

  // React Query Client
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryFn,
        refetchOnWindowFocus: false,
      },
      mutations: {
        mutationFn,
      },
    },
  });

  return (
    <AuthContext.Provider
      value={{ token, setToken, logout, setUserInfo, userInfo }}
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AuthContext.Provider>
  );
};

export default AuthProvider;

// ---------------------
// useAuth Hook
// ---------------------
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
