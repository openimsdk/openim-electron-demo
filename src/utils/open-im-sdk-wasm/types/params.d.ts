import { MessageEntity, OfflinePush, PicBaseInfo, AtUsersInfoItem, MessageItem, SelfUserInfo, RtcInvite, GroupItem } from './entity';
import { AllowType, GroupJoinSource, GroupVerificationType, MessageType, MessageReceiveOptType, GroupMemberRole, GroupMemberFilter, LogLevel, GroupMessageReaderFilter } from './enum';
export declare type InitAndLoginConfig = {
    userID: string;
    token: string;
    platformID: number;
    apiAddr: string;
    wsAddr: string;
    logLevel?: LogLevel;
    isLogStandardOutput?: boolean;
    isExternalExtensions?: boolean;
    tryParse?: boolean;
};
export declare type GetOneConversationParams = {
    sourceID: string;
    sessionType: number;
};
export declare type GetAdvancedHistoryMsgParams = {
    userID?: string;
    groupID?: string;
    lastMinSeq: number;
    count: number;
    startClientMsgID: string;
    conversationID: string;
};
export declare type GetHistoryMsgParams = {
    userID: string;
    groupID: string;
    count: number;
    startClientMsgID: string;
    conversationID?: string;
};
export declare type MarkNotiParams = {
    conversationID: string;
    clientMsgIDList: string[];
};
export declare type SendGroupReadReceiptParams = {
    conversationID: string;
    clientMsgIDList: string[];
};
export declare type GetGroupMessageReaderParams = {
    conversationID: string;
    clientMsgID: string;
    filter: GroupMessageReaderFilter;
    offset: number;
    count: number;
};
export declare type GetGroupMemberParams = {
    groupID: string;
    filter: GroupMemberFilter;
    offset: number;
    count: number;
};
export declare type SendMsgParams = {
    recvID: string;
    groupID: string;
    offlinePushInfo?: OfflinePush;
    message: MessageItem;
    fileArrayBuffer?: ArrayBuffer;
    snpFileArrayBuffer?: ArrayBuffer;
};
export declare type SetMessageLocalExParams = {
    conversationID: string;
    clientMsgID: string;
    localEx: string;
};
export declare type ImageMsgParams = {
    sourcePicture: PicBaseInfo;
    bigPicture: PicBaseInfo;
    snapshotPicture: PicBaseInfo;
    sourcePath: string;
};
export declare type VideoMsgParams = {
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
    snapShotType?: string;
};
export declare type VideoMsgFullParams = {
    videoFullPath: string;
    videoType: string;
    duration: number;
    snapshotFullPath: string;
};
export declare type CustomMsgParams = {
    data: string;
    extension: string;
    description: string;
};
export declare type QuoteMsgParams = {
    text: string;
    message: string;
};
export declare type AdvancedQuoteMsgParams = {
    text: string;
    message: MessageItem;
    messageEntityList?: MessageEntity[];
};
export declare type AdvancedMsgParams = {
    text: string;
    messageEntityList?: MessageEntity[];
};
export declare type SetPrvParams = {
    conversationID: string;
    isPrivate: boolean;
};
export declare type SplitConversationParams = {
    offset: number;
    count: number;
};
export declare type SetDraftParams = {
    conversationID: string;
    draftText: string;
};
export declare type PinCveParams = {
    conversationID: string;
    isPinned: boolean;
};
export declare type IsRecvParams = {
    conversationIDList: string[];
    opt: MessageReceiveOptType;
};
export declare type UpdateMemberNameParams = {
    groupID: string;
    userID: string;
    GroupMemberNickname: string;
};
export declare type JoinGroupParams = {
    groupID: string;
    reqMsg: string;
    joinSource: GroupJoinSource;
};
export declare type SearchGroupParams = {
    keywordList: string[];
    isSearchGroupID: boolean;
    isSearchGroupName: boolean;
};
export declare type ChangeGroupMuteParams = {
    groupID: string;
    isMute: boolean;
};
export declare type ChangeGroupMemberMuteParams = {
    groupID: string;
    userID: string;
    mutedSeconds: number;
};
export declare type TransferGroupParams = {
    groupID: string;
    newOwnerUserID: string;
};
export declare type AccessGroupParams = {
    groupID: string;
    fromUserID: string;
    handleMsg: string;
};
export declare type SetGroupRoleParams = {
    groupID: string;
    userID: string;
    roleLevel: GroupMemberRole;
};
export declare type SetGroupVerificationParams = {
    verification: GroupVerificationType;
    groupID: string;
};
export declare type SetBurnDurationParams = {
    conversationID: string;
    burnDuration: number;
};
export declare type GetUserInfoWithCacheParams = {
    userIDList: string[];
    groupID?: string;
};
export declare type AtMsgParams = {
    text: string;
    atUserIDList: string[];
    atUsersInfo?: AtUsersInfoItem[];
    message?: MessageItem;
};
export declare type SoundMsgParams = {
    uuid: string;
    soundPath: string;
    sourceUrl: string;
    dataSize: number;
    duration: number;
    soundType?: string;
};
export declare type FileMsgParams = {
    filePath: string;
    fileName: string;
    uuid: string;
    sourceUrl: string;
    fileSize: number;
    fileType?: string;
};
export declare type FileMsgFullParams = {
    fileFullPath: string;
    fileName: string;
};
export declare type SouondMsgFullParams = {
    soundPath: string;
    duration: number;
};
export declare type MergerMsgParams = {
    messageList: MessageItem[];
    title: string;
    summaryList: string[];
};
export declare type FaceMessageParams = {
    index: number;
    data: string;
};
export declare type LocationMsgParams = {
    description: string;
    longitude: number;
    latitude: number;
};
export declare type GroupMsgReadParams = {
    groupID: string;
    msgIDList: string[];
};
export declare type InsertSingleMsgParams = {
    message: MessageItem;
    recvID: string;
    sendID: string;
};
export declare type InsertGroupMsgParams = {
    message: MessageItem;
    groupID: string;
    sendID: string;
};
export declare type AccessMessageParams = {
    conversationID: string;
    clientMsgID: string;
};
export declare type TypingUpdateParams = {
    recvID: string;
    msgTip: string;
};
export declare type SplitParams = {
    offset: number;
    count: number;
};
export declare type GetOneCveParams = {
    sourceID: string;
    sessionType: number;
};
export declare type isRecvParams = {
    conversationID: string;
    opt: MessageReceiveOptType;
};
export declare type SearchLocalParams = {
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
export declare type AddFriendParams = {
    toUserID: string;
    reqMsg: string;
};
export declare type SearchFriendParams = {
    keywordList: string[];
    isSearchUserID: boolean;
    isSearchNickname: boolean;
    isSearchRemark: boolean;
};
export declare type RemarkFriendParams = {
    toUserID: string;
    remark: string;
};
export declare type AccessFriendParams = {
    toUserID: string;
    handleMsg: string;
};
export declare type InviteGroupParams = {
    groupID: string;
    reason: string;
    userIDList: string[];
};
export declare type GetGroupMemberByTimeParams = {
    groupID: string;
    filterUserIDList: string[];
    offset: number;
    count: number;
    joinTimeBegin: number;
    joinTimeEnd: number;
};
export declare type SearchGroupMemberParams = {
    groupID: string;
    keywordList: string[];
    isSearchUserID: boolean;
    isSearchMemberNickname: boolean;
    offset: number;
    count: number;
};
export declare type SetMemberAuthParams = {
    rule: AllowType;
    groupID: string;
};
export declare type CreateGroupParams = {
    memberUserIDs: string[];
    groupInfo: Partial<GroupItem>;
    adminUserIDs?: string[];
    ownerUserID?: string;
};
export declare type MemberNameParams = {
    groupID: string;
    userID: string;
    groupMemberNickname: string;
};
export declare type UpdateMemberInfoParams = {
    groupID: string;
    userID: string;
    nickname?: string;
    faceURL?: string;
    roleLevel?: GroupMemberRole;
    ex?: string;
};
export declare type FindMessageParams = {
    conversationID: string;
    clientMsgIDList: string[];
};
export declare type UploadFileParams = {
    name: string;
    contentType: string;
    uuid: string;
    file: File;
};
export declare type PartialUserItem = Partial<SelfUserInfo>;
export declare type SignalingInviteParams = {
    invitation: RtcInvite;
    offlinePushInfo?: OfflinePush;
};
export declare type RtcActionParams = {
    opUserID: string;
    invitation: RtcInvite;
};
export declare type CustomSignalParams = {
    roomID: string;
    customInfo: string;
};
export declare type CreateMeetingParams = {
    meetingName: string;
    meetingHostUserID: string;
    startTime: number;
    meetingDuration: number;
    inviteeUserIDList: string[];
};
export declare type UpdateMeetingParams = {
    roomID: string;
    meetingName: string;
    startTime: number;
    endTime: number;
    participantCanUnmuteSelf: boolean;
    participantCanEnableVideo: boolean;
    onlyHostInviteUser: boolean;
    onlyHostShareScreen: boolean;
    joinDisableMicrophone: boolean;
    joinDisableVideo: boolean;
    isMuteAllVideo: boolean;
    isMuteAllMicrophone: boolean;
    addCanScreenUserIDList: string[];
    reduceCanScreenUserIDList: string[];
    addDisableMicrophoneUserIDList: string[];
    reduceDisableMicrophoneUserIDList: string[];
    addDisableVideoUserIDList: string[];
    reduceDisableVideoUserIDList: string[];
    addPinedUserIDList: string[];
    reducePinedUserIDList: string[];
    addBeWatchedUserIDList: string[];
    reduceBeWatchedUserIDList: string[];
};
export declare type MeetingOperateStreamParams = {
    streamType: string;
    roomID: string;
    userID?: string;
    mute: boolean;
    muteAll: boolean;
};
export declare type SetConversationMsgDestructParams = {
    conversationID: string;
    isMsgDestruct: boolean;
};
export declare type SetConversationMsgDestructTimeParams = {
    conversationID: string;
    msgDestructTime: number;
};
