import axios from "axios";
import { ADMIN_TOKEN_STORAGE_KEY, Storage } from "../..";

// Default config options
const defaultOptions = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
};

// Update instance
const instance = axios.create(defaultOptions);

// Set the AUTH token for any request
instance.interceptors.request.use(
  (config: any) => {
    if (!config.isExternal) {
      try {
        const storage = new Storage(ADMIN_TOKEN_STORAGE_KEY);
        const authorization_object = storage.get();
        if (authorization_object) {
          config.headers[
            "authorization"
          ] = `Bearer ${authorization_object.token}`;
        }
      } catch (error) {
        console.log(4.5, `error`, error);
      }
    }
    config.headers["x-api-key"] = "GetHouse4rentKey";
    return config;
  },
  (error: any) => {
    // Do something with request error
    return Promise.reject(error);
  }
);
// Add a response interceptor
instance.interceptors.response.use(
  (response: any) => {
    // Do something with response data
    return response.data;
  },
  (error: any) => {
    // Do something with response error
    return Promise.reject(error.response);
  }
);

export const createApiRequest = (config: any) => instance(config);

export default createApiRequest;

export { instance as AxiosInstance };
