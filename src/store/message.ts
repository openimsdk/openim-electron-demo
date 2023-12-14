import { t } from "i18next";
import { create } from "zustand";

import { IMSDK } from "@/layout/MainContentWrap";
import { feedbackToast } from "@/utils/common";
import { MessageItem } from "@/utils/open-im-sdk-wasm/types/entity";
import { MessageType } from "@/utils/open-im-sdk-wasm/types/enum";

import { useConversationStore } from "./conversation";
import { MessageStore, PreViewImg } from "./type";

const GET_HISTORY_MESSAGE_COUNT = 20;

export interface ExType {
  checked?: boolean;
  errCode?: number;
}

export type ExMessageItem = MessageItem & ExType;

interface IAdvancedMessageResponse {
  lastMinSeq: number;
  isEnd: boolean;
  messageList: ExMessageItem[];
}

export const useMessageStore = create<MessageStore>()((set, get) => ({
  historyMessageList: [],
  previewImgList: [],
  lastMinSeq: 0,
  hasMore: true,
  isCheckMode: false,
  getHistoryMessageListByReq: async (loadMore = false) => {
    const conversationID =
      useConversationStore.getState().currentConversation?.conversationID;
    if (!conversationID) return;
    try {
      const prevList = [...get().historyMessageList];
      const { data } = await IMSDK.getAdvancedHistoryMessageList({
        userID: "",
        groupID: "",
        count: GET_HISTORY_MESSAGE_COUNT,
        lastMinSeq: loadMore ? get().lastMinSeq : 0,
        startClientMsgID: loadMore ? prevList[0]?.clientMsgID : "",
        conversationID,
      });
      const nextList = [...data.messageList, ...(loadMore ? prevList : [])];

      const imageUrls = filterPreviewImage(data.messageList);
      if (imageUrls.length > 0 || !loadMore) {
        set((state) => ({
          previewImgList: [...imageUrls, ...(loadMore ? state.previewImgList : [])],
        }));
      }

      set(() => ({
        lastMinSeq: data.lastMinSeq,
        hasMore: !data.isEnd && data.messageList.length === GET_HISTORY_MESSAGE_COUNT,
        historyMessageList: nextList,
      }));
      console.log(get().historyMessageList);
      return data.messageList.length;
    } catch (error) {
      feedbackToast({ error, msg: t("toast.getHistoryMessageFailed") });
      return 0;
    }
  },
  pushNewMessage: (message: ExMessageItem) => {
    get().tryUpdatePreviewImg([message]);
    set((state) => ({
      historyMessageList: [...state.historyMessageList, message],
    }));
  },
  updateOneMessage: (message: ExMessageItem, fromSuccessCallBack = false) => {
    const tmpList = [...get().historyMessageList];
    const idx = tmpList.findIndex((msg) => msg.clientMsgID === message.clientMsgID);
    if (idx < 0) {
      return;
    }
    if (fromSuccessCallBack) {
      get().tryUpdatePreviewImg([message]);
    }
    tmpList[idx] = { ...tmpList[idx], ...message };
    set(() => ({ historyMessageList: tmpList }));
  },
  deleteOneMessage: (clientMsgID: string) => {
    const tmpList = get().historyMessageList;
    const idx = tmpList.findIndex((msg) => msg.clientMsgID === clientMsgID);
    if (idx < 0) {
      return;
    }
    tmpList.splice(idx, 1);
    set(() => ({ historyMessageList: [...tmpList] }));
  },
  clearHistoryMessage: () => {
    set(() => ({ historyMessageList: [], previewImgList: [] }));
  },
  updatePreviewImgList: (list: PreViewImg[]) => {
    set((state) => ({ previewImgList: [...state.previewImgList, ...list] }));
  },
  updateCheckMode: (isCheckMode: boolean) => {
    if (!isCheckMode) {
      const tmpList = [...get().historyMessageList].map((message) => {
        message.checked = false;
        return message;
      });
      set(() => ({ historyMessageList: tmpList }));
    }
    set(() => ({ isCheckMode }));
  },
  tryUpdatePreviewImg: (mesageList: ExMessageItem[]) => {
    const imageUrls = filterPreviewImage(mesageList);
    if (imageUrls.length === 0) return;
    set((state) => ({
      previewImgList: [...state.previewImgList, ...imageUrls],
    }));
  },
}));

function filterPreviewImage(messages: MessageItem[]) {
  return messages
    .filter((message) => {
      if (message.contentType === MessageType.PictureMessage) {
        return true;
      }
      if (message.contentType === MessageType.OANotification) {
        let notificationData = {} as any;
        try {
          notificationData = JSON.parse(message.notificationElem.detail);
        } catch (error) {
          console.error(error);
        }
        if (notificationData.mixType === 1) {
          message.pictureElem.snapshotPicture.url =
            notificationData.pictureElem.sourcePicture.url;
          return true;
        }
        return false;
      }
      return false;
    })
    .map((item) => ({
      url: item.pictureElem.sourcePicture.url,
      clientMsgID: item.clientMsgID,
    }));
}
