import { ApplicationHandleResult } from "@openim/wasm-client-sdk";
import {
  BlackUserItem,
  FriendApplicationItem,
  FriendUserItem,
  GroupApplicationItem,
  GroupItem,
} from "@openim/wasm-client-sdk/lib/types/entity";
import { t } from "i18next";
import { create } from "zustand";

import { IMSDK } from "@/layout/MainContentWrap";
import { feedbackToast } from "@/utils/common";

import { ContactStore } from "./type";

export const useContactStore = create<ContactStore>()((set, get) => ({
  friendList: [],
  blackList: [],
  groupList: [],
  recvFriendApplicationList: [],
  sendFriendApplicationList: [],
  recvGroupApplicationList: [],
  sendGroupApplicationList: [],
  unHandleFriendApplicationCount: 0,
  unHandleGroupApplicationCount: 0,
  getFriendListByReq: async () => {
    try {
      let offset = 0;
      let tmpList = [] as FriendUserItem[];
      let initialFetch = true;
      // eslint-disable-next-line
      while (true) {
        const count = initialFetch ? 10000 : 1000;
        const { data } = await IMSDK.getFriendListPage({ offset, count });
        tmpList = [...tmpList, ...data];
        offset += count;
        if (data.length < count) break;
        initialFetch = false;
      }
      // const { data } = await IMSDK.getFriendList();
      set(() => ({
        friendList: [...tmpList],
      }));
    } catch (error) {
      feedbackToast({ error, msg: t("toast.getFriendListFailed") });
    }
  },
  setFriendList: (list: FriendUserItem[]) => {
    set(() => ({ friendList: list }));
  },
  updateFriend: (friend: FriendUserItem, remove?: boolean) => {
    const tmpList = [...get().friendList];
    const idx = tmpList.findIndex((f) => f.userID === friend.userID);
    if (idx < 0) {
      return;
    }
    if (remove) {
      tmpList.splice(idx, 1);
    } else {
      tmpList[idx] = { ...friend };
    }
    set(() => ({ friendList: tmpList }));
  },
  pushNewFriend: (friend: FriendUserItem) => {
    set((state) => ({ friendList: [...state.friendList, friend] }));
  },
  getBlackListByReq: async () => {
    try {
      const { data } = await IMSDK.getBlackList();
      set(() => ({ blackList: data }));
    } catch (error) {
      feedbackToast({ error, msg: t("toast.getBlackListFailed") });
    }
  },
  updateBlack: (black: BlackUserItem, remove?: boolean) => {
    const tmpList = [...get().blackList];
    const idx = tmpList.findIndex((b) => b.userID === black.userID);
    if (idx < 0) {
      return;
    }
    if (remove) {
      tmpList.splice(idx, 1);
    } else {
      tmpList[idx] = { ...black };
    }
    set(() => ({ blackList: tmpList }));
  },
  pushNewBlack: (black: BlackUserItem) => {
    set((state) => ({ blackList: [...state.blackList, black] }));
  },
  getGroupListByReq: async () => {
    try {
      let offset = 0;
      let tmpList = [] as GroupItem[];
      // eslint-disable-next-line
      while (true) {
        const { data } = await IMSDK.getJoinedGroupListPage({ offset, count: 1000 });
        tmpList = [...tmpList, ...data];
        offset += 1000;
        if (data.length < 1000) break;
      }

      // const { data } = await IMSDK.getJoinedGroupList();
      set(() => ({ groupList: tmpList }));
    } catch (error) {
      feedbackToast({ error, msg: t("toast.getGroupListFailed") });
    }
  },
  setGroupList: (list: GroupItem[]) => {
    set(() => ({ groupList: list }));
  },
  updateGroup: (group: GroupItem, remove?: boolean) => {
    const tmpList = [...get().groupList];
    const idx = tmpList.findIndex((g) => g.groupID === group.groupID);
    if (idx < 0) {
      return;
    }
    if (remove) {
      tmpList.splice(idx, 1);
    } else {
      tmpList[idx] = { ...group };
    }
    set(() => ({ groupList: tmpList }));
  },
  pushNewGroup: (group: GroupItem) => {
    set((state) => ({ groupList: [...state.groupList, group] }));
  },
  getRecvFriendApplicationListByReq: async () => {
    try {
      const { data } = await IMSDK.getFriendApplicationListAsRecipient();
      const unHandleFriendApplicationCount = data.filter(
        (application) => application.handleResult === 0,
      ).length;
      set(() => ({ recvFriendApplicationList: data, unHandleFriendApplicationCount }));
    } catch (error) {
      console.error(error);
    }
  },
  updateRecvFriendApplication: (application: FriendApplicationItem) => {
    let tmpList = [...get().recvFriendApplicationList];
    let isHandleResultUpdate = false;
    const idx = tmpList.findIndex((a) => a.fromUserID === application.fromUserID);
    if (idx < 0) {
      tmpList = [...tmpList, application];
    } else {
      isHandleResultUpdate = true;
      tmpList[idx] = { ...application };
    }
    if (idx < 0 || isHandleResultUpdate) {
      const unHandleFriendApplicationCount = tmpList.filter(
        (application) => application.handleResult === 0,
      ).length;
      set(() => ({
        recvFriendApplicationList: tmpList,
        unHandleFriendApplicationCount,
      }));
      return;
    }
    set(() => ({ recvFriendApplicationList: tmpList }));
  },
  getSendFriendApplicationListByReq: async () => {
    try {
      const { data } = await IMSDK.getFriendApplicationListAsApplicant();
      set(() => ({ sendFriendApplicationList: data }));
    } catch (error) {
      console.error(error);
    }
  },
  updateSendFriendApplication: (application: FriendApplicationItem) => {
    let tmpList = [...get().sendFriendApplicationList];
    const idx = tmpList.findIndex((a) => a.toUserID === application.toUserID);
    if (idx < 0) {
      tmpList = [...tmpList, application];
    } else {
      tmpList[idx] = { ...application };
    }
    set(() => ({ sendFriendApplicationList: tmpList }));
  },
  getRecvGroupApplicationListByReq: async () => {
    try {
      const { data } = await IMSDK.getGroupApplicationListAsRecipient();
      const unHandleGroupApplicationCount = data.filter(
        (application) => application.handleResult === 0,
      ).length;
      set(() => ({ recvGroupApplicationList: data, unHandleGroupApplicationCount }));
    } catch (error) {
      console.error(error);
    }
  },
  updateRecvGroupApplication: (application: GroupApplicationItem) => {
    let tmpList = [...get().recvGroupApplicationList];
    let isHandleResultUpdate = false;
    const idx = tmpList.findIndex((a) => a.userID === application.userID);
    if (idx < 0) {
      tmpList = [...tmpList, application];
    } else {
      isHandleResultUpdate = true;
      tmpList[idx] = { ...application };
    }
    if (idx < 0 || application.handleResult === ApplicationHandleResult.Unprocessed) {
      const unHandleGroupApplicationCount = tmpList.filter(
        (application) => application.handleResult === 0,
      ).length;
      set(() => ({ recvGroupApplicationList: tmpList, unHandleGroupApplicationCount }));
      return;
    }
    set(() => ({ recvGroupApplicationList: tmpList }));
  },
  getSendGroupApplicationListByReq: async () => {
    try {
      const { data } = await IMSDK.getGroupApplicationListAsApplicant();
      set(() => ({ sendGroupApplicationList: data }));
    } catch (error) {
      console.error(error);
    }
  },
  updateSendGroupApplication: (application: GroupApplicationItem) => {
    let tmpList = [...get().sendGroupApplicationList];
    const idx = tmpList.findIndex((a) => a.groupID === application.groupID);
    if (idx < 0) {
      tmpList = [...tmpList, application];
    } else {
      tmpList[idx] = { ...application };
    }
    set(() => ({ sendGroupApplicationList: tmpList }));
  },
  updateUnHandleFriendApplicationCount: (num: number) => {
    set(() => ({ unHandleFriendApplicationCount: num }));
  },
  updateUnHandleGroupApplicationCount: (num: number) => {
    set(() => ({ unHandleGroupApplicationCount: num }));
  },
  clearContactStore: () => {
    set(() => ({
      friendList: [],
      blackList: [],
      groupList: [],
      recvFriendApplicationList: [],
      sendFriendApplicationList: [],
      recvGroupApplicationList: [],
      sendGroupApplicationList: [],
      unHandleFriendApplicationCount: 0,
      unHandleGroupApplicationCount: 0,
    }));
  },
}));
