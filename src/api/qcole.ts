import { qcoleRequest } from "../utils";

export enum UsedFor {
  Register = 1,
  Modify = 2,
}

let platform = window.electron ? window.electron.platform : 5;

export const sms_code = (phoneNumber: string): Promise<unknown> => qcoleRequest.post("/api/sessions/sms_code.json", { session: { phone: phoneNumber } });
