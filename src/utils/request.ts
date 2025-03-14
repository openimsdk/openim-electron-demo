import axios from "axios";
import { t } from "i18next";
import { v4 as uuidv4 } from "uuid";

import { useUserStore } from "@/store";

import { getChatToken, getIMToken } from "./storage";
import { feedbackToast } from "./common";

const tokenErrorCodeList = [1501, 1503, 1504, 1505];

const createAxiosInstance = (baseURL: string, imToken = true) => {
  const serves = axios.create({
    baseURL,
    timeout: 25000,
  });

  serves.interceptors.request.use(
    async (config) => {
      const token = imToken ? await getIMToken() : await getChatToken();
      config.headers.token = config.headers.token ?? token;
      config.headers.operationID = uuidv4();
      return config;
    },
    (err) => Promise.reject(err),
  );

  serves.interceptors.response.use(
    (res) => {
      if (tokenErrorCodeList.includes(res.data.errCode)) {
        feedbackToast({
          msg: t("toast.loginExpiration"),
          error: t("toast.loginExpiration"),
          onClose: () => {
            useUserStore.getState().userLogout(true);
          },
        });
      }
      if (res.data.errCode !== 0) {
        return Promise.reject(res.data);
      }
      return res.data;
    },
    (err) => {
      if (err.message.includes("timeout")) {
        console.error("error", err);
      }
      if (err.message.includes("Network Error")) {
        console.error("error", err);
      }
      return Promise.reject(err);
    },
  );

  return serves;
};

export default createAxiosInstance;
