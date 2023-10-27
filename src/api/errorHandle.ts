import { t } from "i18next";

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
  20001: t("errCode.passwordError"),
  20002: t("errCode.accountNotExist"),
  20003: t("errCode.phoneNumberRegistered"),
  20004: t("errCode.accountRegistered"),
  20005: t("errCode.operationTooFrequent"),
  20006: t("errCode.verificationCodeError"),
  20007: t("errCode.verificationCodeExpired"),
  20008: t("errCode.verificationCodeErrorLimitExceed"),
  20009: t("errCode.verificationCodeUsed"),
  20010: t("errCode.invitationCodeUsed"),
  20011: t("errCode.invitationCodeNotExist"),
  20012: t("errCode.operationRestriction"),
};
