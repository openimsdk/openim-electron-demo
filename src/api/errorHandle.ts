import { message } from "@/AntdGlobalComp";

interface ErrorData {
  errCode: number;
  errMsg?: string;
}

export const errorHandle = (err: unknown) => {
  const errData = err as ErrorData;
  if (errData.errMsg) {
    message.error(errCodeMap[errData.errCode] || errData.errMsg);
  }
};

const errCodeMap: Record<number, string> = {
  1101: "账号未注册",
  1102: "账号已注册",
};
