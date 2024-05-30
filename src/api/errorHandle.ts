import { message } from "@/AntdGlobalComp";
import { ErrCodeMap } from "@/constants";

interface ErrorData {
  errCode: number;
  errMsg?: string;
}

export const errorHandle = (err: unknown) => {
  const errData = err as ErrorData;
  if (errData.errMsg) {
    message.error(ErrCodeMap[errData.errCode] || errData.errMsg);
  }
};
