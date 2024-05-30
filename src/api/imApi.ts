import { v4 as uuidv4 } from "uuid";

import { getChatUrl } from "@/config";
import createAxiosInstance from "@/utils/request";
import { getChatToken } from "@/utils/storage";

const request = createAxiosInstance(getChatUrl());

export const getRtcConnectData = async (room: string, identity: string) => {
  const token = (await getChatToken()) as string;
  return request.post<{ serverUrl: string; token: string }>(
    "/user/rtc/get_token",
    {
      room,
      identity,
    },
    {
      headers: {
        token,
        operationID: uuidv4(),
      },
    },
  );
};
