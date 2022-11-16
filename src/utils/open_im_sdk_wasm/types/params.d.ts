import {
  MessageEntity,
  OfflinePush,
  PicBaseInfo,
  AtUsersInfoItem,
  GroupInitInfo,
  Member,
  RtcInvite,
  FullUserItem,
} from './entity';
import {
  OptType,
  AllowType,
  GroupType,
  GroupJoinSource,
  GroupRole,
  GroupVerificationType,
} from './enum';

type LoginParam = {
  userID: string;
  token: string;
  platformID: number;
  apiAddress: string;
  wsAddress: string;
  logLevel?: number;
};

type GetOneConversationParams = {
  sourceID: string;
  sessionType: number;
};

type GetAdvancedHistoryMsgParams = {
  userID: string;
  groupID: string;
  lastMinSeq: number;
  count: number;
  startClientMsgID: string;
  conversationID?: string;
};

type GetHistoryMsgParams = {
  userID: string;
  groupID: string;
  count: number;
  startClientMsgID: string;
  conversationID?: string;
};

type MarkC2CParams = {
  userID: string;
  msgIDList: string[];
};

type MarkNotiParams = {
  conversationID: string;
  msgIDList: string[];
};

type GetGroupMemberParams = {
  groupID: string;
  filter: number;
  offset: number;
  count: number;
};

type SendMsgParams = {
  recvID: string;
  groupID: string;
  offlinePushInfo?: OfflinePush;
  message: string;
  fileArrayBuffer?: ArrayBuffer;
  snpFileArrayBuffer?: ArrayBuffer;
};

type ImageMsgParams = {
  sourcePicture: PicBaseInfo;
  bigPicture: PicBaseInfo;
  snapshotPicture: PicBaseInfo;
};

type VideoMsgParams = {
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

type VideoMsgFullParams = {
  videoFullPath: string;
  videoType: string;
  duration: number;
  snapshotFullPath: string;
};

type CustomMsgParams = {
  data: string;
  extension: string;
  description: string;
};

type QuoteMsgParams = {
  text: string;
  message: string;
};

type AdvancedQuoteMsgParams = {
  text: string;
  message: string;
  messageEntityList?: MessageEntity[];
};

type AdvancedMsgParams = {
  text: string;
  messageEntityList?: MessageEntity[];
};

type SetPrvParams = {
  conversationID: string;
  isPrivate: boolean;
};

type SplitConversationParams = {
  offset: number;
  count: number;
};

type SetDraftParams = {
  conversationID: string;
  draftText: string;
};

type PinCveParams = {
  conversationID: string;
  isPinned: boolean;
};

type IsRecvParams = {
  conversationIDList: string[];
  opt: OptType;
};

type UpdateMemberNameParams = {
  groupID: string;
  userID: string;
  GroupMemberNickname: string;
};

type GroupBaseInfo = Partial<Omit<GroupInitInfo, 'groupType'>>;

type JoinGroupParams = {
  groupID: string;
  reqMsg: string;
  joinSource: GroupJoinSource;
};

type SearchGroupParams = {
  keywordList: string[];
  isSearchGroupID: boolean;
  isSearchGroupName: boolean;
};

type ChangeGroupMuteParams = {
  groupID: string;
  isMute: boolean;
};

type ChangeGroupMemberMuteParams = {
  groupID: string;
  userID: string;
  mutedSeconds: number;
};

type TransferGroupParams = {
  groupID: string;
  newOwnerUserID: string;
};

type AccessGroupParams = {
  groupID: string;
  fromUserID: string;
  handleMsg: string;
};

type SetGroupRoleParams = {
  groupID: string;
  userID: string;
  roleLevel: GroupRole;
};

type SetGroupVerificationParams = {
  verification: GroupVerificationType;
  groupID: string;
};

type RtcActionParams = {
  opUserID: string;
  invitation: RtcInvite;
};

type setPrvParams = {
  conversationID: string;
  isPrivate: boolean;
};

type LoginParams = {
  userID: string;
  token: string;
};
type AtMsgParams = {
  text: string;
  atUserIDList: string[];
  atUsersInfo?: AtUsersInfoItem[];
  message?: string;
};

type SoundMsgParams = {
  uuid: string;
  soundPath: string;
  sourceUrl: string;
  dataSize: number;
  duration: number;
};

type FileMsgParams = {
  filePath: string;
  fileName: string;
  uuid: string;
  sourceUrl: string;
  fileSize: number;
};

type FileMsgFullParams = {
  fileFullPath: string;
  fileName: string;
};

type SouondMsgFullParams = {
  soundPath: string;
  duration: number;
};

type MergerMsgParams = {
  messageList: MessageItem[];
  title: string;
  summaryList: string[];
};

type FaceMessageParams = {
  index: number;
  data: string;
};

type LocationMsgParams = {
  description: string;
  longitude: number;
  latitude: number;
};

type GroupMsgReadParams = {
  groupID: string;
  msgIDList: string[];
};
type InsertSingleMsgParams = {
  message: string;
  recvID: string;
  sendID: string;
};

type InsertGroupMsgParams = {
  message: string;
  groupID: string;
  sendID: string;
};

type TypingUpdateParams = {
  recvID: string;
  msgTip: string;
};

type SplitParams = {
  offset: number;
  count: number;
};
type GetOneCveParams = {
  sourceID: string;
  sessionType: number;
};
type isRecvParams = {
  conversationIDList: string[];
  opt: OptType;
};
type SearchLocalParams = {
  conversationID: string;
  keywordList: string[];
  keywordListMatchType?: number;
  senderUserIDList?: string[];
  messageTypeList?: MessageType[];
  searchTimePosition?: number;
  searchTimePeriod?: number;
  pageIndex?: number;
  count?: number;
};
type AddFriendParams = {
  toUserID: string;
  reqMsg: string;
};
type SearchFriendParams = {
  keywordList: string[];
  isSearchUserID: boolean;
  isSearchNickname: boolean;
  isSearchRemark: boolean;
};
type RemarkFriendParams = {
  toUserID: string;
  remark: string;
};
type AccessFriendParams = {
  toUserID: string;
  handleMsg: string;
};
type InviteGroupParams = {
  groupID: string;
  reason: string;
  userIDList: string[];
};
type GetGroupMemberByTimeParams = {
  groupID: string;
  filterUserIDList: string[];
  offset: number;
  count: number;
  joinTimeBegin: number;
  joinTimeEnd: number;
};
type SearchGroupMemberParams = {
  groupID: string;
  keywordList: string[];
  isSearchUserID: boolean;
  isSearchMemberNickname: boolean;
  offset: number;
  count: number;
};
type SetMemberAuthParams = {
  rule: AllowType;
  groupID: string;
};
type CreateGroupParams = {
  groupBaseInfo: GroupInitInfo;
  memberList: Member[];
};
type GroupInfoParams = {
  groupID: string;
  groupInfo: GroupBaseInfo;
};
type MemberNameParams = {
  groupID: string;
  userID: string;
  GroupMemberNickname: string;
};

type GetSubDepParams = {
  departmentID: string;
  offset: number;
  count: number;
};
type SearchInOrzParams = {
  input: SearchInputType;
  offset: number;
  count: number;
};
type FindMessageParams = {
  conversationID: string;
  clientMsgIDList: string[];
};
type PartialUserItem = Partial<Omit<FullUserItem, 'userID'>> & {
  userID: string;
};
