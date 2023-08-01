import { initBackend } from 'absurd-sql-optimized/dist/indexeddb-main-thread';
import { RPCMessageEvent, RPC } from 'rpc-shooter';
import { DatabaseErrorCode } from '../constant';
// @ts-ignore
//  for vite
import IMWorker from './worker?worker';
//  @ts-ignore
//  for webpack4
// import IMWorker from 'worker-loader!./worker.js';
let rpc;
let worker;
function initWorker() {
    if (typeof window === 'undefined') {
        return;
    }
    // for webpack4 or vite
    worker = new IMWorker();
    // for webpack5
    // worker = new Worker(new URL('./worker.js', import.meta.url));
    // This is only required because Safari doesn't support nested
    // workers. This installs a handler that will proxy creating web
    // workers through the main thread
    initBackend(worker);
    rpc = new RPC({
        event: new RPCMessageEvent({
            currentEndpoint: worker,
            targetEndpoint: worker,
        }),
    });
}
function resetWorker() {
    if (rpc) {
        rpc.destroy();
        rpc = undefined;
    }
    if (worker) {
        worker.terminate();
        worker = undefined;
    }
}
initWorker();
function catchErrorHandle(error) {
    // defined in rpc-shooter
    if (error.code === -32300) {
        resetWorker();
        return JSON.stringify({
            data: '',
            errCode: DatabaseErrorCode.ErrorDBTimeout,
            errMsg: 'database maybe damaged',
        });
    }
    throw error;
}
function registeMethodOnWindow(name, realName, needStringify = true) {
    console.info(`=> (database api) registe ${realName ?? name}`);
    return async (...args) => {
        if (!rpc || !worker) {
            initWorker();
        }
        if (!rpc) {
            return;
        }
        try {
            console.info(`=> (invoked by go wasm) run ${realName ?? name} method with args ${JSON.stringify(args)}`);
            const response = await rpc.invoke(name, ...args, { timeout: 5000000 });
            console.info(`=> (invoked by go wasm) run ${realName ?? name} method with response `, JSON.stringify(response));
            if (!needStringify) {
                return response;
            }
            return JSON.stringify(response);
        }
        catch (error) {
            // defined in rpc-shooter
            catchErrorHandle(error);
        }
    };
}
export const fileMapSet = registeMethodOnWindow('fileMapSet');
export const fileMapClear = registeMethodOnWindow('fileMapClear');
// register method on window for go wasm invoke
export function initDatabaseAPI() {
    if (!rpc) {
        return;
    }
    // upload
    window.wasmOpen = registeMethodOnWindow('wasmOpen');
    window.wasmClose = registeMethodOnWindow('wasmClose');
    window.wasmRead = registeMethodOnWindow('wasmRead', 'wasmRead', false);
    window.getUpload = registeMethodOnWindow('getUpload');
    window.insertUpload = registeMethodOnWindow('insertUpload');
    window.updateUpload = registeMethodOnWindow('updateUpload');
    window.deleteUpload = registeMethodOnWindow('deleteUpload');
    window.initDB = registeMethodOnWindow('initDB');
    window.close = registeMethodOnWindow('close');
    // message
    window.getMessage = registeMethodOnWindow('getMessage');
    window.getMultipleMessage = registeMethodOnWindow('getMultipleMessage');
    window.getSendingMessageList = registeMethodOnWindow('getSendingMessageList');
    window.getNormalMsgSeq = registeMethodOnWindow('getNormalMsgSeq');
    window.updateMessageTimeAndStatus = registeMethodOnWindow('updateMessageTimeAndStatus');
    window.updateMessage = registeMethodOnWindow('updateMessage');
    window.updateMessageBySeq = registeMethodOnWindow('updateMessageBySeq');
    window.updateColumnsMessage = registeMethodOnWindow('updateColumnsMessage');
    window.insertMessage = registeMethodOnWindow('insertMessage');
    window.batchInsertMessageList = registeMethodOnWindow('batchInsertMessageList');
    window.getMessageList = registeMethodOnWindow('getMessageList');
    window.getMessageListNoTime = registeMethodOnWindow('getMessageListNoTime');
    window.messageIfExists = registeMethodOnWindow('messageIfExists');
    window.isExistsInErrChatLogBySeq = registeMethodOnWindow('isExistsInErrChatLogBySeq');
    window.messageIfExistsBySeq = registeMethodOnWindow('messageIfExistsBySeq');
    window.getAbnormalMsgSeq = registeMethodOnWindow('getAbnormalMsgSeq');
    window.getAbnormalMsgSeqList = registeMethodOnWindow('getAbnormalMsgSeqList');
    window.batchInsertExceptionMsg = registeMethodOnWindow('batchInsertExceptionMsg');
    window.searchMessageByKeyword = registeMethodOnWindow('searchMessageByKeyword');
    window.searchMessageByContentType = registeMethodOnWindow('searchMessageByContentType');
    window.searchMessageByContentTypeAndKeyword = registeMethodOnWindow('searchMessageByContentTypeAndKeyword');
    window.updateMsgSenderNickname = registeMethodOnWindow('updateMsgSenderNickname');
    window.updateMsgSenderFaceURL = registeMethodOnWindow('updateMsgSenderFaceURL');
    window.updateMsgSenderFaceURLAndSenderNickname = registeMethodOnWindow('updateMsgSenderFaceURLAndSenderNickname');
    window.getMsgSeqByClientMsgID = registeMethodOnWindow('getMsgSeqByClientMsgID');
    window.getMsgSeqListByGroupID = registeMethodOnWindow('getMsgSeqListByGroupID');
    window.getMsgSeqListByPeerUserID = registeMethodOnWindow('getMsgSeqListByPeerUserID');
    window.getMsgSeqListBySelfUserID = registeMethodOnWindow('getMsgSeqListBySelfUserID');
    window.deleteAllMessage = registeMethodOnWindow('deleteAllMessage');
    window.getAllUnDeleteMessageSeqList = registeMethodOnWindow('getAllUnDeleteMessageSeqList');
    window.updateSingleMessageHasRead = registeMethodOnWindow('updateSingleMessageHasRead');
    window.updateGroupMessageHasRead = registeMethodOnWindow('updateGroupMessageHasRead');
    window.updateMessageStatusBySourceID = registeMethodOnWindow('updateMessageStatusBySourceID');
    window.getAlreadyExistSeqList = registeMethodOnWindow('getAlreadyExistSeqList');
    window.getMessageBySeq = registeMethodOnWindow('getMessageBySeq');
    window.getMessagesByClientMsgIDs = registeMethodOnWindow('getMessagesByClientMsgIDs');
    window.getMessagesBySeqs = registeMethodOnWindow('getMessagesBySeqs');
    window.getConversationNormalMsgSeq = registeMethodOnWindow('getConversationNormalMsgSeq');
    window.getConversationPeerNormalMsgSeq = registeMethodOnWindow('getConversationPeerNormalMsgSeq');
    window.deleteConversationAllMessages = registeMethodOnWindow('deleteConversationAllMessages');
    window.markDeleteConversationAllMessages = registeMethodOnWindow('markDeleteConversationAllMessages');
    window.getUnreadMessage = registeMethodOnWindow('getUnreadMessage');
    window.markConversationMessageAsReadBySeqs = registeMethodOnWindow('markConversationMessageAsReadBySeqs');
    window.markConversationMessageAsReadDB = registeMethodOnWindow('markConversationMessageAsRead');
    window.deleteConversationMsgs = registeMethodOnWindow('deleteConversationMsgs');
    window.markConversationAllMessageAsRead = registeMethodOnWindow('markConversationAllMessageAsRead');
    window.searchAllMessageByContentType = registeMethodOnWindow('searchAllMessageByContentType');
    // conversation
    window.getAllConversationListDB = registeMethodOnWindow('getAllConversationList');
    window.getAllConversationListToSync = registeMethodOnWindow('getAllConversationListToSync');
    window.getHiddenConversationList = registeMethodOnWindow('getHiddenConversationList');
    window.getConversation = registeMethodOnWindow('getConversation');
    window.getMultipleConversationDB = registeMethodOnWindow('getMultipleConversation');
    window.updateColumnsConversation = registeMethodOnWindow('updateColumnsConversation');
    window.updateConversation = registeMethodOnWindow('updateColumnsConversation', 'updateConversation');
    window.updateConversationForSync = registeMethodOnWindow('updateColumnsConversation', 'updateConversationForSync');
    window.decrConversationUnreadCount = registeMethodOnWindow('decrConversationUnreadCount');
    window.batchInsertConversationList = registeMethodOnWindow('batchInsertConversationList');
    window.insertConversation = registeMethodOnWindow('insertConversation');
    window.getTotalUnreadMsgCountDB = registeMethodOnWindow('getTotalUnreadMsgCount');
    window.getConversationByUserID = registeMethodOnWindow('getConversationByUserID');
    window.getConversationListSplitDB = registeMethodOnWindow('getConversationListSplit');
    window.deleteConversation = registeMethodOnWindow('deleteConversation');
    window.batchUpdateConversationList = registeMethodOnWindow('batchUpdateConversationList');
    window.conversationIfExists = registeMethodOnWindow('conversationIfExists');
    window.resetConversation = registeMethodOnWindow('resetConversation');
    window.resetAllConversation = registeMethodOnWindow('resetAllConversation');
    window.clearConversation = registeMethodOnWindow('clearConversation');
    window.clearAllConversation = registeMethodOnWindow('clearAllConversation');
    window.setConversationDraftDB = registeMethodOnWindow('setConversationDraft');
    window.removeConversationDraft = registeMethodOnWindow('removeConversationDraft');
    window.unPinConversation = registeMethodOnWindow('unPinConversation');
    // window.updateAllConversation = registeMethodOnWindow('updateAllConversation');
    window.incrConversationUnreadCount = registeMethodOnWindow('incrConversationUnreadCount');
    window.setMultipleConversationRecvMsgOpt = registeMethodOnWindow('setMultipleConversationRecvMsgOpt');
    window.getAllSingleConversationIDList = registeMethodOnWindow('getAllSingleConversationIDList');
    window.getAllConversationIDList = registeMethodOnWindow('getAllConversationIDList');
    window.getAllConversations = registeMethodOnWindow('getAllConversations');
    // users
    window.getLoginUser = registeMethodOnWindow('getLoginUser');
    window.insertLoginUser = registeMethodOnWindow('insertLoginUser');
    window.updateLoginUser = registeMethodOnWindow('updateLoginUser');
    // super groups
    window.getJoinedSuperGroupList = registeMethodOnWindow('getJoinedSuperGroupList');
    window.getJoinedSuperGroupIDList = registeMethodOnWindow('getJoinedSuperGroupIDList');
    window.getSuperGroupInfoByGroupID = registeMethodOnWindow('getSuperGroupInfoByGroupID');
    window.deleteSuperGroup = registeMethodOnWindow('deleteSuperGroup');
    window.insertSuperGroup = registeMethodOnWindow('insertSuperGroup');
    window.updateSuperGroup = registeMethodOnWindow('updateSuperGroup');
    // unread messages
    window.deleteConversationUnreadMessageList = registeMethodOnWindow('deleteConversationUnreadMessageList');
    window.batchInsertConversationUnreadMessageList = registeMethodOnWindow('batchInsertConversationUnreadMessageList');
    // super group messages
    window.superGroupGetMessage = registeMethodOnWindow('superGroupGetMessage');
    window.superGroupGetMultipleMessage = registeMethodOnWindow('superGroupGetMultipleMessage');
    window.superGroupGetNormalMinSeq = registeMethodOnWindow('superGroupGetNormalMinSeq');
    window.getSuperGroupNormalMsgSeq = registeMethodOnWindow('getSuperGroupNormalMsgSeq');
    window.superGroupUpdateMessageTimeAndStatus = registeMethodOnWindow('superGroupUpdateMessageTimeAndStatus');
    window.superGroupUpdateMessage = registeMethodOnWindow('superGroupUpdateMessage');
    window.superGroupInsertMessage = registeMethodOnWindow('superGroupInsertMessage');
    window.superGroupBatchInsertMessageList = registeMethodOnWindow('superGroupBatchInsertMessageList');
    window.superGroupGetMessageListNoTime = registeMethodOnWindow('superGroupGetMessageListNoTime');
    window.superGroupGetMessageList = registeMethodOnWindow('superGroupGetMessageList');
    window.superGroupUpdateColumnsMessage = registeMethodOnWindow('superGroupUpdateColumnsMessage');
    window.superGroupDeleteAllMessage = registeMethodOnWindow('superGroupDeleteAllMessage');
    window.superGroupSearchMessageByKeyword = registeMethodOnWindow('superGroupSearchMessageByKeyword');
    window.superGroupSearchMessageByContentType = registeMethodOnWindow('superGroupSearchMessageByContentType');
    window.superGroupSearchMessageByContentTypeAndKeyword = registeMethodOnWindow('superGroupSearchMessageByContentTypeAndKeyword');
    window.superGroupUpdateMessageStatusBySourceID = registeMethodOnWindow('superGroupUpdateMessageStatusBySourceID');
    window.superGroupGetSendingMessageList = registeMethodOnWindow('superGroupGetSendingMessageList');
    window.superGroupUpdateGroupMessageHasRead = registeMethodOnWindow('superGroupUpdateGroupMessageHasRead');
    window.superGroupGetMsgSeqByClientMsgID = registeMethodOnWindow('superGroupGetMsgSeqByClientMsgID');
    window.superGroupUpdateMsgSenderFaceURLAndSenderNickname =
        registeMethodOnWindow('superGroupUpdateMsgSenderFaceURLAndSenderNickname');
    window.superGroupSearchAllMessageByContentType = registeMethodOnWindow('superGroupSearchAllMessageByContentType');
    // debug
    window.exec = registeMethodOnWindow('exec');
    window.getRowsModified = registeMethodOnWindow('getRowsModified');
    window.exportDB = async () => {
        if (!rpc || !worker) {
            initWorker();
        }
        if (!rpc) {
            return;
        }
        try {
            console.info('=> (invoked by go wasm) run exportDB method ');
            const result = await rpc.invoke('exportDB', undefined, { timeout: 5000 });
            console.info('=> (invoked by go wasm) run exportDB method with response ', JSON.stringify(result));
            return result;
        }
        catch (error) {
            catchErrorHandle(error);
        }
    };
    // black
    window.getBlackListDB = registeMethodOnWindow('getBlackList');
    window.getBlackListUserID = registeMethodOnWindow('getBlackListUserID');
    window.getBlackInfoByBlockUserID = registeMethodOnWindow('getBlackInfoByBlockUserID');
    window.getBlackInfoList = registeMethodOnWindow('getBlackInfoList');
    window.insertBlack = registeMethodOnWindow('insertBlack');
    window.deleteBlack = registeMethodOnWindow('deleteBlack');
    window.updateBlack = registeMethodOnWindow('updateBlack');
    // friendRequest
    window.insertFriendRequest = registeMethodOnWindow('insertFriendRequest');
    window.deleteFriendRequestBothUserID = registeMethodOnWindow('deleteFriendRequestBothUserID');
    window.updateFriendRequest = registeMethodOnWindow('updateFriendRequest');
    window.getRecvFriendApplication = registeMethodOnWindow('getRecvFriendApplication');
    window.getSendFriendApplication = registeMethodOnWindow('getSendFriendApplication');
    window.getFriendApplicationByBothID = registeMethodOnWindow('getFriendApplicationByBothID');
    window.getBothFriendReq = registeMethodOnWindow('getBothFriendReq');
    // friend
    window.insertFriend = registeMethodOnWindow('insertFriend');
    window.deleteFriendDB = registeMethodOnWindow('deleteFriend');
    window.updateFriend = registeMethodOnWindow('updateFriend');
    window.getAllFriendList = registeMethodOnWindow('getAllFriendList');
    window.searchFriendList = registeMethodOnWindow('searchFriendList');
    window.getFriendInfoByFriendUserID = registeMethodOnWindow('getFriendInfoByFriendUserID');
    window.getFriendInfoList = registeMethodOnWindow('getFriendInfoList');
    window.getPageFriendList = registeMethodOnWindow('getPageFriendList');
    // groups
    window.insertGroup = registeMethodOnWindow('insertGroup');
    window.deleteGroup = registeMethodOnWindow('deleteGroup');
    window.updateGroup = registeMethodOnWindow('updateGroup');
    window.getJoinedGroupListDB = registeMethodOnWindow('getJoinedGroupList');
    window.getGroupInfoByGroupID = registeMethodOnWindow('getGroupInfoByGroupID');
    window.getAllGroupInfoByGroupIDOrGroupName = registeMethodOnWindow('getAllGroupInfoByGroupIDOrGroupName');
    window.subtractMemberCount = registeMethodOnWindow('subtractMemberCount');
    window.addMemberCount = registeMethodOnWindow('addMemberCount');
    window.getJoinedWorkingGroupIDList = registeMethodOnWindow('getJoinedWorkingGroupIDList');
    window.getJoinedWorkingGroupList = registeMethodOnWindow('getJoinedWorkingGroupList');
    window.getGroupMemberAllGroupIDs = registeMethodOnWindow('getGroupMemberAllGroupIDs');
    window.getUserJoinedGroupIDs = registeMethodOnWindow('getUserJoinedGroupIDs');
    window.getGroups = registeMethodOnWindow('getGroups');
    // groupRequest
    window.insertGroupRequest = registeMethodOnWindow('insertGroupRequest');
    window.deleteGroupRequest = registeMethodOnWindow('deleteGroupRequest');
    window.updateGroupRequest = registeMethodOnWindow('updateGroupRequest');
    window.getSendGroupApplication = registeMethodOnWindow('getSendGroupApplication');
    window.insertAdminGroupRequest = registeMethodOnWindow('insertAdminGroupRequest');
    window.deleteAdminGroupRequest = registeMethodOnWindow('deleteAdminGroupRequest');
    window.updateAdminGroupRequest = registeMethodOnWindow('updateAdminGroupRequest');
    window.getAdminGroupApplication = registeMethodOnWindow('getAdminGroupApplication');
    // groupMember
    window.getGroupMemberInfoByGroupIDUserID = registeMethodOnWindow('getGroupMemberInfoByGroupIDUserID');
    window.getAllGroupMemberList = registeMethodOnWindow('getAllGroupMemberList');
    window.getAllGroupMemberUserIDList = registeMethodOnWindow('getAllGroupMemberUserIDList');
    window.getGroupMemberCount = registeMethodOnWindow('getGroupMemberCount');
    window.getGroupSomeMemberInfo = registeMethodOnWindow('getGroupSomeMemberInfo');
    window.getGroupAdminID = registeMethodOnWindow('getGroupAdminID');
    window.getGroupMemberListByGroupID = registeMethodOnWindow('getGroupMemberListByGroupID');
    window.getGroupMemberListSplit = registeMethodOnWindow('getGroupMemberListSplit');
    window.getGroupMemberOwnerAndAdminDB = registeMethodOnWindow('getGroupMemberOwnerAndAdmin');
    window.getGroupMemberOwner = registeMethodOnWindow('getGroupMemberOwner');
    window.getGroupMemberListSplitByJoinTimeFilter = registeMethodOnWindow('getGroupMemberListSplitByJoinTimeFilter');
    window.getGroupOwnerAndAdminByGroupID = registeMethodOnWindow('getGroupOwnerAndAdminByGroupID');
    window.getGroupMemberUIDListByGroupID = registeMethodOnWindow('getGroupMemberUIDListByGroupID');
    window.insertGroupMember = registeMethodOnWindow('insertGroupMember');
    window.batchInsertGroupMember = registeMethodOnWindow('batchInsertGroupMember');
    window.deleteGroupMember = registeMethodOnWindow('deleteGroupMember');
    window.deleteGroupAllMembers = registeMethodOnWindow('deleteGroupAllMembers');
    window.updateGroupMember = registeMethodOnWindow('updateGroupMember');
    window.updateGroupMemberField = registeMethodOnWindow('updateGroupMemberField');
    window.searchGroupMembersDB = registeMethodOnWindow('searchGroupMembers', 'searchGroupMembersDB');
    // temp cache chat logs
    window.batchInsertTempCacheMessageList = registeMethodOnWindow('batchInsertTempCacheMessageList');
    window.InsertTempCacheMessage = registeMethodOnWindow('InsertTempCacheMessage');
    // notification
    window.getNotificationAllSeqs = registeMethodOnWindow('getNotificationAllSeqs');
    window.setNotificationSeq = registeMethodOnWindow('setNotificationSeq');
}
export const workerPromise = rpc?.connect(5000);
