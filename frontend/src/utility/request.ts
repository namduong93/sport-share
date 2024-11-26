/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from "axios";
import { backendURL } from "../../config/backendURLConfig";

/**
 * A utility class that provides simplified HTTP request methods using Axios.
 *
 * This class exposes static methods for making HTTP requests to a specified backend server. Each method
 * can accept parameters for the request path, query parameters, and custom headers. These methods automatically include credentials
 * with the request, ensuring that cookies and authentication tokens are handled correctly.
 *
 * The following methods are available:
 * - `get<T>(path: string, params: Record<string, any>, headers: Record<string, any>)`: Makes a GET request to the specified `path`
 *   with query parameters and optional headers.
 * - `post<T>(path: string, params: Record<string, any>, headers: Record<string, any>)`: Makes a POST request with the provided body parameters.
 * - `put<T>(path: string, params: Record<string, any>, headers: Record<string, any>)`: Makes a PUT request to update the resource at the `path`.
 * - `delete<T>(path: string, params: Record<string, any>, headers: Record<string, any>)`: Makes a DELETE request to remove a resource.
 *
 * @module sendRequest
 */
export class sendRequest {
  public static get<T>(
    path: string,
    params: Record<string, any> = {},
    headers: Record<string, any> = {}
  ): Promise<AxiosResponse<T, any>> {
    return axios.get<T>(
      `${backendURL.HOST}:${backendURL.PORT}${path}?${new URLSearchParams(
        params
      )}`,
      {
        headers
      }
    );
  }

  public static post<T>(
    path: string,
    params: Record<string, any> = {},
    headers: Record<string, any> = {}
  ): Promise<AxiosResponse<T, any>> {
    return axios.post<T>(
      `${backendURL.HOST}:${backendURL.PORT}${path}`,
      params,
      {
        headers
      }
    );
  }

  public static put<T>(
    path: string,
    params: Record<string, any> = {},
    headers: Record<string, any> = {}
  ): Promise<AxiosResponse<T, any>> {
    return axios.put<T>(
      `${backendURL.HOST}:${backendURL.PORT}${path}`,
      params,
      {
        headers
      }
    );
  }

  public static delete<T>(
    path: string,
    params: Record<string, any> = {},
    headers: Record<string, any> = {}
  ): Promise<AxiosResponse<T, any>> {
    return axios.delete<T>(
      `${backendURL.HOST}:${backendURL.PORT}${path}?${new URLSearchParams(
        params
      )}`,
      {
        headers
      }
    );
  }

  // handleErrorStatus(error, [400, 401, etc.], () => { do something })
  // give the error object a list of status codes and a callback function for handling those error statuses
  public static handleErrorStatus(
    error: unknown,
    statuses: Array<number>,
    handler: CallableFunction
  ) {
    if (axios.isAxiosError(error)) {
      const potentialErrorStatus = error.response?.status;
      if (potentialErrorStatus) {
        const errorStatus = potentialErrorStatus as number;
        if (statuses.includes(errorStatus)) {
          handler();
          return;
        }
      }
    } else {
      throw error;
    }
  }
}
