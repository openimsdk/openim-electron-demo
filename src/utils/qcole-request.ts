import { message } from "antd";
import axios, { AxiosError } from "axios";
import { AXIOSTIMEOUT, getQcoleUrl } from "../config";

const request = axios.create({
  timeout: AXIOSTIMEOUT,
  baseURL: getQcoleUrl(),
});

function handleError(error: AxiosError) {
  return Promise.reject(error);
}

request.interceptors.request.use(
  (config) => {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

request.interceptors.response.use((response) => {
  return response.data;
}, handleError);

export default request;
