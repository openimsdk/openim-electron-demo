import { CbEvents, RequestFunc } from '../constant';
import { GroupType, SessionType, MessageType, Platform, MessageStatus, GroupStatus, GroupVerificationType, AllowType, GroupJoinSource, GroupRole, OptType, GroupAtType } from './enum';
export declare type WSEvent = {
    event: CbEvents;
    data: unknown;
    errCode: number;
    errMsg: string;
    operationID: string;
};
export declare type WsResponse = {
    event: RequestFunc;
    errCode: number;
    errMsg: string;
    data: any;
    operationID: string;
};
export declare type IMConfig = {
    platform: number;
    api_addr: string;
    ws_addr: string;
    log_level: number;
    is_need_encryption: boolean;
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
export declare type GroupInitInfo = {
    groupType: GroupType;
    groupName: string;
    introduction?: string;
    notification?: string;
    faceURL?: string;
    ex?: string;
};
export declare type Member = {
    userID: string;
    roleLevel: number;
};
export declare type RtcInvite = {
    inviterUserID: string;
    inviteeUserIDList: string[];
    groupID: string;
    roomID: string;
    timeout: number;
    mediaType: string;
    sessionType: number;
    platformID: number;
};
export declare type GroupApplicationItem = {
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
export declare type FriendApplicationItem = {
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
export declare type TotalUserStruct = {
    blackInfo: BlackItem | null;
    friendInfo: FriendItem | null;
    publicInfo: PublicUserItem | null;
};
export declare type PublicUserItem = {
    gender: number;
    nickname: string;
    userID: string;
    faceURL: string;
    ex: string;
};
export declare type FullUserItem = {
    birth: number;
    birthTime: string;
    createTime: number;
    email: string;
    ex: string;
    faceURL: string;
    gender: number;
    nickname: string;
    phoneNumber: string;
    userID: string;
};
export declare type PartialUserItem = Partial<Omit<FullUserItem, 'userID'>> & {
    userID: string;
};
export declare type FriendItem = {
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
export declare type FriendRelationItem = {
    result: number;
    userID: string;
};
export declare type BlackItem = {
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
    groupType: number;
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
    roleLevel: GroupRole;
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
    recvMsgOpt: OptType;
    unreadCount: number;
    groupAtType: GroupAtType;
    latestMsg: string;
    latestMsgSendTime: number;
    draftText: string;
    draftTextTime: number;
    isPinned: boolean;
    isNotInGroup: boolean;
    isPrivateChat: boolean;
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
    platformID: Platform;
    senderNickname: string;
    senderFaceUrl: string;
    groupID: string;
    content: string;
    seq: number;
    isRead: boolean;
    status: MessageStatus;
    offlinePush: OfflinePush;
    attachedInfo: string;
    attachedInfoElem: AttachedInfoElem;
    ex: string;
    pictureElem: PictureElem;
    soundElem: SoundElem;
    videoElem: VideoElem;
    fileElem: FileElem;
    faceElem: FaceElem;
    mergeElem: MergeElem;
    atElem: AtElem;
    locationElem: LocationElem;
    customElem: CustomElem;
    quoteElem: QuoteElem;
    notificationElem: NotificationElem;
    progress?: number;
    downloadProgress?: number;
    downloaded?: boolean;
    errCode?: number;
};
export declare type NotificationElem = {
    detail: string;
    defaultTips: string;
};
export declare type AtElem = {
    text: string;
    atUserList: string[];
    atUsersInfo?: AtUsersInfoItem[];
    quoteMessage?: string;
    isAtSelf?: boolean;
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
    burnDuration: number;
    hasReadTime: number;
    notSenderNotificationPush: boolean;
    messageEntityList: MessageEntity[];
};
export declare type GroupHasReadInfo = {
    hasReadCount: number;
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
