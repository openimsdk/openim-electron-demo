import { v4 as uuidv4 } from "uuid";

import { API_URL } from "@/config";
import createAxiosInstance from "@/utils/request";

const request = createAxiosInstance(API_URL);

interface UserOnlineState {
  detailPlatformStatus: null;
  status: "offline" | "online";
  userID: string;
}

export const getUserOnlineStatus = (userIDs: string[]) =>
  request.post<UserOnlineState[]>(
    "/user/get_users_online_status",
    {
      userIDs,
    },
    {
      headers: {
        operationID: uuidv4(),
      },
    },
  );
