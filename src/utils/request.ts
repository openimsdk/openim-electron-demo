import axios from "axios";
import { getIMToken } from "./storage";

const createAxiosInstance = (baseURL: string) => {
  const serves = axios.create({
    baseURL,
    timeout: 5000,
  });

  serves.interceptors.request.use(
    async (config) => {
      config.headers.token = config.headers.token ?? (await getIMToken());
      return config;
    },
    (err) => Promise.reject(err),
  );

  serves.interceptors.response.use(
    (res) => {
      if (res.data.errCode !== 0) {
        return Promise.reject(res.data);
      }
      return res.data;
    },
    (err) => {
      if (err.message.includes("timeout")) {
        console.log("error", err);
      }
      if (err.message.includes("Network Error")) {
        console.log("error", err);
      }
      return Promise.reject(err);
    },
  );

  return serves;
};

export default createAxiosInstance;
