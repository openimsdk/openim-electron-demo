import { OnLineResType } from "../@types/open_im";
import { getAdminUrl } from "../config";
import { request } from "../utils";
import { uuid } from "../utils/open_im_sdk";

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
      baseURL: getAdminUrl(),
    }
  );

export const getOnline = async (userIDList: string[],token:string, opid?: string):Promise<OnLineResType> =>{
  return request.post(
      "/manager/get_users_online_status",
      JSON.stringify({
        operationID: opid ?? uuid("uuid"),
        userIDList,
      }),
      {
        baseURL: getAdminUrl(),
        headers:{
            token
        }
      }
    );
}
   
