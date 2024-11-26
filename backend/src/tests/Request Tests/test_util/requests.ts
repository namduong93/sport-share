/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from 'axios';

// Later can make a .env file and use the dotenv package to load
// HOST and PORT into process.env
export const backendURL = {
  HOST: 'http://127.0.0.1',
  PORT: '8000'
};

// USAGE:
// To use the request interface, call the corresponding function,
// supply your route as  string, and your parameters as a Javascript object
// e.g.:
// request.get(/student/details, { studentId: 5 });

export class sendRequest {
  static get<T>(path: string, params: Record<string, any> = {}, headers: Record<string, any> = {}): Promise<AxiosResponse<T, any>> {
    return axios.get<T>(`${backendURL.HOST}:${backendURL.PORT}${path}?${new URLSearchParams(params)}`, {
      withCredentials: true,
      ...headers
    });
    // only reason ... spread is used is incase in the future we want to add some headers that
    // are sent everytime in every request.
  }

  static post<T>(path: string, params: Record<string, any> = {}, headers: Record<string, any> = {}): Promise<AxiosResponse<T, any>> {
    return axios.post<T>(`${backendURL.HOST}:${backendURL.PORT}${path}`, params, {
      withCredentials: true,
      ...headers
    });
  }

  static put<T>(path: string, params: Record<string, any> = {}, headers: Record<string, any> = {}): Promise<AxiosResponse<T, any>>  {
    return axios.put<T>(`${backendURL.HOST}:${backendURL.PORT}${path}`, params, {
      withCredentials: true,
      ...headers
    });
  }

  static delete<T>(path: string, params: Record<string, any> = {}, headers: Record<string, any> = {}): Promise<AxiosResponse<T, any>> {
    return axios.delete<T>(`${backendURL.HOST}:${backendURL.PORT}${path}?${new URLSearchParams(params)}`, {
      withCredentials: true,
      ...headers
    });
  }

  // handleErrorStatus(error, [400, 401, etc.], () => { do something })
  // give the error object a list of status codes and a callback function for handling those error statuses
  static handleErrorStatus(error: unknown, statuses: Array<number>, handler: CallableFunction) {
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