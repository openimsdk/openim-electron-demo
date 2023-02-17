import { FullUserItem } from "../../utils/open_im_sdk_wasm/types/entity"


export type UserState = {
    selfInfo:FullUserItem
    adminToken:string
    selfInitLoading:boolean
    appConfig:AppGlobalConfig
}

export type AppGlobalConfig = {
    discoverPageURL: string;
    adminURL: string;
    allowSendMsgNotFriend: number;
    ordinaryUserAddFriend: number;
    needInvitationCodeRegister: number;
    bossUserID: string;
    robots: string[];
  }

export const SET_SELF_INFO = 'SET_SELF_INFO'
export const SET_ADMIN_TOKEN = 'SET_ADMIN_TOKEN'
export const SET_SELF_INIT_LOADING = 'SET_SELF_INIT_LOADING'
export const SET_APP_CONFIG = "SET_APP_CONFIG";

type SetSelfInfo = {
    type: typeof SET_SELF_INFO
    payload: FullUserItem
}

type SetSelfToken = {
    type: typeof SET_ADMIN_TOKEN
    payload: string
}

type SetSelfInitLoading = {
    type: typeof SET_SELF_INIT_LOADING
    payload: boolean
}

type SetAppConfig = {
    type: typeof SET_APP_CONFIG;
    payload: AppGlobalConfig;
  };


export type UserActionTypes = SetSelfInfo | SetSelfToken | SetSelfInitLoading | SetAppConfig