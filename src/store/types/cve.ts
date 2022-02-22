import { ConversationItem } from "../../utils/open_im_sdk/types";

export type CveState = {
  cves: ConversationItem[];
  curCve: ConversationItem | null;
  cveInitLoading: boolean;
};

export const SET_CVE_LIST = "SET_CVE_LIST";
export const SET_CUR_CVE = "SET_CUR_CVE";
export const SET_CVE_INIT_LOADING = "SET_CVE_INIT_LOADING";

type SetCveList = {
  type: typeof SET_CVE_LIST;
  payload: ConversationItem[];
};

type SetCurCve = {
  type: typeof SET_CUR_CVE;
  payload: ConversationItem | null;
};

type SetCveInitLoading = {
  type: typeof SET_CVE_INIT_LOADING;
  payload: boolean;
};

export type CveActionTypes = SetCveList | SetCurCve | SetCveInitLoading;
