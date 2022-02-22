import { MessageItem } from "../../utils/open_im_sdk/types"

export type MsgState = {
    historyMsgList:MessageItem[]
}

export const SET_HISTORY_MSGLIST = 'SET_HISTORY_MSGLIST'


type SetHistoryMsgList = {
    type: typeof SET_HISTORY_MSGLIST
    payload: MessageItem[]
}


export type MsgActionTypes = SetHistoryMsgList