import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { message } from "antd";
import axios from "axios";

// Create an Axios instance
const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api", // Use environment variable or default to /api proxy
  timeout: 10000,
});

// Request Interceptor
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // You can add auth token here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response;
    // Unwrap the response to get the actual data if it matches our standard format
    // { code: 0, message: '', data: ..., success: true }
    if (
      data &&
      typeof data === "object" &&
      "code" in data &&
      "success" in data
    ) {
      if (data.code === 0 || data.success === true) {
        return data.data;
      } else {
        // Handle business error (code !== 0)
        message.error(data.message || "Error");
        return Promise.reject(new Error(data.message || "Error"));
      }
    }
    return data;
  },
  (error) => {
    const msg = error.response?.data?.message || "Network Error";
    message.error(msg);
    return Promise.reject(error);
  },
);

export default request;
