import { useMutation, useQuery } from "react-query";
import { v4 as uuidv4 } from "uuid";

import { USER_URL } from "@/config";
import { useUserStore } from "@/store";
import { AppConfig } from "@/store/type";
import { MessageReceiveOptType } from "@/utils/open-im-sdk-wasm/types/enum";
import createAxiosInstance from "@/utils/request";
import { getChatToken } from "@/utils/storage";

import { errorHandle } from "./errorHandle";

const request = createAxiosInstance(USER_URL);

const platform = window.electronAPI?.getPlatform() ?? 5;

const getAreaCode = (code: string) => (code.includes("+") ? code : `+${code}`);

export const useSendSms = () => {
  return useMutation(
    (params: API.Login.SendSmsParams) =>
      request.post(
        "/account/code/send",
        {
          ...params,
        },
        {
          headers: {
            operationID: uuidv4(),
          },
        },
      ),
    {
      onError: errorHandle,
    },
  );
};

export const useVerifyCode = () => {
  return useMutation(
    (params: API.Login.VerifyCodeParams) =>
      request.post(
        "/account/code/verify",
        {
          ...params,
          areaCode: getAreaCode(params.areaCode),
        },
        {
          headers: {
            operationID: uuidv4(),
          },
        },
      ),
    {
      onError: errorHandle,
    },
  );
};

// 注册
export const useRegister = () => {
  return useMutation(
    (params: API.Login.DemoRegisterType) =>
      request.post(
        "/account/register",
        {
          ...params,
          user: {
            ...params.user,
            areaCode: getAreaCode(params.user.areaCode),
          },
          platform,
        },
        {
          headers: {
            operationID: uuidv4(),
          },
        },
      ),
    {
      onError: errorHandle,
    },
  );
};

export const useReset = () => {
  return useMutation(
    (params: API.Login.ResetParams) =>
      request.post(
        "/account/password/reset",
        {
          ...params,
          areaCode: getAreaCode(params.areaCode),
        },
        {
          headers: {
            operationID: uuidv4(),
          },
        },
      ),
    {
      onError: errorHandle,
    },
  );
};

export const useModifyPassword = () => {
  return useMutation(
    (params: API.Login.ModifyParams) =>
      request.post(
        "/account/password/change",
        {
          ...params,
        },
        {
          headers: {
            operationID: uuidv4(),
          },
        },
      ),
    {
      onError: errorHandle,
    },
  );
};

export const useLogin = () => {
  return useMutation(
    (params: API.Login.LoginParams) =>
      request.post<{ chatToken: string; imToken: string; userID: string }>(
        "/account/login",
        {
          ...params,
          platform,
          areaCode: getAreaCode(params.areaCode),
        },
        {
          headers: {
            operationID: uuidv4(),
          },
        },
      ),
    {
      onError: errorHandle,
    },
  );
};

export interface BusinessUserInfo {
  userID: string;
  password: string;
  account: string;
  phoneNumber: string;
  areaCode: string;
  email: string;
  nickname: string;
  faceURL: string;
  gender: number;
  level: number;
  birth: number;
  allowAddFriend: BusinessAllowType;
  allowBeep: BusinessAllowType;
  allowVibration: BusinessAllowType;
  globalRecvMsgOpt: MessageReceiveOptType;
}

export enum BusinessAllowType {
  Allow = 1,
  NotAllow = 2,
}

export const getBusinessUserInfo = async (userIDs: string[], isSelfInfo = false) => {
  const userID = isSelfInfo ? userIDs[0] : useUserStore.getState().selfInfo.userID;
  const token = (await getChatToken(userID)) as string;
  return request.post<{ users: BusinessUserInfo[] }>(
    "/user/find/full",
    {
      userIDs,
    },
    {
      headers: {
        operationID: uuidv4(),
        token,
      },
    },
  );
};

export const searchBusinessUserInfo = async (keyword: string) => {
  const userID = useUserStore.getState().selfInfo.userID;
  const token = (await getChatToken(userID)) as string;
  return request.post<{ total: number; users: BusinessUserInfo[] }>(
    "/user/search/full",
    {
      keyword,
      pagination: {
        pageNumber: 1,
        showNumber: 10,
      },
    },
    {
      headers: {
        operationID: uuidv4(),
        token,
      },
    },
  );
};

interface UpdateBusinessUserInfoParams {
  email: string;
  nickname: string;
  faceURL: string;
  gender: number;
  birth: number;
  allowAddFriend: number;
  allowBeep: number;
  allowVibration: number;
  globalRecvMsgOpt: number;
}

export const updateBusinessUserInfo = async (
  params: Partial<UpdateBusinessUserInfoParams> & { userID: string },
) => {
  const token = (await getChatToken(params.userID)) as string;
  return request.post<unknown>(
    "/user/update",
    {
      ...params,
    },
    {
      headers: {
        operationID: uuidv4(),
        token,
      },
    },
  );
};

export const getAppConfig = () =>
  request.post<{ config: AppConfig }>(
    "/client_config/get",
    {},
    {
      headers: {
        operationID: uuidv4(),
      },
    },
  );
