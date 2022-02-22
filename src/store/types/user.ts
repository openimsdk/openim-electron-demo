import { FullUserItem } from "../../utils/open_im_sdk/types"

export type UserState = {
    selfInfo:FullUserItem
    adminToken:string
    selfInitLoading:boolean
}

export const SET_SELF_INFO = 'SET_SELF_INFO'
export const SET_ADMIN_TOKEN = 'SET_ADMIN_TOKEN'
export const SET_SELF_INIT_LOADING = 'SET_SELF_INIT_LOADING'

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


export type UserActionTypes = SetSelfInfo | SetSelfToken | SetSelfInitLoading