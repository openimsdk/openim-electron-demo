import { RPC, RPCMessageEvent } from 'rpc-shooter';
import { init, close, 
// message
getMessage, getMultipleMessage, getSendingMessageList, updateMessageTimeAndStatus, updateMessage, updateMessageBySeq, updateColumnsMessage, insertMessage, batchInsertMessageList, getMessageList, getMessageListNoTime, messageIfExists, searchMessageByKeyword, searchMessageByContentType, searchMessageByContentTypeAndKeyword, updateMsgSenderFaceURLAndSenderNickname, insertSendingMessage, deleteSendingMessage, getAllSendingMessages, 
// conversation
getAllConversationList, getAllConversationListToSync, getHiddenConversationList, getConversation, getMultipleConversation, updateColumnsConversation, decrConversationUnreadCount, batchInsertConversationList, insertConversation, getTotalUnreadMsgCount, batchUpdateConversationList, clearAllConversation, clearConversation, conversationIfExists, deleteConversation, getConversationByUserID, getConversationListSplit, incrConversationUnreadCount, removeConversationDraft, resetAllConversation, resetConversation, setConversationDraft, setMultipleConversationRecvMsgOpt, unPinConversation, 
// users
getLoginUser, insertLoginUser, updateLoginUser, getStrangerInfo, setStrangerInfo, 
// super group
getJoinedSuperGroupList, getJoinedSuperGroupIDList, getSuperGroupInfoByGroupID, deleteSuperGroup, insertSuperGroup, updateSuperGroup, 
// unread messages
deleteConversationUnreadMessageList, batchInsertConversationUnreadMessageList, 
// black
getBlackList, getBlackListUserID, getBlackInfoByBlockUserID, getBlackInfoList, insertBlack, deleteBlack, updateBlack, 
// friendRequest
insertFriendRequest, deleteFriendRequestBothUserID, updateFriendRequest, getRecvFriendApplication, getSendFriendApplication, getFriendApplicationByBothID, getBothFriendReq, 
// groups
insertGroup, deleteGroup, updateGroup, getJoinedGroupList, getGroupInfoByGroupID, getAllGroupInfoByGroupIDOrGroupName, subtractMemberCount, addMemberCount, getJoinedWorkingGroupIDList, getJoinedWorkingGroupList, getGroups, 
// groupRequest
insertGroupRequest, deleteGroupRequest, updateGroupRequest, getSendGroupApplication, insertAdminGroupRequest, deleteAdminGroupRequest, updateAdminGroupRequest, getAdminGroupApplication, 
// friend
insertFriend, deleteFriend, updateFriend, getAllFriendList, searchFriendList, getFriendInfoList, getFriendInfoByFriendUserID, 
// groupMember
batchInsertGroupMember, deleteGroupAllMembers, deleteGroupMember, getAllGroupMemberList, getAllGroupMemberUserIDList, getGroupAdminID, getGroupMemberCount, getGroupMemberInfoByGroupIDUserID, getGroupMemberListByGroupID, getGroupMemberListSplit, getGroupMemberListSplitByJoinTimeFilter, getGroupMemberOwner, getGroupMemberOwnerAndAdmin, getGroupMemberUIDListByGroupID, getGroupOwnerAndAdminByGroupID, getGroupSomeMemberInfo, insertGroupMember, searchGroupMembers, updateGroupMember, updateGroupMemberField, getUserJoinedGroupIDs, 
// temp cache chatlogs
batchInsertTempCacheMessageList, InsertTempCacheMessage, getAllSingleConversationIDList, getAllConversationIDList, getPageFriendList, getGroupMemberAllGroupIDs, getAlreadyExistSeqList, markConversationAllMessageAsRead, searchAllMessageByContentType, deleteConversationMsgs, markConversationMessageAsRead, markConversationMessageAsReadBySeqs, markDeleteConversationAllMessages, getUnreadMessage, getConversationPeerNormalMsgSeq, getConversationNormalMsgSeq, deleteConversationAllMessages, getMessagesByClientMsgIDs, getMessagesBySeqs, getMessageBySeq, getAllConversations, 
// upload
updateUpload, deleteUpload, getUpload, insertUpload, } from '../api/database';
import { getInstance } from './database/instance';
import { setNotificationSeq, getNotificationAllSeqs, } from './database/notification';
import { fileMapClear, fileMapSet, wasmClose, wasmOpen, wasmRead, } from './upload';
const ctx = self;
const rpc = new RPC({
    event: new RPCMessageEvent({
        currentEndpoint: ctx,
        targetEndpoint: ctx,
    }),
});
// upload
rpc.registerMethod('fileMapSet', fileMapSet);
rpc.registerMethod('fileMapClear', fileMapClear);
rpc.registerMethod('wasmOpen', wasmOpen);
rpc.registerMethod('wasmClose', wasmClose);
rpc.registerMethod('wasmRead', wasmRead);
rpc.registerMethod('getUpload', getUpload);
rpc.registerMethod('insertUpload', insertUpload);
rpc.registerMethod('updateUpload', updateUpload);
rpc.registerMethod('deleteUpload', deleteUpload);
rpc.registerMethod('initDB', init);
rpc.registerMethod('close', close);
// message
rpc.registerMethod('getMessage', getMessage);
rpc.registerMethod('getMultipleMessage', getMultipleMessage);
rpc.registerMethod('getSendingMessageList', getSendingMessageList);
rpc.registerMethod('updateMessageTimeAndStatus', updateMessageTimeAndStatus);
rpc.registerMethod('updateMessage', updateMessage);
rpc.registerMethod('updateMessageBySeq', updateMessageBySeq);
rpc.registerMethod('updateColumnsMessage', updateColumnsMessage);
rpc.registerMethod('insertMessage', insertMessage);
rpc.registerMethod('batchInsertMessageList', batchInsertMessageList);
rpc.registerMethod('getMessageList', getMessageList);
rpc.registerMethod('getMessageListNoTime', getMessageListNoTime);
rpc.registerMethod('messageIfExists', messageIfExists);
rpc.registerMethod('searchMessageByKeyword', searchMessageByKeyword);
rpc.registerMethod('searchMessageByContentType', searchMessageByContentType);
rpc.registerMethod('searchMessageByContentTypeAndKeyword', searchMessageByContentTypeAndKeyword);
rpc.registerMethod('updateMsgSenderFaceURLAndSenderNickname', updateMsgSenderFaceURLAndSenderNickname);
rpc.registerMethod('getAlreadyExistSeqList', getAlreadyExistSeqList);
rpc.registerMethod('getMessageBySeq', getMessageBySeq);
rpc.registerMethod('getMessagesByClientMsgIDs', getMessagesByClientMsgIDs);
rpc.registerMethod('getMessagesBySeqs', getMessagesBySeqs);
rpc.registerMethod('getConversationNormalMsgSeq', getConversationNormalMsgSeq);
rpc.registerMethod('getConversationPeerNormalMsgSeq', getConversationPeerNormalMsgSeq);
rpc.registerMethod('deleteConversationAllMessages', deleteConversationAllMessages);
rpc.registerMethod('markDeleteConversationAllMessages', markDeleteConversationAllMessages);
rpc.registerMethod('getUnreadMessage', getUnreadMessage);
rpc.registerMethod('markConversationMessageAsReadBySeqs', markConversationMessageAsReadBySeqs);
rpc.registerMethod('markConversationMessageAsRead', markConversationMessageAsRead);
rpc.registerMethod('deleteConversationMsgs', deleteConversationMsgs);
rpc.registerMethod('markConversationAllMessageAsRead', markConversationAllMessageAsRead);
rpc.registerMethod('searchAllMessageByContentType', searchAllMessageByContentType);
rpc.registerMethod('insertSendingMessage', insertSendingMessage);
rpc.registerMethod('deleteSendingMessage', deleteSendingMessage);
rpc.registerMethod('getAllSendingMessages', getAllSendingMessages);
// conversation
rpc.registerMethod('getAllConversationList', getAllConversationList);
rpc.registerMethod('getAllConversationListToSync', getAllConversationListToSync);
rpc.registerMethod('getHiddenConversationList', getHiddenConversationList);
rpc.registerMethod('getConversation', getConversation);
rpc.registerMethod('getMultipleConversation', getMultipleConversation);
rpc.registerMethod('updateColumnsConversation', updateColumnsConversation);
rpc.registerMethod('decrConversationUnreadCount', decrConversationUnreadCount);
rpc.registerMethod('batchInsertConversationList', batchInsertConversationList);
rpc.registerMethod('getTotalUnreadMsgCount', getTotalUnreadMsgCount);
rpc.registerMethod('insertConversation', insertConversation);
rpc.registerMethod('getConversationByUserID', getConversationByUserID);
rpc.registerMethod('getConversationListSplit', getConversationListSplit);
rpc.registerMethod('deleteConversation', deleteConversation);
rpc.registerMethod('batchUpdateConversationList', batchUpdateConversationList);
rpc.registerMethod('conversationIfExists', conversationIfExists);
rpc.registerMethod('resetConversation', resetConversation);
rpc.registerMethod('resetAllConversation', resetAllConversation);
rpc.registerMethod('clearConversation', clearConversation);
rpc.registerMethod('clearAllConversation', clearAllConversation);
rpc.registerMethod('setConversationDraft', setConversationDraft);
rpc.registerMethod('removeConversationDraft', removeConversationDraft);
rpc.registerMethod('unPinConversation', unPinConversation);
rpc.registerMethod('incrConversationUnreadCount', incrConversationUnreadCount);
rpc.registerMethod('setMultipleConversationRecvMsgOpt', setMultipleConversationRecvMsgOpt);
rpc.registerMethod('getAllSingleConversationIDList', getAllSingleConversationIDList);
rpc.registerMethod('getAllConversationIDList', getAllConversationIDList);
rpc.registerMethod('getAllConversations', getAllConversations);
rpc.registerMethod('getLoginUser', getLoginUser);
rpc.registerMethod('insertLoginUser', insertLoginUser);
rpc.registerMethod('updateLoginUser', updateLoginUser);
rpc.registerMethod('getStrangerInfo', getStrangerInfo);
rpc.registerMethod('setStrangerInfo', setStrangerInfo);
rpc.registerMethod('getJoinedSuperGroupList', getJoinedSuperGroupList);
rpc.registerMethod('getJoinedSuperGroupIDList', getJoinedSuperGroupIDList);
rpc.registerMethod('getSuperGroupInfoByGroupID', getSuperGroupInfoByGroupID);
rpc.registerMethod('deleteSuperGroup', deleteSuperGroup);
rpc.registerMethod('insertSuperGroup', insertSuperGroup);
rpc.registerMethod('updateSuperGroup', updateSuperGroup);
rpc.registerMethod('deleteConversationUnreadMessageList', deleteConversationUnreadMessageList);
rpc.registerMethod('batchInsertConversationUnreadMessageList', batchInsertConversationUnreadMessageList);
// black
rpc.registerMethod('getBlackList', getBlackList);
rpc.registerMethod('getBlackListUserID', getBlackListUserID);
rpc.registerMethod('getBlackInfoByBlockUserID', getBlackInfoByBlockUserID);
rpc.registerMethod('getBlackInfoList', getBlackInfoList);
rpc.registerMethod('insertBlack', insertBlack);
rpc.registerMethod('deleteBlack', deleteBlack);
rpc.registerMethod('updateBlack', updateBlack);
// friendRequest
rpc.registerMethod('insertFriendRequest', insertFriendRequest);
rpc.registerMethod('deleteFriendRequestBothUserID', deleteFriendRequestBothUserID);
rpc.registerMethod('updateFriendRequest', updateFriendRequest);
rpc.registerMethod('getRecvFriendApplication', getRecvFriendApplication);
rpc.registerMethod('getSendFriendApplication', getSendFriendApplication);
rpc.registerMethod('getFriendApplicationByBothID', getFriendApplicationByBothID);
rpc.registerMethod('getBothFriendReq', getBothFriendReq);
// groups
rpc.registerMethod('insertGroup', insertGroup);
rpc.registerMethod('deleteGroup', deleteGroup);
rpc.registerMethod('updateGroup', updateGroup);
rpc.registerMethod('getJoinedGroupList', getJoinedGroupList);
rpc.registerMethod('getGroupInfoByGroupID', getGroupInfoByGroupID);
rpc.registerMethod('getAllGroupInfoByGroupIDOrGroupName', getAllGroupInfoByGroupIDOrGroupName);
rpc.registerMethod('subtractMemberCount', subtractMemberCount);
rpc.registerMethod('addMemberCount', addMemberCount);
rpc.registerMethod('getJoinedWorkingGroupIDList', getJoinedWorkingGroupIDList);
rpc.registerMethod('getJoinedWorkingGroupList', getJoinedWorkingGroupList);
rpc.registerMethod('getGroupMemberAllGroupIDs', getGroupMemberAllGroupIDs);
rpc.registerMethod('getGroups', getGroups);
// groupMembers
rpc.registerMethod('getGroupMemberInfoByGroupIDUserID', getGroupMemberInfoByGroupIDUserID);
rpc.registerMethod('getAllGroupMemberList', getAllGroupMemberList);
rpc.registerMethod('getAllGroupMemberUserIDList', getAllGroupMemberUserIDList);
rpc.registerMethod('getGroupMemberCount', getGroupMemberCount);
rpc.registerMethod('getGroupSomeMemberInfo', getGroupSomeMemberInfo);
rpc.registerMethod('getGroupAdminID', getGroupAdminID);
rpc.registerMethod('getGroupMemberListByGroupID', getGroupMemberListByGroupID);
rpc.registerMethod('getGroupMemberListSplit', getGroupMemberListSplit);
rpc.registerMethod('getGroupMemberOwnerAndAdmin', getGroupMemberOwnerAndAdmin);
rpc.registerMethod('getGroupMemberOwner', getGroupMemberOwner);
rpc.registerMethod('getGroupMemberListSplitByJoinTimeFilter', getGroupMemberListSplitByJoinTimeFilter);
rpc.registerMethod('getGroupOwnerAndAdminByGroupID', getGroupOwnerAndAdminByGroupID);
rpc.registerMethod('getGroupMemberUIDListByGroupID', getGroupMemberUIDListByGroupID);
rpc.registerMethod('insertGroupMember', insertGroupMember);
rpc.registerMethod('batchInsertGroupMember', batchInsertGroupMember);
rpc.registerMethod('deleteGroupMember', deleteGroupMember);
rpc.registerMethod('deleteGroupAllMembers', deleteGroupAllMembers);
rpc.registerMethod('updateGroupMember', updateGroupMember);
rpc.registerMethod('updateGroupMemberField', updateGroupMemberField);
rpc.registerMethod('searchGroupMembers', searchGroupMembers);
rpc.registerMethod('getUserJoinedGroupIDs', getUserJoinedGroupIDs);
// groupRequest
rpc.registerMethod('insertGroupRequest', insertGroupRequest);
rpc.registerMethod('deleteGroupRequest', deleteGroupRequest);
rpc.registerMethod('updateGroupRequest', updateGroupRequest);
rpc.registerMethod('getSendGroupApplication', getSendGroupApplication);
rpc.registerMethod('insertAdminGroupRequest', insertAdminGroupRequest);
rpc.registerMethod('deleteAdminGroupRequest', deleteAdminGroupRequest);
rpc.registerMethod('updateAdminGroupRequest', updateAdminGroupRequest);
rpc.registerMethod('getAdminGroupApplication', getAdminGroupApplication);
// friend
rpc.registerMethod('insertFriend', insertFriend);
rpc.registerMethod('deleteFriend', deleteFriend);
rpc.registerMethod('updateFriend', updateFriend);
rpc.registerMethod('getAllFriendList', getAllFriendList);
rpc.registerMethod('searchFriendList', searchFriendList);
rpc.registerMethod('getFriendInfoByFriendUserID', getFriendInfoByFriendUserID);
rpc.registerMethod('getFriendInfoList', getFriendInfoList);
rpc.registerMethod('getPageFriendList', getPageFriendList);
// temp cache chatlogs
rpc.registerMethod('batchInsertTempCacheMessageList', batchInsertTempCacheMessageList);
rpc.registerMethod('InsertTempCacheMessage', InsertTempCacheMessage);
// notification
rpc.registerMethod('getNotificationAllSeqs', getNotificationAllSeqs);
rpc.registerMethod('setNotificationSeq', setNotificationSeq);
rpc.registerMethod('exec', async (sql) => {
    const db = await getInstance();
    try {
        const result = db.exec(sql);
        console.info(`sql debug with exec sql = ${sql.trim()} , return `, result);
    }
    catch (error) {
        console.info(`sql debug with exec sql = ${sql} , return `, error);
    }
});
rpc.registerMethod('getRowsModified', async () => {
    const db = await getInstance();
    try {
        const result = db.getRowsModified();
        console.info('sql debug with getRowsModified return ', result);
    }
    catch (error) {
        console.info('sql debug with getRowsModified return ', error);
    }
});
rpc.registerMethod('exportDB', async () => {
    const db = await getInstance();
    try {
        const data = db.export();
        const blob = new Blob([data]);
        const blobHref = URL.createObjectURL(blob);
        return blobHref;
    }
    catch (error) {
        console.info('sql export error, return ', error);
    }
});
