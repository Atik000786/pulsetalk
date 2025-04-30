import { toast } from "react-hot-toast";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

interface AxiosClientArgs extends AxiosRequestConfig {
  toolkit: {
    fulfillWithValue: (value: any) => any;
    rejectWithValue: (value: any) => any;
  };
  headers?: Record<string, string>;
}
interface ErrorResponse {
  message: string;
}

const isErrorResponse = (error: any): error is ErrorResponse => {
  return error && typeof error.message === "string";
};

const AxiosClient = async (args: AxiosClientArgs) => {
  const { toolkit, headers = {} ,...rest } = args;

  
  const { url } = rest;
  const token = localStorage?.getItem("token") || "";

  return axios({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL }`,
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token && token !== "null" && token !== "undefined"
        ? { Authorization: "Bearer " + token }
        : {}),
      ...headers,
    },
  })
    .then((response: AxiosResponse) => toolkit.fulfillWithValue(response.data))
    .catch((error: AxiosError) => {
      if (error.response?.data && isErrorResponse(error.response.data)) {
        return toolkit.rejectWithValue(error.response.data);
      }
      return toolkit.rejectWithValue("An unknown error occurred");
    });
};

axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const errorMessage = isErrorResponse(error.response?.data)
      ? error.response.data.message
      : "Something went wrong";

    toast.error(errorMessage, {
      position: "top-right",
    });

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }

    return Promise.reject(error.response?.data ?? "Something went wrong");
  }
);

export default AxiosClient;
