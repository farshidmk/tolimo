import { ServerCall } from "@/types/server";
import { QueryFunction, QueryKey } from "@tanstack/react-query";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3008";

// Create Axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Generic server call
export async function serverCall<T = unknown>(
  config: ServerCall<T>
): Promise<T> {
  try {
    const response = await api.request<T>({
      ...config,
      url: `${API_URL}/${config.url}`,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.status === 401) {
        window.location.href = "/auth/login";
      }
      throw error.response?.data;
    }
    throw error;
  }
}

// Mutation wrapper for React Query
export const mutationRequest = <T = unknown, TVariables = ServerCall>(
  configFn?: (variables: TVariables) => ServerCall
) => {
  return async (variables: TVariables) => {
    const config = configFn ? configFn(variables) : (variables as ServerCall);
    return await serverCall(config);
  };
};

// GET request wrapper for React Query
export const getRequest = <T = unknown>(): QueryFunction<T, QueryKey> => {
  return async ({ queryKey }) => {
    let path = "";
    if (Array.isArray(queryKey)) {
      path = queryKey.join("/");
    } else {
      path = String(queryKey);
    }

    return await serverCall<T>({
      url: path,
      method: "GET",
    });
  };
};
