import { OnLineResType } from "../@types/open_im";
import { getIMApiUrl, getIMConfigUrl } from "../config";
import { request } from "../utils";
import { uuid } from "../utils/common";

export const getAuthToken = (uid?:string,secret?:string) =>
  request.post(
    "/auth/user_token",
    JSON.stringify({
      secret: secret??"tuoyun",
      platform: 8,
      userID: uid??"openIM123456",
      OperationID:uuid(uid??"uuid")
    }),
    {
      baseURL: getIMApiUrl(),
    }
  );

export const getOnline = async (userIDList: string[], opid?: string):Promise<OnLineResType> =>{
  return request.post(
      "/user/get_users_online_status",
      JSON.stringify({
        operationID: opid ?? uuid("uuid"),
        userIDList,
      }),
      {
        baseURL: getIMApiUrl(),
        headers:{
            token: localStorage.getItem(`improfile`)!
        }
      }
    );
}

export const getAppConfig = () =>
  request.post(
    "/admin/init/get_client_config",
    JSON.stringify({
      OperationID: uuid("uuid"),
    }),
    {
      baseURL: getIMConfigUrl(),
    }
  );
