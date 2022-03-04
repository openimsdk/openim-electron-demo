import { RequestFunc } from "../constants";

export type InitConfig = {
  userID: string;
  token: string;
  url: string;
  platformID: number;
  operationID?: string;
};

export type WsParams = {
  reqFuncName: RequestFunc;
  operationID: string;
  userID: string | undefined;
  data: any;
};

export type WsResponse = {
  event: RequestFunc;
  errCode: number;
  errMsg: string;
  data: any;
  operationID: string;
};

export type LoginParams = {
  userID: string;
  token: string;
};

export type AtMsgParams = {
  text: string;
  atUserIDList: string[];
};

export type ImageMsgParams = {
  sourcePicture: PicBaseInfo;
  bigPicture: PicBaseInfo;
  snapshotPicture: PicBaseInfo;
};

export type PicBaseInfo = {
  uuid: string;
  type: string;
  size: number;
  width: number;
  height: number;
  url: string;
};

export type SoundMsgParams = {
  uuid: string;
  soundPath: string;
  sourceUrl: string;
  dataSize: number;
  duration: number;
};

export type VideoMsgParams = {
  videoPath: string;
  duration: number;
  videoType: string;
  snapshotPath: string;
  videoUUID: string;
  videoUrl: string;
  videoSize: number;
  snapshotUUID: string;
  snapshotSize: number;
  snapshotUrl: string;
  snapshotWidth: number;
  snapshotHeight: number;
};

export type FileMsgParams = {
  filePath: string;
  fileName: string;
  uuid: string;
  sourceUrl: string;
  fileSize: number;
};

export type MergerMsgParams = {
  messageList: MessageItem[];
  title: string;
  summaryList: string[];
};

export type LocationMsgParams = {
  description: string;
  longitude: number;
  latitude: number;
};

export type CustomMsgParams = {
  data: string;
  extension: string;
  description: string;
};

export type QuoteMsgParams = {
  text: string;
  message: string;
};

export type SendMsgParams = {
  recvID: string;
  groupID: string;
  offlinePushInfo?: OfflinePush;
  message: string;
};

export type GetHistoryMsgParams = {
  userID: string;
  groupID: string;
  count: number;
  startClientMsgID: string;
};

export type InsertSingleMsgParams = {
  message: string;
  recvID: string;
  sendID: string;
};

export type InsertGroupMsgParams = {
  message: string;
  groupID: string;
  sendID: string;
};

export type TypingUpdateParams = {
  recvID: string;
  msgTip: string;
};

export type MarkC2CParams = {
  userID: string;
  msgIDList: string[];
};

export type SplitParams = {
  offset: number;
  count: number;
};

export type GetOneCveParams = {
  sourceID: string;
  sessionType: number;
};

export type SetDraftParams = {
  conversationID: string;
  draftText: string;
};

export type PinCveParams = {
  conversationID: string;
  isPinned: boolean;
};

export type isRecvParams = {
  conversationIDList: string[];
  opt: OptType;
};

export enum OptType {
  Nomal = 0,
  Mute = 1,
  WithoutNotify = 2,
}

export type SearchLocalParams = {
  sourceID: string;
  sessionType: number;
  keywordList: string[];
  keywordListMatchType?: number;
  senderUserIDList?: string[];
  messageTypeList?: number[];
  searchTimePosition?: number;
  searchTimePeriod?: number;
  pageIndex?: number;
  count?: number;
};

export type AddFriendParams = {
  toUserID: string;
  reqMsg: string;
};

export type AccessFriendParams = {
  toUserID: string;
  handleMsg: string;
};

export type RemarkFriendParams = {
  toUserID: string;
  remark: string;
};

export type InviteGroupParams = {
  groupID: string;
  reason: string;
  userIDList: string[];
};

export type GetGroupMemberParams = {
  groupID: string;
  filter: number;
  offset: number;
  count: number;
};

export type CreateGroupParams = {
  groupBaseInfo: GroupInitInfo;
  memberList: Member[];
};

export type GroupInitInfo = {
  groupType: number;
  groupName: string;
  introduction?: string;
  notification?: string;
  faceURL?: string;
  ex?: string;
};

export type Member = {
  userID: string;
  roleLevel: number;
};

export type GroupInfoParams = {
  groupID: string;
  groupInfo: GroupBaseInfo;
};

export type GroupBaseInfo = Partial<Omit<GroupInitInfo, "groupType">>;

export type JoinGroupParams = {
  groupID: string;
  reqMsg: string;
};

export type TransferGroupParams = {
  groupID: string;
  newOwnerUserID: string;
};

export type AccessGroupParams = {
  groupID: string;
  fromUserID: string;
  handleMsg: string;
};

export type Ws2Promise = {
  oid: string;
  mname: string;
  mrsve: (value: WsResponse | PromiseLike<WsResponse>) => void;
  mrjet: (reason?: any) => void;
  flag: boolean;
};

export type GroupApplicationItem = {
  createTime: number;
  creatorUserID: string;
  ex: string;
  gender: number;
  groupFaceURL: string;
  groupID: string;
  groupName: string;
  groupType: number;
  handleResult: number;
  handleUserID: string;
  handledMsg: string;
  handledTime: number;
  introduction: string;
  memberCount: number;
  nickname: string;
  notification: string;
  ownerUserID: string;
  reqMsg: string;
  reqTime: number;
  status: number;
  userFaceURL: string;
  userID: string;
};

