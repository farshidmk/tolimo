import { AxiosRequestConfig, Method } from "axios";

export type ServerCall<T = unknown> = Omit<AxiosRequestConfig<T>, "method"> & {
  method: Method;
};
