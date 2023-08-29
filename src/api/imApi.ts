import { v4 as uuidv4 } from "uuid";

import { API_URL } from "@/config";
import createAxiosInstance from "@/utils/request";
import { getIMUserID } from "@/utils/storage";

const request = createAxiosInstance(API_URL);

interface UserOnlineState {
  platformID: number;
  status: 0 | 1;
  userID: string;
}

export const getUserOnlineStatus = async (userIDs: string[]) =>
  request.post<{ statusList: UserOnlineState[] }>(
    "/user/get_users_status",
    {
      userID: await getIMUserID(),
      userIDs,
    },
    {
      headers: {
        operationID: uuidv4(),
      },
    },
  );