export type FriendApplicationItem = {
  createTime: number;
  ex: string;
  fromFaceURL: string;
  fromGender: number;
  fromNickname: string;
  fromUserID: string;
  handleMsg: string;
  handleResult: number;
  handleTime: number;
  handlerUserID: string;
  reqMsg: string;
  toFaceURL: string;
  toGender: number;
  toNickname: string;
  toUserID: string;
};

export type TotalUserStruct = {
  blackInfo: BlackItem | null;
  friendInfo: FriendItem | null;
  publicInfo: PublicUserItem | null;
};

export type PublicUserItem = {
  gender: number;
  nickname: string;
  userID: string;
  faceURL: string;
};

export type FullUserItem = {
  birth: number;
  createTime: number;
  email: string;
  ex: string;
  faceURL: string;
  gender: number;
  nickname: string;
  phoneNumber: string;
  userID: string;
};

export type PartialUserItem = Partial<Omit<FullUserItem, "userID">> & { userID: string };

export type FriendItem = {
  addSource: number;
  birth: number;
  createTime: number;
  email: string;
  ex: string;
  faceURL: string;
  userID: string;
  gender: number;
  nickname: string;
  operatorUserID: string;
  ownerUserID: string;
  phoneNumber: string;
  remark: string;
};

export type FriendRelationItem = {
  result: number;
  userID: string;
};

export type BlackItem = {
  addSource: number;
  userID: string;
  createTime: number;
  ex: string;
  faceURL: string;
  gender: number;
  nickname: string;
  operatorUserID: string;
  ownerUserID: string;
};

export type GroupItem = {
  groupID: string;
  groupName: string;
  notification: string;
  introduction: string;
  faceURL: string;
  ownerUserID: string;
  createTime: number;
  memberCount: number;
  status: number;
  creatorUserID: string;
  groupType: number;
  ex: string;
};

export type GroupMemberItem = {
  groupID: string;
  userID: string;
  nickname: string;
  faceURL: string;
  roleLevel: number;
  joinTime: number;
  joinSource: number;
  operatorUserID: string;
  ex: string;
};

export type ConversationItem = {
  conversationID: string;
  conversationType: number;
  userID: string;
  groupID: string;
  showName: string;
  faceURL: string;
  recvMsgOpt: OptType;
  unreadCount: number;
  groupAtType: number;
  latestMsg: string;
  latestMsgSendTime: number;
  draftText: string;
  draftTextTime: number;
  isPinned: boolean;
  attachedInfo: string;
  ex: string;
};

export type MessageItem = {
  clientMsgID: string;
  serverMsgID: string;
  createTime: number;
  sendTime: number;
  sessionType: number;
  sendID: string;
  recvID: string;
  msgFrom: number;
  contentType: number;
  platformID: number;
  senderNickname: string;
  senderFaceUrl: string;
  groupID: string;
  content: string;
  seq: number;
  isRead: boolean;
  status: number;
  offlinePush: OfflinePush;
  attachedInfo: string;
  ex: string;
  pictureElem: PictureElem;
  soundElem: SoundElem;
  videoElem: VideoElem;
  fileElem: FileElem;
  mergeElem: MergeElem;
  atElem: AtElem;
  locationElem: LocationElem;
  customElem: CustomElem;
  quoteElem: QuoteElem;
  notificationElem: NotificationElem;
};

export type NotificationElem = {
  detail: string;
  defaultTips: string;
};

export type AtElem = {
  text: string;
  atUserList: string[];
  isAtSelf: boolean;
};

export type CustomElem = {
  data: string;
  description: string;
  extension: string;
};

export type FileElem = {
  filePath: string;
  uuid: string;
  sourceUrl: string;
  fileName: string;
  fileSize: number;
};

export type LocationElem = {
  description: string;
  longitude: number;
  latitude: number;
};

export type MergeElem = {
  title: string;
  abstractList: string[];
  multiMessage: MessageItem[];
};

export type OfflinePush = {
  title: string;
  desc: string;
  ex: string;
  iOSPushSound: string;
  iOSBadgeCount: boolean;
};

export type PictureElem = {
  sourcePath: string;
  sourcePicture: Picture;
  bigPicture: Picture;
  snapshotPicture: Picture;
};

export type Picture = {
  uuid: string;
  type: string;
  size: number;
  width: number;
  height: number;
  url: string;
};

export type QuoteElem = {
  text: string;
  quoteMessage: MessageItem;
};

export type SoundElem = {
  uuid: string;
  soundPath: string;
  sourceUrl: string;
  dataSize: number;
  duration: number;
};

export type VideoElem = {
  videoPath: string;
  videoUUID: string;
  videoUrl: string;
  videoType: string;
  videoSize: number;
  duration: number;
  snapshotPath: string;
  snapshotUUID: string;
  snapshotSize: number;
  snapshotUrl: string;
  snapshotWidth: number;
  snapshotHeight: number;
};
