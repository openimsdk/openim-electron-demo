import { CbEvents } from '../constant';
import { GroupType, SessionType, MessageType, Platform, MessageStatus, GroupStatus, GroupVerificationType, AllowType, GroupJoinSource, GroupMemberRole, MessageReceiveOptType, GroupAtType, LogLevel, ApplicationHandleResult, Relationship, OnlineState } from './enum';
export declare type WSEvent<T = unknown> = {
    event: CbEvents;
    data: T;
    errCode: number;
    errMsg: string;
    operationID: string;
};
export declare type WsResponse<T = string> = {
    event: string;
    errCode: number;
    errMsg: string;
    data: T;
    operationID: string;
};
export declare type IMConfig = {
    platformID: Platform;
    apiAddr: string;
    wsAddr: string;
    dataDir: string;
    logLevel: LogLevel;
    isLogStandardOutput: boolean;
    logFilePath: string;
    isExternalExtensions: boolean;
};
export declare type MessageEntity = {
    type: string;
    offset: number;
    length: number;
    url?: string;
    info?: string;
};
export declare type PicBaseInfo = {
    uuid: string;
    type: string;
    size: number;
    width: number;
    height: number;
    url: string;
};
export declare type AtUsersInfoItem = {
    atUserID: string;
    groupNickname: string;
};
export declare type GroupApplicationItem = {
    createTime: number;
    creatorUserID: string;
    ex: string;
    groupFaceURL: string;
    groupID: string;
    groupName: string;
    groupType: GroupType;
    handleResult: ApplicationHandleResult;
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
    joinSource: GroupJoinSource;
    status: GroupStatus;
    userFaceURL: string;
    userID: string;
};
export declare type FriendApplicationItem = {
    createTime: number;
    ex: string;
    fromFaceURL: string;
    fromNickname: string;
    fromUserID: string;
    handleMsg: string;
    handleResult: ApplicationHandleResult;
    handleTime: number;
    handlerUserID: string;
    reqMsg: string;
    toFaceURL: string;
    toNickname: string;
    toUserID: string;
};
export declare type FullUserItem = {
    blackInfo: BlackUserItem | null;
    friendInfo: FriendUserItem | null;
    publicInfo: PublicUserItem | null;
};
export declare type FullUserItemWithCache = {
    blackInfo: BlackUserItem | null;
    friendInfo: FriendUserItem | null;
    publicInfo: PublicUserItem | null;
    groupMemberInfo: GroupMemberItem | null;
};
export declare type PublicUserItem = {
    nickname: string;
    userID: string;
    faceURL: string;
    ex: string;
};
export declare type SelfUserInfo = {
    createTime: number;
    ex: string;
    faceURL: string;
    nickname: string;
    userID: string;
    globalRecvMsgOpt: MessageReceiveOptType;
};
export declare type PartialUserInfo = {
    userID: string;
} & Partial<Omit<SelfUserInfo, 'userID'>>;
export declare type FriendUserItem = {
    addSource: number;
    createTime: number;
    ex: string;
    faceURL: string;
    userID: string;
    nickname: string;
    operatorUserID: string;
    ownerUserID: string;
    remark: string;
    attachedInfo: string;
};
export declare type SearchedFriendsInfo = FriendUserItem & {
    relationship: Relationship;
};
export declare type FriendshipInfo = {
    result: number;
    userID: string;
};
export declare type BlackUserItem = {
    addSource: number;
    userID: string;
    createTime: number;
    ex: string;
    faceURL: string;
    nickname: string;
    operatorUserID: string;
    ownerUserID: string;
};
export declare type GroupItem = {
    groupID: string;
    groupName: string;
    notification: string;
    notificationUserID: string;
    notificationUpdateTime: number;
    introduction: string;
    faceURL: string;
    ownerUserID: string;
    createTime: number;
    memberCount: number;
    status: GroupStatus;
    creatorUserID: string;
    groupType: GroupType;
    needVerification: GroupVerificationType;
    ex: string;
    applyMemberFriend: AllowType;
    lookMemberInfo: AllowType;
};
export declare type GroupMemberItem = {
    groupID: string;
    userID: string;
    nickname: string;
    faceURL: string;
    roleLevel: GroupMemberRole;
    muteEndTime: number;
    joinTime: number;
    joinSource: GroupJoinSource;
    inviterUserID: string;
    operatorUserID: string;
    ex: string;
};
export declare type ConversationItem = {
    conversationID: string;
    conversationType: SessionType;
    userID: string;
    groupID: string;
    showName: string;
    faceURL: string;
    recvMsgOpt: MessageReceiveOptType;
    unreadCount: number;
    groupAtType: GroupAtType;
    latestMsg: string;
    latestMsgSendTime: number;
    draftText: string;
    draftTextTime: number;
    burnDuration: number;
    msgDestructTime: number;
    isPinned: boolean;
    isNotInGroup: boolean;
    isPrivateChat: boolean;
    isMsgDestruct: boolean;
    attachedInfo: string;
    ex: string;
};
export declare type MessageItem = {
    clientMsgID: string;
    serverMsgID: string;
    createTime: number;
    sendTime: number;
    sessionType: SessionType;
    sendID: string;
    recvID: string;
    msgFrom: number;
    contentType: MessageType;
    senderPlatformID: Platform;
    senderNickname: string;
    senderFaceUrl: string;
    groupID: string;
    content: string;
    seq: number;
    isRead: boolean;
    status: MessageStatus;
    isReact: boolean;
    isExternalExtensions: boolean;
    offlinePush: OfflinePush;
    attachedInfo: string;
    ex: string;
    localEx: string;
    textElem: TextElem;
    cardElem: CardElem;
    pictureElem: PictureElem;
    soundElem: SoundElem;
    videoElem: VideoElem;
    fileElem: FileElem;
    mergeElem: MergeElem;
    atTextElem: AtTextElem;
    faceElem: FaceElem;
    locationElem: LocationElem;
    customElem: CustomElem;
    quoteElem: QuoteElem;
    notificationElem: NotificationElem;
    advancedTextElem: AdvancedTextElem;
    typingElem: TypingElem;
    attachedInfoElem: AttachedInfoElem;
};
export declare type TextElem = {
    content: string;
};
export declare type CardElem = {
    userID: string;
    nickname: string;
    faceURL: string;
    ex: string;
};
export declare type AtTextElem = {
    text: string;
    atUserList: string[];
    atUsersInfo?: AtUsersInfoItem[];
    quoteMessage?: MessageItem;
    isAtSelf?: boolean;
};
export declare type NotificationElem = {
    detail: string;
};
export declare type AdvancedTextElem = {
    text: string;
    messageEntityList: MessageEntity[];
};
export declare type TypingElem = {
    msgTips: string;
};
export declare type CustomElem = {
    data: string;
    description: string;
    extension: string;
};
export declare type FileElem = {
    filePath: string;
    uuid: string;
    sourceUrl: string;
    fileName: string;
    fileSize: number;
};
export declare type FaceElem = {
    index: number;
    data: string;
};
export declare type LocationElem = {
    description: string;
    longitude: number;
    latitude: number;
};
export declare type MergeElem = {
    title: string;
    abstractList: string[];
    multiMessage: MessageItem[];
    messageEntityList: MessageEntity[];
};
export declare type OfflinePush = {
    title: string;
    desc: string;
    ex: string;
    iOSPushSound: string;
    iOSBadgeCount: boolean;
};
export declare type PictureElem = {
    sourcePath: string;
    sourcePicture: Picture;
    bigPicture: Picture;
    snapshotPicture: Picture;
};
export declare type AttachedInfoElem = {
    groupHasReadInfo: GroupHasReadInfo;
    isPrivateChat: boolean;
    isEncryption: boolean;
    inEncryptStatus: boolean;
    burnDuration: number;
    hasReadTime: number;
    notSenderNotificationPush: boolean;
    messageEntityList: MessageEntity[];
    uploadProgress: UploadProgress;
};
export declare type UploadProgress = {
    total: number;
    save: number;
    current: number;
};
export declare type GroupHasReadInfo = {
    hasReadCount: number;
    unreadCount: number;
    hasReadUserIDList: string[];
    groupMemberCount: number;
};
export declare type Picture = {
    uuid: string;
    type: string;
    size: number;
    width: number;
    height: number;
    url: string;
};
export declare type QuoteElem = {
    text: string;
    quoteMessage: MessageItem;
};
export declare type SoundElem = {
    uuid: string;
    soundPath: string;
    sourceUrl: string;
    dataSize: number;
    duration: number;
};
export declare type VideoElem = {
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
export declare type AdvancedRevokeContent = {
    clientMsgID: string;
    revokeTime: number;
    revokerID: string;
    revokerNickname: string;
    revokerRole: number;
    seq: number;
    sessionType: SessionType;
    sourceMessageSendID: string;
    sourceMessageSendTime: number;
    sourceMessageSenderNickname: string;
};
export declare type RevokedInfo = {
    revokerID: string;
    revokerRole: number;
    clientMsgID: string;
    revokerNickname: string;
    revokeTime: number;
    sourceMessageSendTime: number;
    sourceMessageSendID: string;
    sourceMessageSenderNickname: string;
    sessionType: number;
    seq: number;
    ex: string;
};
export declare type ReceiptInfo = {
    userID: string;
    groupID: string;
    msgIDList: string[];
    readTime: number;
    msgFrom: number;
    contentType: MessageType;
    sessionType: SessionType;
};
export declare type SearchMessageResult = {
    totalCount: number;
    searchResultItems: SearchMessageResultItem[];
};
export declare type SearchMessageResultItem = {
    conversationID: string;
    messageCount: number;
    conversationType: SessionType;
    showName: string;
    faceURL: string;
    messageList: MessageItem[];
};
export declare type AdvancedGetMessageResult = {
    isEnd: boolean;
    lastMinSeq: number;
    errCode: number;
    errMsg: string;
    messageList: MessageItem[];
};
export declare type RtcInvite = {
    inviterUserID: string;
    inviteeUserIDList: string[];
    customData?: string;
    groupID: string;
    roomID: string;
    timeout: number;
    mediaType: string;
    sessionType: number;
    platformID: number;
    initiateTime?: number;
    busyLineUserIDList?: string[];
};
export declare type UserOnlineState = {
    platformIDs?: Platform[];
    status: OnlineState;
    userID: string;
};
export declare type GroupMessageReceiptInfo = {
    conversationID: string;
    groupMessageReadInfo: GroupMessageReadInfo[];
};
export declare type GroupMessageReadInfo = {
    clientMsgID: string;
    hasReadCount: number;
    unreadCount: number;
    readMembers: GroupMemberItem[];
};
