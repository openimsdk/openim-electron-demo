import { request } from "../utils";

export enum UsedFor {
  Register = 1,
  Modify = 2,
}

let platform = window.electron ? window.electron.platform : 5

export const sendSms = (phoneNumber: string, usedFor: UsedFor = 1): Promise<unknown> => request.post("/demo/code", JSON.stringify({ phoneNumber,usedFor, operationID: Date.now() + "" }));

export const verifyCode = (phoneNumber: string, verificationCode: string, usedFor: UsedFor = 1) =>
  request.post("/demo/verify", JSON.stringify({ phoneNumber, verificationCode, usedFor, operationID: Date.now() + "" }));

export const register = (phoneNumber: string, verificationCode: string, password: string) =>
  request.post("/demo/password", JSON.stringify({ phoneNumber, verificationCode, password, platform: 5, operationID: Date.now() + "" }));

export const modify = (phoneNumber: string, verificationCode: string, newPassword: string) =>
  request.post("/demo/reset_password", JSON.stringify({ phoneNumber, verificationCode, newPassword, platform: 5, operationID: Date.now() + "" }));

export const login = (phoneNumber: string, password: string) => {
  return request.post("/demo/login", JSON.stringify({ phoneNumber, password, platform, operationID: Date.now() + "" }));
};
