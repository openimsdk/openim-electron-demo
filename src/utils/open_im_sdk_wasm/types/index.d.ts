import { CbEvents } from '../constant';

type DatabaseApi = (...args: any[]) => Promise<any>;

declare global {
  interface Window {
    // registered by js to provide database api
    [functionName: DatabaseAPI]: (...args: any[]) => Promise<any>;
    // [functionName: string]: (...args: any[]) => Promise<any>;

    initDB: DatabaseApi;
    // message
    getMessage: DatabaseApi;
    getMultipleMessage: DatabaseApi;
    getSendingMessageList: DatabaseApi;
    getNormalMsgSeq: DatabaseApi;
    updateMessageTimeAndStatus: DatabaseApi;
    updateMessage: DatabaseApi;
    updateColumnsMessage: DatabaseApi;
    insertMessage: DatabaseApi;
    batchInsertMessageList: DatabaseApi;
    getMessageList: DatabaseApi;
    getMessageListNoTime: DatabaseApi;
    messageIfExists: DatabaseApi;
    isExistsInErrChatLogBySeq: DatabaseApi;
    messageIfExistsBySeq: DatabaseApi;
    getAbnormalMsgSeq: DatabaseApi;
    getAbnormalMsgSeqList: DatabaseApi;
    batchInsertExceptionMsg: DatabaseApi;
    searchMessageByKeyword: DatabaseApi;
    searchMessageByContentType: DatabaseApi;
    searchMessageByContentTypeAndKeyword: DatabaseApi;
    updateMsgSenderNickname: DatabaseApi;
    updateMsgSenderFaceURL: DatabaseApi;
    updateMsgSenderFaceURLAndSenderNickname: DatabaseApi;
    getMsgSeqByClientMsgID: DatabaseApi;
    getMsgSeqListByGroupID: DatabaseApi;
    getMsgSeqListByPeerUserID: DatabaseApi;
    getMsgSeqListBySelfUserID: DatabaseApi;
    deleteAllMessage: DatabaseApi;
    getAllUnDeleteMessageSeqList: DatabaseApi;
    updateSingleMessageHasRead: DatabaseApi;
    updateGroupMessageHasRead: DatabaseApi;
    updateMessageStatusBySourceID: DatabaseApi;
    // conversation
    getAllConversationListDB: DatabaseApi;
    getAllConversationListToSync: DatabaseApi;
    getHiddenConversationList: DatabaseApi;
    getConversation: DatabaseApi;
    getMultipleConversationDB: DatabaseApi;
    updateColumnsConversation: DatabaseApi;
    updateConversation: DatabaseApi;
    updateConversationForSync: DatabaseApi;
    decrConversationUnreadCount: DatabaseApi;
    batchInsertConversationList: DatabaseApi;
    insertConversation: DatabaseApi;
    getTotalUnreadMsgCountDB: DatabaseApi;
    batchUpdateConversationList: DatabaseApi;
    clearAllConversation: DatabaseApi;
    clearConversation: DatabaseApi;
    conversationIfExists: DatabaseApi;
    deleteConversation: DatabaseApi;
    getConversationByUserID: DatabaseApi;
    getConversationListSplitDB: DatabaseApi;
    incrConversationUnreadCount: DatabaseApi;
    removeConversationDraft: DatabaseApi;
    resetAllConversation: DatabaseApi;
    resetConversation: DatabaseApi;
    setConversationDraft: DatabaseApi;
    setMultipleConversationRecvMsgOpt: DatabaseApi;
    unPinConversation: DatabaseApi;
    // users
    getLoginUser: DatabaseApi;
    insertLoginUser: DatabaseApi;
    updateLoginUserByMap: DatabaseApi;
    getJoinedSuperGroupList: DatabaseApi;
    getJoinedSuperGroupIDList: DatabaseApi;
    getSuperGroupInfoByGroupID: DatabaseApi;
    deleteSuperGroup: DatabaseApi;
    insertSuperGroup: DatabaseApi;
    updateSuperGroup: DatabaseApi;
    // unread messages
    deleteConversationUnreadMessageList: DatabaseApi;
    batchInsertConversationUnreadMessageList: DatabaseApi;
    // super group messages
    superGroupGetMessage: DatabaseApi;
    superGroupGetMultipleMessage: DatabaseApi;
    superGroupGetNormalMinSeq: DatabaseApi;
    getSuperGroupNormalMsgSeq: DatabaseApi;
    superGroupUpdateMessageTimeAndStatus: DatabaseApi;
    superGroupUpdateMessage: DatabaseApi;
    superGroupInsertMessage: DatabaseApi;
    superGroupBatchInsertMessageList: DatabaseApi;
    superGroupGetMessageListNoTime: DatabaseApi;
    superGroupGetMessageList: DatabaseApi;
    superGroupUpdateColumnsMessage: DatabaseApi;
    superGroupDeleteAllMessage: DatabaseApi;
    superGroupSearchMessageByKeyword: DatabaseApi;
    superGroupSearchMessageByContentType: DatabaseApi;
    superGroupSearchMessageByContentTypeAndKeyword: DatabaseApi;
    superGroupUpdateMessageStatusBySourceID: DatabaseApi;
    superGroupGetSendingMessageList: DatabaseApi;
    superGroupUpdateGroupMessageHasRead: DatabaseApi;
    superGroupGetMsgSeqByClientMsgID: DatabaseApi;
    getRowsModified: DatabaseApi;

    // black
    getBlackListDB: DatabaseApi;
    getBlackListUserID: DatabaseApi;
    getBlackInfoByBlockUserID: DatabaseApi;
    getBlackInfoList: DatabaseApi;
    insertBlack: DatabaseApi;
    deleteBlack: DatabaseApi;
    updateBlack: DatabaseApi;

    // friendRequest
    insertFriendRequest: DatabaseApi;
    deleteFriendRequestBothUserID: DatabaseApi;
    updateFriendRequest: DatabaseApi;
    getRecvFriendApplication: DatabaseApi;
    getSendFriendApplication: DatabaseApi;
    getFriendApplicationByBothID: DatabaseApi;

    // friend
    insertFriend: DatabaseApi;
    deleteFriendDB: DatabaseApi;
    updateFriend: DatabaseApi;
    getAllFriendList: DatabaseApi;
    searchFriendList: DatabaseApi;
    getFriendInfoByFriendUserID: DatabaseApi;
    getFriendInfoList: DatabaseApi;

    // groups
    insertGroup: DatabaseApi;
    deleteGroup: DatabaseApi;
    updateGroup: DatabaseApi;
    getJoinedGroupListDB: DatabaseApi;
    getGroupInfoByGroupID: DatabaseApi;
    getAllGroupInfoByGroupIDOrGroupName: DatabaseApi;
    subtractMemberCount: DatabaseApi;
    addMemberCount: DatabaseApi;
    getJoinedWorkingGroupIDList: DatabaseApi;
    getJoinedWorkingGroupList: DatabaseApi;

    // groupRequest
    insertGroupRequest: DatabaseApi;
    deleteGroupRequest: DatabaseApi;
    updateGroupRequest: DatabaseApi;
    getSendGroupApplication: DatabaseApi;
    insertAdminGroupRequest: DatabaseApi;
    deleteAdminGroupRequest: DatabaseApi;
    updateAdminGroupRequest: DatabaseApi;
    getAdminGroupApplication: DatabaseApi;

    // groupMember
    getGroupMemberInfoByGroupIDUserID: DatabaseApi;
    getAllGroupMemberList: DatabaseApi;
    getAllGroupMemberUserIDList: DatabaseApi;
    getGroupMemberCount: DatabaseApi;
    getGroupSomeMemberInfo: DatabaseApi;
    getGroupAdminID: DatabaseApi;
    getGroupMemberListByGroupID: DatabaseApi;
    getGroupMemberListSplit: DatabaseApi;
    getGroupMemberOwnerAndAdmin: DatabaseApi;
    getGroupMemberOwner: DatabaseApi;
    getGroupMemberListSplitByJoinTimeFilter: DatabaseApi;
    getGroupOwnerAndAdminByGroupID: DatabaseApi;
    getGroupMemberUIDListByGroupID: DatabaseApi;
    insertGroupMember: DatabaseApi;
    batchInsertGroupMember: DatabaseApi;
    deleteGroupMember: DatabaseApi;
    deleteGroupAllMembers: DatabaseApi;
    updateGroupMember: DatabaseApi;
    updateGroupMemberField: DatabaseApi;
    searchGroupMembersDB: DatabaseApi;

    // temp chche logs
    batchInsertTempCacheMessageList: DatabaseApi;
    InsertTempCacheMessage: DatabaseApi;

    // registered by go wasm
    initSDK: (operationID: string, config: string) => void;
    login: (operationID: string, userID: string, token: string) => Promise<any>;
    logout: (operationID: string) => Promise<any>;
    commonEventFunc: (listener: (event: string) => void) => void;
    createTextMessage: (operationID: string, text: string) => Promise<string[]>;
    getAllConversationList: (operationID: string) => Promise<string>;
    getOneConversation: (
      operationID: string,
      sessionType: number,
      sourceID: string
    ) => Promise<string>;
    getAdvancedHistoryMessageList: (
      operationID: string,
      getAdvancedHistoryMessageListParamsStr: string
    ) => Promise<string>;
    getHistoryMessageList: (
      operationID: string,
      getHistoryMsgParamsParamsStr: string
    ) => Promise<string>;
    getGroupsInfo: (operationID: string, params: string) => Promise<string>;
    deleteConversationFromLocalAndSvr: (
      operationID: string,
      conversationID: string
    ) => Promise<string>;
    markC2CMessageAsRead: (
      operationID: string,
      userID: string,
      msgIDListStr: string
    ) => Promise<string>;
    markMessageAsReadByConID: (
      operationID: string,
      conversationID: string,
      msgIDListStr: string
    ) => Promise<string>;
    getGroupMemberList: (
      operationID: string,
      groupID: string,
      filter: number,
      offset: number,
      count: number
    ) => Promise<string>;
    createImageMessageByURL: (
      operationID: string,
      sourcePictureStr: string,
      bigPictureStr: string,
      snapshotPictureStr: string
    ) => Promise<string>;
    createCustomMessage: (
      operationID: string,
      data: string,
      extension: string,
      description: string
    ) => Promise<string>;
    createQuoteMessage: (
      operationID: string,
      text: string,
      message: string
    ) => Promise<string>;
    createAdvancedQuoteMessage: (
      operationID: string,
      text: string,
      message: string,
      messageEntityListStr: string
    ) => Promise<string>;
    createAdvancedTextMessage: (
      operationID: string,
      text: string,
      messageEntityListStr: string
    ) => Promise<string>;
    sendMessage: (
      operationID: string,
      message: string,
      recvID: string,
      groupID: string,
      offlinePushInfoStr: string
    ) => Promise<string>;
    sendMessageNotOss: (
      operationID: string,
      message: string,
      recvID: string,
      groupID: string,
      offlinePushInfoStr: string,
      fileArrayBuffer?: ArrayBuffer,
      snpFileArrayBuffer?: ArrayBuffer
    ) => Promise<string>;
    sendMessageByBuffer: (
      operationID: string,
      message: string,
      recvID: string,
      groupID: string,
      offlinePushInfoStr: string
    ) => Promise<string>;
    getHistoryMessageListReverse: (
      operationID: string,
      getMessageOptions: string
    ) => Promise<string>;
    revokeMessage: (operationID: string, params: string) => Promise<string>;
    setOneConversationPrivateChat: (
      operationID: string,
      conversationID: string,
      isPrivate: boolean
    ) => Promise<string>;
    getLoginStatus: (operationID: string) => Promise<string>;
    iLogin: (
      operationID: string,
      token: string,
      userID: string
    ) => Promise<string>;
    getLoginUser: (operationID: string) => Promise<string>;
    getSelfUserInfo: (operationID: string) => Promise<string>;
    getUsersInfo: (
      operationID: string,
      userIDList: string[]
    ) => Promise<string>;
    setSelfInfo: (operationID: string, userInfo: string[]) => Promise<string>;
    createTextAtMessage: (
      operationID: string,
      text: string,
      atUserIDList: string[],
      atUsersInfo?: AtUsersInfoItem[],
      message?: string
    ) => Promise<string>;
    createSoundMessageByURL: (
      operationID: string,
      uuid: string,
      soundPath: string,
      sourceUrl: string,
      dataSize: number,
      duration: number
    ) => Promise<string>;
    createVideoMessageByURL: (
      operationID: string,
      videoPath: string,
      duration: string,
      videoType: string,
      snapshotPath: number,
      videoUUID: number,
      videoUrl: string,
      videoSize: number,
      snapshotUUID: string,
      snapshotSize: number,
      snapshotUrl: string,
      snapshotWidth: number,
      snapshotHeight: number
    ) => Promise<string>;
    createFileMessageByURL: (
      operationID: string,
      filePath: string,
      fileName: string,
      uuid: string,
      sourceUrl: string,
      fileSize: number
    ) => Promise<string>;
    createFileMessageFromFullPath: (
      operationID: string,
      fileFullPath: string,
      fileName: string
    ) => Promise<string>;
    createImageMessageFromFullPath: (
      operationID: string,
      imageFullPath: string
    ) => Promise<string>;
    createSoundMessageFromFullPath: (
      operationID: string,
      soundPath: string,
      duration: number
    ) => Promise<string>;
    createVideoMessageFromFullPath: (
      operationID: string,
      videoFullPath: string,
      videoType: string,
      duration: number,
      snapshotFullPath: string
    ) => Promise<string>;
    createMergerMessage: (
      operationID: string,
      messageList: MessageItem[],
      title: string,
      summaryList: string[]
    ) => Promise<string>;
    createForwardMessage: (operationID: string, m: string) => Promise<string>;
    createFaceMessage: (
      operationID: string,
      index: number,
      data: string
    ) => Promise<string>;
    createLocationMessage: (
      operationID: string,
      description: string,
      longitude: number,
      latitude: number
    ) => Promise<string>;
    createCardMessage: (
      operationID: string,
      cardInfo: string
    ) => Promise<string>;
    deleteMessageFromLocalStorage: (
      operationID: string,
      message: string
    ) => Promise<string>;
    deleteMessageFromLocalAndSvr: (
      operationID: string,
      message: string
    ) => Promise<string>;
    deleteAllConversationFromLocal: (operationID: string) => Promise<string>;
    deleteAllMsgFromLocal: (operationID: string) => Promise<string>;
    deleteAllMsgFromLocalAndSvr: (operationID: string) => Promise<string>;
    markGroupMessageHasRead: (
      operationID: string,
      groupID: string
    ) => Promise<string>;
    markGroupMessageAsRead: (
      operationID: string,
      groupID: string,
      msgIDList: string[]
    ) => Promise<string>;
    insertSingleMessageToLocalStorage: (
      operationID: string,
      message: string,
      recvID: string,
      sendID: string
    ) => Promise<string>;
    insertGroupMessageToLocalStorage: (
      operationID: string,
      message: string,
      groupID: string,
      sendID: string
    ) => Promise<string>;
    typingStatusUpdate: (
      operationID: string,
      recvID: string,
      msgTip: string
    ) => Promise<string>;
    markNotifyMessageHasRead: (
      operationID: string,
      conversationID: string
    ) => Promise<string>;
    clearC2CHistoryMessage: (
      operationID: string,
      userID: string
    ) => Promise<string>;
    clearC2CHistoryMessageFromLocalAndSvr: (
      operationID: string,
      userID: string
    ) => Promise<string>;
    clearGroupHistoryMessage: (
      operationID: string,
      groupID: string
    ) => Promise<string>;
    clearGroupHistoryMessageFromLocalAndSvr: (
      operationID: string,
      groupID: string
    ) => Promise<string>;
    getConversationListSplit: (
      operationID: string,
      offset: number,
      count: number
    ) => Promise<string>;
    getConversationIDBySessionType: (
      operationID: string,
      sourceID: string,
      sessionType: number
    ) => Promise<string>;
    getMultipleConversation: (
      operationID: string,
      conversationIDList: string[]
    ) => Promise<string>;
    deleteConversation: (
      operationID: string,
      conversationID: string
    ) => Promise<string>;
    setConversationDraft: (
      operationID: string,
      conversationID: string,
      draftText: string
    ) => Promise<string>;
    pinConversation: (
      operationID: string,
      conversationID: string,
      isPinned: boolean
    ) => Promise<string>;
    getTotalUnreadMsgCount: (operationID: string) => Promise<string>;
    getConversationRecvMessageOpt: (
      operationID: string,
      conversationIDList: string[]
    ) => Promise<string>;
    setConversationRecvMessageOpt: (
      operationID: string,
      conversationIDList: string[],
      opt: OptType
    ) => Promise<string>;
    searchLocalMessages: (
      operationID: string,
      conversationID: string,
      keywordList: string[],
      keywordListMatchType?: number,
      senderUserIDList?: string[],
      messageTypeList?: MessageType[],
      searchTimePosition?: number,
      searchTimePeriod?: number,
      pageIndex?: number,
      count?: number
    ) => Promise<string>;
    addFriend: (
      operationID: string,
      toUserID: string,
      reqMsg: string
    ) => Promise<string>;
    searchFriends: (
      operationID: string,
      keywordList: string[],
      isSearchUserID: boolean,
      isSearchNickname: boolean,
      isSearchRemark: boolean
    ) => Promise<string>;
    getDesignatedFriendsInfo: (
      operationID: string,
      userIDList: string[]
    ) => Promise<string>;
    getRecvFriendApplicationList: (operationID: string) => Promise<string>;
    getSendFriendApplicationList: (operationID: string) => Promise<string>;
    getFriendList: (operationID: string) => Promise<string>;
    setFriendRemark: (
      operationID: string,
      toUserID: string,
      remark: string
    ) => Promise<string>;
    checkFriend: (operationID: string, userIDList: string[]) => Promise<string>;
    acceptFriendApplication: (
      operationID: string,
      toUserID: string,
      handleMsg: string
    ) => Promise<string>;
    refuseFriendApplication: (
      operationID: string,
      toUserID: string,
      handleMsg: string
    ) => Promise<string>;
    deleteFriend: (
      operationID: string,
      friendUserID: string
    ) => Promise<string>;
    addBlack: (operationID: string, blackUserID: string) => Promise<string>;
    removeBlack: (operationID: string, removeUserID: string) => Promise<string>;
    getBlackList: (operationID: string) => Promise<string>;
    inviteUserToGroup: (
      operationID: string,
      groupID: string,
      reason: string,
      userIDList: string[]
    ) => Promise<string>;
    kickGroupMember: (
      operationID: string,
      groupID: string,
      reason: string,
      userIDList: string[]
    ) => Promise<string>;
    getGroupMembersInfo: (
      operationID: string,
      groupID: string,
      reason: string,
      userIDList: string[]
    ) => Promise<string>;
    getGroupMemberListByJoinTimeFilter: (
      operationID: string,
      groupID: string,
      filterUserIDList: string[],
      offset: number,
      count: number,
      joinTimeBegin: number,
      joinTimeEnd: number
    ) => Promise<string>;
    searchGroupMembers: (
      operationID: string,
      groupID: string,
      keywordList: string[],
      isSearchUserID: boolean,
      isSearchMemberNickname: boolean,
      offset: number,
      count: number
    ) => Promise<string>;
    setGroupApplyMemberFriend: (
      operationID: string,
      rule: AllowType,
      groupID: string
    ) => Promise<string>;
    setGroupLookMemberInfo: (
      operationID: string,
      rule: AllowType,
      groupID: string
    ) => Promise<string>;
    getJoinedGroupList: (operationID: string) => Promise<string>;
    createGroup: (
      operationID: string,
      groupBaseInfo: GroupInitInfo,
      memberList: Member[]
    ) => Promise<string>;
    setGroupInfo: (
      operationID: string,
      groupID: string,
      groupInfo: GroupBaseInfo
    ) => Promise<string>;
    setGroupMemberNickname: (
      operationID: string,
      groupID: string,
      userID: string,
      GroupMemberNickname: string
    ) => Promise<string>;
    joinGroup: (
      operationID: string,
      groupID: string,
      reqMsg: string,
      joinSource: GroupJoinSource
    ) => Promise<string>;
    searchGroups: (
      operationID: string,
      keywordList: string[],
      isSearchGroupID: boolean,
      isSearchGroupName: boolean
    ) => Promise<string>;
    quitGroup: (operationID: string, groupID: string) => Promise<string>;
    dismissGroup: (operationID: string, groupID: string) => Promise<string>;
    changeGroupMute: (
      operationID: string,
      groupID: string,
      isMute: boolean
    ) => Promise<string>;
    changeGroupMemberMute: (
      operationID: string,
      groupID: string,
      userID: string,
      mutedSeconds: number
    ) => Promise<string>;
    transferGroupOwner: (
      operationID: string,
      groupID: string,
      newOwnerUserID: string
    ) => Promise<string>;
    getSendGroupApplicationList: (operationID: string) => Promise<string>;
    getRecvGroupApplicationList: (operationID: string) => Promise<string>;
    acceptGroupApplication: (
      operationID: string,
      groupID: string,
      fromUserID: string,
      handleMsg: string
    ) => Promise<string>;
    refuseGroupApplication: (
      operationID: string,
      groupID: string,
      fromUserID: string,
      handleMsg: string
    ) => Promise<string>;
    signalingInvite: (
      operationID: string,
      inviterUserID: string,
      inviteeUserIDList: string[],
      groupID: string,
      roomID: string,
      timeout: number,
      mediaType: string,
      sessionType: number,
      platformID: number
    ) => Promise<string>;
    signalingInviteInGroup: (
      operationID: string,
      inviterUserID: string,
      inviteeUserIDList: string[],
      groupID: string,
      roomID: string,
      timeout: number,
      mediaType: string,
      sessionType: number,
      platformID: number
    ) => Promise<string>;
    signalingAccept: (
      operationID: string,
      opUserID: string,
      invitation: RtcInvite
    ) => Promise<string>;
    signalingReject: (
      operationID: string,
      opUserID: string,
      invitation: RtcInvite
    ) => Promise<string>;
    signalingCancel: (
      operationID: string,
      opUserID: string,
      invitation: RtcInvite
    ) => Promise<string>;
    signalingHungUp: (
      operationID: string,
      opUserID: string,
      invitation: RtcInvite
    ) => Promise<string>;
    getSubDepartment: (
      operationID: string,
      departmentID: string,
      offset: number,
      count: number
    ) => Promise<string>;
    getDepartmentMember: (
      operationID: string,
      operationID: string,
      departmentID: string,
      offset: number,
      count: number
    ) => Promise<string>;
    getUserInDepartment: (
      operationID: string,
      userID: string
    ) => Promise<string>;
    getDepartmentMemberAndSubDepartment: (
      operationID: string,
      departmentID: string
    ) => Promise<string>;
    getDepartmentInfo: (
      operationID: string,
      departmentID: string
    ) => Promise<string>;
    searchOrganization: (
      operationID: string,
      input: SearchInputType,
      offset: number,
      count: number
    ) => Promise<string>;
    resetConversationGroupAtType: (
      operationID: string,
      conversationID: string
    ) => Promise<string>;
    setGroupMemberRoleLevel: (
      operationID: string,
      groupID: string,
      userID: string,
      roleLevel: GroupRole
    ) => Promise<string>;
    setGroupVerification: (
      operationID: string,
      verification: GroupVerificationType,
      groupID: string
    ) => Promise<string>;
    setGlobalRecvMessageOpt: (
      operationID: string,
      opt: OptType
    ) => Promise<string>;
    newRevokeMessage: (operationID: string, message: string) => Promise<string>;
    findMessageList: (
      operationID: string,
      conversationID: string,
      clientMsgIDList: string[]
    ) => Promise<string>;

    // debug
    exec: (sql: string) => Promise<any>;
    exportDB: () => Promise<string>; //return Uint8Array
  }
  class Go {
    exited: boolean;
    importObject: WebAssembly.Imports;
    run: (instance: WebAssembly.Instance) => Promise<void>;
  }
}

export type WSEvent = {
  event: CbEvents;
  data: unknown;
  errCode: number;
  errMsg: string;
  operationID: string;
};

export enum SessionType {
  SINGLECVE = 1,
  GROUPCVE = 2,
  SUPERGROUP = 3,
  NOTIFICATION = 4,
}
