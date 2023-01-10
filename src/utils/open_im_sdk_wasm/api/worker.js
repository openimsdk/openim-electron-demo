import { RPC, RPCMessageEvent } from 'rpc-shooter';
import { init, close, 
// message
getMessage, getMultipleMessage, getSendingMessageList, getNormalMsgSeq, updateMessageTimeAndStatus, updateMessage, updateColumnsMessage, insertMessage, batchInsertMessageList, getMessageList, getMessageListNoTime, messageIfExists, isExistsInErrChatLogBySeq, messageIfExistsBySeq, getAbnormalMsgSeq, getAbnormalMsgSeqList, batchInsertExceptionMsg, searchMessageByKeyword, searchMessageByContentType, searchMessageByContentTypeAndKeyword, updateMsgSenderNickname, updateMsgSenderFaceURL, updateMsgSenderFaceURLAndSenderNickname, getMsgSeqByClientMsgID, getMsgSeqListByGroupID, getMsgSeqListByPeerUserID, getMsgSeqListBySelfUserID, deleteAllMessage, getAllUnDeleteMessageSeqList, updateSingleMessageHasRead, updateGroupMessageHasRead, updateMessageStatusBySourceID, 
// conversation
getAllConversationList, getAllConversationListToSync, getHiddenConversationList, getConversation, getMultipleConversation, updateColumnsConversation, decrConversationUnreadCount, batchInsertConversationList, insertConversation, getTotalUnreadMsgCount, batchUpdateConversationList, clearAllConversation, clearConversation, conversationIfExists, deleteConversation, getConversationByUserID, getConversationListSplit, incrConversationUnreadCount, removeConversationDraft, resetAllConversation, resetConversation, setConversationDraft, setMultipleConversationRecvMsgOpt, unPinConversation, 
// users
getLoginUser, insertLoginUser, updateLoginUserByMap, 
// super group
getJoinedSuperGroupList, getJoinedSuperGroupIDList, getSuperGroupInfoByGroupID, deleteSuperGroup, insertSuperGroup, updateSuperGroup, 
// unread messages
deleteConversationUnreadMessageList, batchInsertConversationUnreadMessageList, 
// super group messages
superGroupGetMessage, superGroupGetMultipleMessage, getSuperGroupNormalMsgSeq, superGroupGetNormalMinSeq, superGroupUpdateMessageTimeAndStatus, superGroupUpdateMessage, superGroupInsertMessage, superGroupBatchInsertMessageList, superGroupGetMessageListNoTime, superGroupGetMessageList, superGroupDeleteAllMessage, superGroupGetMsgSeqByClientMsgID, superGroupGetSendingMessageList, superGroupSearchMessageByContentType, superGroupSearchMessageByKeyword, superGroupSearchMessageByContentTypeAndKeyword, superGroupUpdateGroupMessageHasRead, superGroupUpdateMessageStatusBySourceID, superGroupUpdateColumnsMessage, superGroupUpdateMsgSenderFaceURLAndSenderNickname, 
// black
getBlackList, getBlackListUserID, getBlackInfoByBlockUserID, getBlackInfoList, insertBlack, deleteBlack, updateBlack, 
// friendRequest
insertFriendRequest, deleteFriendRequestBothUserID, updateFriendRequest, getRecvFriendApplication, getSendFriendApplication, getFriendApplicationByBothID, 
// groups
insertGroup, deleteGroup, updateGroup, getJoinedGroupList, getGroupInfoByGroupID, getAllGroupInfoByGroupIDOrGroupName, subtractMemberCount, addMemberCount, getJoinedWorkingGroupIDList, getJoinedWorkingGroupList, 
// groupRequest
insertGroupRequest, deleteGroupRequest, updateGroupRequest, getSendGroupApplication, insertAdminGroupRequest, deleteAdminGroupRequest, updateAdminGroupRequest, getAdminGroupApplication, 
// friend
insertFriend, deleteFriend, updateFriend, getAllFriendList, searchFriendList, getFriendInfoList, getFriendInfoByFriendUserID, 
// groupMember
batchInsertGroupMember, deleteGroupAllMembers, deleteGroupMember, getAllGroupMemberList, getAllGroupMemberUserIDList, getGroupAdminID, getGroupMemberCount, getGroupMemberInfoByGroupIDUserID, getGroupMemberListByGroupID, getGroupMemberListSplit, getGroupMemberListSplitByJoinTimeFilter, getGroupMemberOwner, getGroupMemberOwnerAndAdmin, getGroupMemberUIDListByGroupID, getGroupOwnerAndAdminByGroupID, getGroupSomeMemberInfo, insertGroupMember, searchGroupMembers, updateGroupMember, updateGroupMemberField, 
// temp cache chatlogs
batchInsertTempCacheMessageList, InsertTempCacheMessage, } from '../api/database';
import { getInstance } from './database/instance';
const ctx = self;
const rpc = new RPC({
    event: new RPCMessageEvent({
        currentEndpoint: ctx,
        targetEndpoint: ctx,
    }),
});
rpc.registerMethod('initDB', init);
rpc.registerMethod('close', close);
// message
rpc.registerMethod('getMessage', getMessage);
rpc.registerMethod('getMultipleMessage', getMultipleMessage);
rpc.registerMethod('getSendingMessageList', getSendingMessageList);
rpc.registerMethod('getNormalMsgSeq', getNormalMsgSeq);
rpc.registerMethod('updateMessageTimeAndStatus', updateMessageTimeAndStatus);
rpc.registerMethod('updateMessage', updateMessage);
rpc.registerMethod('updateColumnsMessage', updateColumnsMessage);
rpc.registerMethod('insertMessage', insertMessage);
rpc.registerMethod('batchInsertMessageList', batchInsertMessageList);
rpc.registerMethod('superGroupGetMessageListNoTime', superGroupGetMessageListNoTime);
rpc.registerMethod('getMessageList', getMessageList);
rpc.registerMethod('getMessageListNoTime', getMessageListNoTime);
rpc.registerMethod('messageIfExists', messageIfExists);
rpc.registerMethod('isExistsInErrChatLogBySeq', isExistsInErrChatLogBySeq);
rpc.registerMethod('messageIfExistsBySeq', messageIfExistsBySeq);
rpc.registerMethod('getAbnormalMsgSeq', getAbnormalMsgSeq);
rpc.registerMethod('getAbnormalMsgSeqList', getAbnormalMsgSeqList);
rpc.registerMethod('batchInsertExceptionMsg', batchInsertExceptionMsg);
rpc.registerMethod('searchMessageByKeyword', searchMessageByKeyword);
rpc.registerMethod('searchMessageByContentType', searchMessageByContentType);
rpc.registerMethod('searchMessageByContentTypeAndKeyword', searchMessageByContentTypeAndKeyword);
rpc.registerMethod('updateMsgSenderNickname', updateMsgSenderNickname);
rpc.registerMethod('updateMsgSenderFaceURL', updateMsgSenderFaceURL);
rpc.registerMethod('updateMsgSenderFaceURLAndSenderNickname', updateMsgSenderFaceURLAndSenderNickname);
rpc.registerMethod('getMsgSeqByClientMsgID', getMsgSeqByClientMsgID);
rpc.registerMethod('getMsgSeqListByGroupID', getMsgSeqListByGroupID);
rpc.registerMethod('getMsgSeqListByPeerUserID', getMsgSeqListByPeerUserID);
rpc.registerMethod('getMsgSeqListBySelfUserID', getMsgSeqListBySelfUserID);
rpc.registerMethod('deleteAllMessage', deleteAllMessage);
rpc.registerMethod('getAllUnDeleteMessageSeqList', getAllUnDeleteMessageSeqList);
rpc.registerMethod('updateSingleMessageHasRead', updateSingleMessageHasRead);
rpc.registerMethod('updateGroupMessageHasRead', updateGroupMessageHasRead);
rpc.registerMethod('updateMessageStatusBySourceID', updateMessageStatusBySourceID);
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
rpc.registerMethod('getLoginUser', getLoginUser);
rpc.registerMethod('insertLoginUser', insertLoginUser);
rpc.registerMethod('updateLoginUserByMap', updateLoginUserByMap);
rpc.registerMethod('getJoinedSuperGroupList', getJoinedSuperGroupList);
rpc.registerMethod('getJoinedSuperGroupIDList', getJoinedSuperGroupIDList);
rpc.registerMethod('getSuperGroupInfoByGroupID', getSuperGroupInfoByGroupID);
rpc.registerMethod('deleteSuperGroup', deleteSuperGroup);
rpc.registerMethod('insertSuperGroup', insertSuperGroup);
rpc.registerMethod('updateSuperGroup', updateSuperGroup);
rpc.registerMethod('deleteConversationUnreadMessageList', deleteConversationUnreadMessageList);
rpc.registerMethod('batchInsertConversationUnreadMessageList', batchInsertConversationUnreadMessageList);
rpc.registerMethod('superGroupGetMessage', superGroupGetMessage);
rpc.registerMethod('superGroupGetMultipleMessage', superGroupGetMultipleMessage);
rpc.registerMethod('getSuperGroupNormalMsgSeq', getSuperGroupNormalMsgSeq);
rpc.registerMethod('superGroupGetNormalMinSeq', superGroupGetNormalMinSeq);
rpc.registerMethod('superGroupUpdateMessageTimeAndStatus', superGroupUpdateMessageTimeAndStatus);
rpc.registerMethod('superGroupUpdateMessage', superGroupUpdateMessage);
rpc.registerMethod('superGroupInsertMessage', superGroupInsertMessage);
rpc.registerMethod('superGroupBatchInsertMessageList', superGroupBatchInsertMessageList);
rpc.registerMethod('superGroupGetMessageList', superGroupGetMessageList);
rpc.registerMethod('superGroupUpdateColumnsMessage', superGroupUpdateColumnsMessage);
rpc.registerMethod('superGroupDeleteAllMessage', superGroupDeleteAllMessage);
rpc.registerMethod('superGroupSearchMessageByKeyword', superGroupSearchMessageByKeyword);
rpc.registerMethod('superGroupSearchMessageByContentTypeAndKeyword', superGroupSearchMessageByContentTypeAndKeyword);
rpc.registerMethod('superGroupSearchMessageByContentType', superGroupSearchMessageByContentType);
rpc.registerMethod('superGroupUpdateMessageStatusBySourceID', superGroupUpdateMessageStatusBySourceID);
rpc.registerMethod('superGroupGetSendingMessageList', superGroupGetSendingMessageList);
rpc.registerMethod('superGroupUpdateGroupMessageHasRead', superGroupUpdateGroupMessageHasRead);
rpc.registerMethod('superGroupGetMsgSeqByClientMsgID', superGroupGetMsgSeqByClientMsgID);
rpc.registerMethod('superGroupUpdateMsgSenderFaceURLAndSenderNickname', superGroupUpdateMsgSenderFaceURLAndSenderNickname);
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
// temp cache chatlogs
rpc.registerMethod('batchInsertTempCacheMessageList', batchInsertTempCacheMessageList);
rpc.registerMethod('InsertTempCacheMessage', InsertTempCacheMessage);
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
