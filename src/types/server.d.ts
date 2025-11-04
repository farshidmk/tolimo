import { AxiosRequestConfig, Method } from "axios";

export type ServerCall<T = unknown> = Omit<AxiosRequestConfig<T>, "method"> & {
  method: Method;
};

type ServerResponse<T = unknown> = {
  data: T;

  /**
   * if has server error is false not true
   */
  isSuccessful: boolean;
  /**
   * error message or success message
   */
  message: string | null;

  /**
   * Http status code
   */
  statusCode: number;
};
