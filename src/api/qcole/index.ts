import { qcoleRequest } from "../../utils";
import { UserMember } from "./interface";

export enum UsedFor {
  Register = 1,
  Modify = 2,
}

let platform = window.electron ? window.electron.platform : 5;

// 发送验证码
export const sms_code = (phoneNumber: string): Promise<unknown> => qcoleRequest.post("/api/sessions/sms_code.json", { session: { phone: phoneNumber } });

// 登录
export const signin = (phoneNumber: string, verifyCode: string): Promise<{ token: string }> =>
  qcoleRequest.post("/api/sessions/signin.json", { session: { phone: phoneNumber, code: verifyCode } });

// 获取成员列表
export const user_members = (): Promise<{ user_members: UserMember[] }> => qcoleRequest.get("/api/sessions/user_members.json");
