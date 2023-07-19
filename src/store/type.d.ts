import { BusinessUserInfo } from "@/api/login";
import {
  BlackUserItem,
  ConversationItem,
  FriendApplicationItem,
  FriendUserItem,
  GroupApplicationItem,
  GroupItem,
  GroupMemberItem,
  MessageItem,
  SelfUserInfo,
} from "@/utils/open-im-sdk-wasm/types/entity";

import { ExMessageItem } from "./message";

export interface UserStore {
  selfInfo: BusinessUserInfo;
  appConfig: AppConfig;
  appSettings: AppSettings;
  updateSelfInfo: (info: Partial<BusinessUserInfo>) => void;
  getSelfInfoByReq: () => Promise<void>;
  getAppConfigByReq: () => Promise<void>;
  updateAppSettings: (settings: Partial<AppSettings>) => void;
  userLogout: () => Promise<void>;
}

export interface AppConfig {
  discoverPageURL: string;
  ordinaryUserAddFriend: number;
  allowSendMsgNotFriend: number;
  needInvitationCodeRegister: number;
}

export interface AppSettings {
  locale: LocaleString;
  closeAction: "miniSize" | "quit";
}

export type LocaleString = "zh-CN" | "en";

export type ConversationListUpdateType = "push" | "filter";

export interface ConversationStore {
  conversationList: ConversationItem[];
  currentConversation?: ConversationItem;
  unReadCount: number;
  currentGroupInfo?: GroupItem;
  currentMemberInGroup?: GroupMemberItem;
  quoteMessage?: MessageItem;
  getConversationListByReq: (isOffset?: boolean) => Promise<boolean>;
  updateConversationList: (
    list: ConversationItem[],
    type: ConversationListUpdateType,
  ) => void;
  delConversationByCID: (conversationID: string) => void;
  // getCurrentConversationByReq: (conversationID?: string) => Promise<void>;
  updateCurrentConversation: (conversation?: ConversationItem) => void;
  getUnReadCountByReq: () => Promise<void>;
  updateUnReadCount: (count: number) => void;
  getCurrentGroupInfoByReq: (groupID: string) => Promise<void>;
  updateCurrentGroupInfo: (groupInfo: GroupItem) => void;
  getCurrentMemberInGroupByReq: (groupID: string) => Promise<void>;
  tryUpdateCurrentMemberInGroup: (member: GroupMemberItem) => void;
  updateQuoteMessage: (message?: MessageItem) => void;
  clearConversationStore: () => void;
}

export type PreViewImg = {
  url: string;
  clientMsgID: string;
};

export interface MessageStore {
  historyMessageList: ExMessageItem[];
  previewImgList: PreViewImg[];
  lastMinSeq: number;
  hasMore: boolean;
  isCheckMode: boolean;
  getHistoryMessageListByReq: (loadMore?: boolean) => Promise<unknown>;
  pushNewMessage: (message: ExMessageItem) => void;
  updateOneMessage: (message: ExMessageItem, fromSuccessCallBack?: boolean) => void;
  deleteOneMessage: (clientMsgID: string) => void;
  clearHistoryMessage: () => void;
  updatePreviewImgList: (list: PreViewImg[]) => void;
  updateCheckMode: (isCheckMode: boolean) => void;
  tryUpdatePreviewImg: (messageList: ExMessageItem[]) => void;
}

export interface ContactStore {
  friendList: FriendUserItem[];
  blackList: BlackUserItem[];
  groupList: GroupItem[];
  recvFriendApplicationList: FriendApplicationItem[];
  sendFriendApplicationList: FriendApplicationItem[];
  recvGroupApplicationList: GroupApplicationItem[];
  sendGroupApplicationList: GroupApplicationItem[];
  unHandleFriendApplicationCount: number;
  unHandleGroupApplicationCount: number;
  getFriendListByReq: () => Promise<void>;
  setFriendList: (list: FriendUserItem[]) => void;
  updateFriend: (friend: FriendUserItem, remove?: boolean) => void;
  pushNewFriend: (friend: FriendUserItem) => void;
  getBlackListByReq: () => Promise<void>;
  updateBlack: (black: BlackUserItem, remove?: boolean) => void;
  pushNewBlack: (black: BlackUserItem) => void;
  getGroupListByReq: () => Promise<void>;
  setGroupList: (list: GroupItem[]) => void;
  updateGroup: (group: GroupItem, remove?: boolean) => void;
  pushNewGroup: (group: GroupItem) => void;
  getRecvFriendApplicationListByReq: () => Promise<void>;
  updateRecvFriendApplication: (application: FriendApplicationItem) => void;
  getSendFriendApplicationListByReq: () => Promise<void>;
  updateSendFriendApplication: (application: FriendApplicationItem) => void;
  getRecvGroupApplicationListByReq: () => Promise<void>;
  updateRecvGroupApplication: (application: GroupApplicationItem) => void;
  getSendGroupApplicationListByReq: () => Promise<void>;
  updateSendGroupApplication: (application: GroupApplicationItem) => void;
  updateUnHandleFriendApplicationCount: (num: number) => void;
  updateUnHandleGroupApplicationCount: (num: number) => void;
  clearContactStore: () => void;
}
