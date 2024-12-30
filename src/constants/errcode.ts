import { t } from "i18next";

export const ErrCodeMap: Record<number, string> = {
  20001: t("errCode.passwordError"),
  20002: t("errCode.accountNotExist"),
  20003: t("errCode.phoneNumberRegistered"),
  20004: t("errCode.accountRegistered"),
  20005: t("errCode.operationTooFrequent"),
  20012: t("errCode.operationRestriction"),
  20014: t("errCode.accountRegistered"),
};

export enum SendFailedErrCode {
  Blacked = 1302,
}
