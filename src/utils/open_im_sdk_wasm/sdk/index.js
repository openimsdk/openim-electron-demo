import { initDatabaseAPI, workerPromise } from '../api';
import Emitter from '../utils/emitter';
import { v4 as uuidv4 } from 'uuid';
import { getGO, initializeWasm, getGoExitPromsie } from './initialize';
class SDK extends Emitter {
    wasmInitializedPromise;
    goExitPromise;
    goExisted = false;
    constructor(url = '/openIM.wasm') {
        super();
        initDatabaseAPI();
        this.wasmInitializedPromise = initializeWasm(url);
        this.goExitPromise = getGoExitPromsie();
        if (this.goExitPromise) {
            this.goExitPromise
                .then(() => {
                console.info('SDK => wasm exist');
            })
                .catch(err => {
                console.info('SDK => wasm with error ', err);
            })
                .finally(() => {
                this.goExisted = true;
            });
        }
    }
    _invoker(functionName, func, args, processor) {
        return new Promise(async (resolve, reject) => {
            // console.info(
            //   `SDK => [OperationID:${
            //     args[0]
            //   }] (invoked by js) run ${functionName} with args ${JSON.stringify(args)}`
            // );
            let response = {
                operationID: args[0],
            };
            try {
                if (!getGO() || getGO().exited || this.goExisted) {
                    throw 'wasm exist already, fail to run';
                }
                let data = await func(...args);
                if (processor) {
                    // console.info(
                    //   `SDK => [OperationID:${
                    //     args[0]
                    //   }] (invoked by js) run ${functionName} with response before processor ${JSON.stringify(
                    //     data
                    //   )}`
                    // );
                    data = processor(data);
                }
                response.data = data;
                resolve(response);
            }
            catch (error) {
                // console.info(
                //   `SDK => [OperationID:${
                //     args[0]
                //   }] (invoked by js) run ${functionName} with error ${JSON.stringify(
                //     error
                //   )}`
                // );
                response = {
                    ...response,
                    ...error,
                };
                reject(response);
            }
            // console.info(
            //   `SDK => [OperationID:${
            //     args[0]
            //   }] (invoked by js) run ${functionName} with response ${JSON.stringify(
            //     response
            //   )}`
            // );
            // return response as WsResponse;
        });
    }
    async login(params, operationID = uuidv4()) {
        console.info(`SDK => (invoked by js) run login with args ${JSON.stringify({
            params,
            operationID,
        })}`);
        await workerPromise;
        await this.wasmInitializedPromise;
        window.commonEventFunc(event => {
            try {
                console.info('SDK => received event ', event);
                const parsed = JSON.parse(event);
                this.emit(parsed.event, parsed);
            }
            catch (error) {
                console.error(error);
            }
        });
        const config = {
            platform: params.platformID,
            api_addr: params.apiAddress,
            ws_addr: params.wsAddress,
            log_level: params.logLevel || 6,
        };
        window.initSDK(operationID, JSON.stringify(config));
        return await window.login(operationID, params.userID, params.token);
    }
    logout(operationID = uuidv4()) {
        return this._invoker('logout', window.logout, [operationID]);
    }
    getAllConversationList(operationID = uuidv4()) {
        return this._invoker('getAllConversationList', window.getAllConversationList, [operationID]);
    }
    getOneConversation(params, operationID = uuidv4()) {
        return this._invoker('getOneConversation', window.getOneConversation, [
            operationID,
            params.sessionType,
            params.sourceID,
        ]);
    }
    getAdvancedHistoryMessageList = (params, operationID = uuidv4()) => {
        return this._invoker('getAdvancedHistoryMessageList', window.getAdvancedHistoryMessageList, [operationID, JSON.stringify(params)]);
    };
    getHistoryMessageList = (params, operationID = uuidv4()) => {
        return this._invoker('getHistoryMessageList', window.getHistoryMessageList, [operationID, JSON.stringify(params)]);
    }
    getGroupsInfo(params, operationID = uuidv4()) {
        return this._invoker('getGroupsInfo', window.getGroupsInfo, [
            operationID,
            JSON.stringify(params),
        ]);
    }
    deleteConversationFromLocalAndSvr(conversationID, operationID = uuidv4()) {
        return this._invoker('deleteConversationFromLocalAndSvr', window.deleteConversationFromLocalAndSvr, [operationID, conversationID]);
    }
    markC2CMessageAsRead(params, operationID = uuidv4()) {
        return this._invoker('markC2CMessageAsRead', window.markC2CMessageAsRead, [
            operationID,
            params.userID,
            JSON.stringify(params.msgIDList),
        ]);
    }
    markMessageAsReadByConID(params, operationID = uuidv4()) {
        return this._invoker('markMessageAsReadByConID', window.markMessageAsReadByConID, [operationID, params.conversationID, JSON.stringify(params.msgIDList)]);
    }
    markNotifyMessageHasRead(conversationID, operationID = uuidv4()) {
        return this._invoker('markNotifyMessageHasRead', window.markNotifyMessageHasRead, [operationID, conversationID, '[]']);
    }
    getGroupMemberList(params, operationID = uuidv4()) {
        return this._invoker('getGroupMemberList', window.getGroupMemberList, [
            operationID,
            params.groupID,
            params.filter,
            params.offset,
            params.count,
        ]);
    }
    createTextMessage(text, operationID = uuidv4()) {
        return this._invoker('createTextMessage', window.createTextMessage, [operationID, text], data => {
            // compitable with old version sdk
            return data[0];
        });
    }
    createImageMessage(params, operationID = uuidv4()) {
        return this._invoker('createImageMessage', window.createImageMessageByURL, [
            operationID,
            JSON.stringify(params.sourcePicture),
            JSON.stringify(params.bigPicture),
            JSON.stringify(params.snapshotPicture),
        ], data => {
            // compitable with old version sdk
            return data[0];
        });
    }
    createCustomMessage(params, operationID = uuidv4()) {
        return this._invoker('createCustomMessage', window.createCustomMessage, [operationID, params.data, params.extension, params.description], data => {
            // compitable with old version sdk
            return data[0];
        });
    }
    createQuoteMessage(params, operationID = uuidv4()) {
        return this._invoker('createQuoteMessage', window.createQuoteMessage, [operationID, params.text, params.message], data => {
            // compitable with old version sdk
            return data[0];
        });
    }
    createAdvancedQuoteMessage(params, operationID = uuidv4()) {
        return this._invoker('createAdvancedQuoteMessage', window.createAdvancedQuoteMessage, [
            operationID,
            params.text,
            params.message,
            JSON.stringify(params.messageEntityList),
        ], data => {
            // compitable with old version sdk
            return data[0];
        });
    }
    createAdvancedTextMessage(params, operationID = uuidv4()) {
        return this._invoker('createAdvancedTextMessage', window.createAdvancedTextMessage, [operationID, params.text, JSON.stringify(params.messageEntityList)], data => {
            // compitable with old version sdk
            return data[0];
        });
    }
    sendMessage(params, operationID = uuidv4()) {
        const offlinePushInfo = params.offlinePushInfo ?? {
            title: '你有一条新消息',
            desc: '',
            ex: '',
            iOSPushSound: '+1',
            iOSBadgeCount: true,
        };
        return this._invoker('sendMessage', window.sendMessage, [
            operationID,
            params.message,
            params.recvID,
            params.groupID,
            JSON.stringify(offlinePushInfo),
        ]);
    }
    sendMessageNotOss(params, operationID = uuidv4()) {
        const offlinePushInfo = params.offlinePushInfo ?? {
            title: '你有一条新消息',
            desc: '',
            ex: '',
            iOSPushSound: '+1',
            iOSBadgeCount: true,
        };
        return this._invoker('sendMessageNotOss', window.sendMessageNotOss, [
            operationID,
            params.message,
            params.recvID,
            params.groupID,
            JSON.stringify(offlinePushInfo),
        ]);
    }
    sendMessageByBuffer(params, operationID = uuidv4()) {
        const offlinePushInfo = params.offlinePushInfo ?? {
            title: '你有一条新消息',
            desc: '',
            ex: '',
            iOSPushSound: '+1',
            iOSBadgeCount: true,
        };
        return this._invoker('sendMessageByBuffer', window.sendMessageByBuffer, [
            operationID,
            params.message,
            params.recvID,
            params.groupID,
            JSON.stringify(offlinePushInfo),
            params.fileArrayBuffer,
            params.snpFileArrayBuffer,
        ]);
    }
    exportDB(operationID = uuidv4()) {
        return this._invoker('exportDB', window.exportDB, [operationID]);
    }
    getHistoryMessageListReverse(params, operationID = uuidv4()) {
        return this._invoker('getHistoryMessageListReverse', window.getHistoryMessageListReverse, [operationID, JSON.stringify(params)]);
    }
    revokeMessage(params, operationID = uuidv4()) {
        return this._invoker('revokeMessage', window.revokeMessage, [
            operationID,
            params,
        ]);
    }
    setOneConversationPrivateChat(params, operationID = uuidv4()) {
        return this._invoker('setOneConversationPrivateChat', window.setOneConversationPrivateChat, [operationID, params.conversationID, params.isPrivate]);
    }
    /* ----------------------------------------------新增-------------------------------------------------------- */
    getLoginStatus(operationID = uuidv4()) {
        return this._invoker('getLoginStatus', window.getLoginStatus, [operationID], data => {
            // compitable with old version sdk
            return data[0];
        });
    }
    // iLogin(data: LoginParams, operationID = uuidv4()) {
    //   return this._invoker('iLogin', window.iLogin, [
    //     operationID,
    //     data.token,
    //     data.userID,
    //   ]);
    // }
    getLoginUser(operationID = uuidv4()) {
        return this._invoker('getLoginUser', window.getLoginUser, [operationID]);
    }
    getSelfUserInfo(operationID = uuidv4()) {
        return this._invoker('getSelfUserInfo', window.getSelfUserInfo, [
            operationID,
        ]);
    }
    getUsersInfo(data, operationID = uuidv4()) {
        return this._invoker('getUsersInfo', window.getUsersInfo, [
            operationID,
            JSON.stringify(data),
        ]);
    }
    setSelfInfo(data, operationID = uuidv4()) {
        return this._invoker('setSelfInfo', window.setSelfInfo, [
            operationID,
            JSON.stringify(data),
        ]);
    }
    createTextAtMessage(data, operationID = uuidv4()) {
        return this._invoker('createTextAtMessage', window.createTextAtMessage, [
            operationID,
            data.text,
            JSON.stringify(data.atUserIDList),
            JSON.stringify(data.atUsersInfo),
            data.message,
        ], data => {
            // compitable with old version sdk
            return data[0];
        });
    }
    createSoundMessage(data, operationID = uuidv4()) {
        return this._invoker('createSoundMessage', window.createSoundMessageByURL, [operationID, JSON.stringify(data)], data => {
            // compitable with old version sdk
            return data[0];
        });
    }
    createVideoMessage(data, operationID = uuidv4()) {
        return this._invoker('createVideoMessage', window.createVideoMessageByURL, [operationID, JSON.stringify(data)], data => {
            // compitable with old version sdk
            return data[0];
        });
    }
    createFileMessage(data, operationID = uuidv4()) {
        return this._invoker('createFileMessage', window.createFileMessageByURL, [operationID, JSON.stringify(data)], data => {
            // compitable with old version sdk
            return data[0];
        });
    }
    createFileMessageFromFullPath(data, operationID = uuidv4()) {
        return this._invoker('createFileMessageFromFullPath', window.createFileMessageFromFullPath, [operationID, data.fileFullPath, data.fileName], data => {
            // compitable with old version sdk
            return data[0];
        });
    }
    createImageMessageFromFullPath(data, operationID = uuidv4()) {
        return this._invoker('createImageMessageFromFullPath ', window.createImageMessageFromFullPath, [operationID, data], data => {
            // compitable with old version sdk
            return data[0];
        });
    }
    createSoundMessageFromFullPath(data, operationID = uuidv4()) {
        return this._invoker('createSoundMessageFromFullPath ', window.createSoundMessageFromFullPath, [operationID, data.soundPath, data.duration], data => {
            // compitable with old version sdk
            return data[0];
        });
    }
    createVideoMessageFromFullPath(data, operationID = uuidv4()) {
        return this._invoker('createVideoMessageFromFullPath ', window.createVideoMessageFromFullPath, [
            operationID,
            data.videoFullPath,
            data.videoType,
            data.duration,
            data.snapshotFullPath,
        ], data => {
            // compitable with old version sdk
            return data[0];
        });
    }
    createMergerMessage(data, operationID = uuidv4()) {
        return this._invoker('createMergerMessage ', window.createMergerMessage, [
            operationID,
            JSON.stringify(data.messageList),
            data.title,
            JSON.stringify(data.summaryList),
        ], data => {
            // compitable with old version sdk
            return data[0];
        });
    }
    createForwardMessage(data, operationID = uuidv4()) {
        return this._invoker('createForwardMessage ', window.createForwardMessage, [operationID, data], data => {
            // compitable with old version sdk
            return data[0];
        });
    }
    createFaceMessage(data, operationID = uuidv4()) {
        return this._invoker('createFaceMessage ', window.createFaceMessage, [operationID, data.index, data.data], data => {
            // compitable with old version sdk
            return data[0];
        });
    }
    createLocationMessage(data, operationID = uuidv4()) {
        return this._invoker('createLocationMessage ', window.createLocationMessage, [operationID, data.description, data.longitude, data.latitude], data => {
            // compitable with old version sdk
            return data[0];
        });
    }
    createCardMessage(data, operationID = uuidv4()) {
        return this._invoker('createCardMessage ', window.createCardMessage, [operationID, data], data => {
            // compitable with old version sdk
            return data[0];
        });
    }
    deleteMessageFromLocalStorage(data, operationID = uuidv4()) {
        return this._invoker('deleteMessageFromLocalStorage ', window.deleteMessageFromLocalStorage, [operationID, data]);
    }
    deleteMessageFromLocalAndSvr(data, operationID = uuidv4()) {
        return this._invoker('deleteMessageFromLocalAndSvr ', window.deleteMessageFromLocalAndSvr, [operationID, data]);
    }
    deleteAllConversationFromLocal(operationID = uuidv4()) {
        return this._invoker('deleteAllConversationFromLocal ', window.deleteAllConversationFromLocal, [operationID]);
    }
    deleteAllMsgFromLocal(operationID = uuidv4()) {
        return this._invoker('deleteAllMsgFromLocal ', window.deleteAllMsgFromLocal, [operationID]);
    }
    deleteAllMsgFromLocalAndSvr(operationID = uuidv4()) {
        return this._invoker('deleteAllMsgFromLocalAndSvr ', window.deleteAllMsgFromLocalAndSvr, [operationID]);
    }
    markGroupMessageHasRead(data, operationID = uuidv4()) {
        return this._invoker('markGroupMessageHasRead ', window.markGroupMessageHasRead, [operationID, data]);
    }
    markGroupMessageAsRead(data, operationID = uuidv4()) {
        return this._invoker('markGroupMessageAsRead ', window.markGroupMessageAsRead, [operationID, data.groupID, JSON.stringify(data.msgIDList)]);
    }
    insertSingleMessageToLocalStorage(data, operationID = uuidv4()) {
        return this._invoker('insertSingleMessageToLocalStorage ', window.insertSingleMessageToLocalStorage, [operationID, data.message, data.recvID, data.sendID]);
    }
    insertGroupMessageToLocalStorage(data, operationID = uuidv4()) {
        return this._invoker('insertGroupMessageToLocalStorage ', window.insertGroupMessageToLocalStorage, [operationID, data.message, data.groupID, data.sendID]);
    }
    typingStatusUpdate(data, operationID = uuidv4()) {
        return this._invoker('typingStatusUpdate ', window.typingStatusUpdate, [
            operationID,
            data.recvID,
            data.msgTip,
        ]);
    }
    clearC2CHistoryMessage(data, operationID = uuidv4()) {
        return this._invoker('clearC2CHistoryMessage ', window.clearC2CHistoryMessage, [operationID, data]);
    }
    clearC2CHistoryMessageFromLocalAndSvr(data, operationID = uuidv4()) {
        return this._invoker('clearC2CHistoryMessageFromLocalAndSvr ', window.clearC2CHistoryMessageFromLocalAndSvr, [operationID, data]);
    }
    clearGroupHistoryMessage(data, operationID = uuidv4()) {
        return this._invoker('clearGroupHistoryMessage ', window.clearGroupHistoryMessage, [operationID, data]);
    }
    clearGroupHistoryMessageFromLocalAndSvr(data, operationID = uuidv4()) {
        return this._invoker('clearGroupHistoryMessageFromLocalAndSvr ', window.clearGroupHistoryMessageFromLocalAndSvr, [operationID, data]);
    }
    getConversationListSplit(data, operationID = uuidv4()) {
        return this._invoker('getConversationListSplit ', window.getConversationListSplit, [operationID, data.offset, data.count]);
    }
    getConversationIDBySessionType(data, operationID = uuidv4()) {
        return this._invoker('getConversationIDBySessionType ', window.getConversationIDBySessionType, [operationID, data.sourceID, data.sessionType]);
    }
    getMultipleConversation(data, operationID = uuidv4()) {
        return this._invoker('getMultipleConversation ', window.getMultipleConversation, [operationID, JSON.stringify(data)]);
    }
    deleteConversation(data, operationID = uuidv4()) {
        return this._invoker('deleteConversation ', window.deleteConversation, [
            operationID,
            data,
        ]);
    }
    setConversationDraft(data, operationID = uuidv4()) {
        return this._invoker('setConversationDraft ', window.setConversationDraft, [
            operationID,
            data.conversationID,
        ]);
    }
    pinConversation(data, operationID = uuidv4()) {
        return this._invoker('pinConversation ', window.pinConversation, [
            operationID,
            data.conversationID,
            data.isPinned,
        ]);
    }
    getTotalUnreadMsgCount(operationID = uuidv4()) {
        return this._invoker('getTotalUnreadMsgCount ', window.getTotalUnreadMsgCount, [operationID]);
    }
    getConversationRecvMessageOpt(data, operationID = uuidv4()) {
        return this._invoker('getConversationRecvMessageOpt ', window.getConversationRecvMessageOpt, [operationID, JSON.stringify(data)]);
    }
    setConversationRecvMessageOpt(data, operationID = uuidv4()) {
        return this._invoker('setConversationRecvMessageOpt ', window.setConversationRecvMessageOpt, [operationID, JSON.stringify(data.conversationIDList), data.opt]);
    }
    searchLocalMessages(data, operationID = uuidv4()) {
        return this._invoker('searchLocalMessages ', window.searchLocalMessages, [
            operationID,
            JSON.stringify(data),
        ]);
    }
    addFriend(data, operationID = uuidv4()) {
        return this._invoker('addFriend ', window.addFriend, [
            operationID,
            JSON.stringify(data),
        ]);
    }
    searchFriends(data, operationID = uuidv4()) {
        return this._invoker('searchFriends ', window.searchFriends, [
            operationID,
            JSON.stringify(data),
        ]);
    }
    getDesignatedFriendsInfo(data, operationID = uuidv4()) {
        return this._invoker('getDesignatedFriendsInfo ', window.getDesignatedFriendsInfo, [operationID, JSON.stringify(data)]);
    }
    getRecvFriendApplicationList(operationID = uuidv4()) {
        return this._invoker('getRecvFriendApplicationList ', window.getRecvFriendApplicationList, [operationID]);
    }
    getSendFriendApplicationList(operationID = uuidv4()) {
        return this._invoker('getSendFriendApplicationList ', window.getSendFriendApplicationList, [operationID]);
    }
    getFriendList(operationID = uuidv4()) {
        return this._invoker('getFriendList ', window.getFriendList, [operationID]);
    }
    setFriendRemark(data, operationID = uuidv4()) {
        return this._invoker('setFriendRemark ', window.setFriendRemark, [
            operationID,
            JSON.stringify(data),
        ]);
    }
    checkFriend(data, operationID = uuidv4()) {
        return this._invoker('checkFriend', window.checkFriend, [
            operationID,
            JSON.stringify(data),
        ]);
    }
    acceptFriendApplication(data, operationID = uuidv4()) {
        return this._invoker('acceptFriendApplication', window.acceptFriendApplication, [operationID, JSON.stringify(data)]);
    }
    refuseFriendApplication(data, operationID = uuidv4()) {
        return this._invoker('refuseFriendApplication ', window.refuseFriendApplication, [operationID, JSON.stringify(data)]);
    }
    deleteFriend(data, operationID = uuidv4()) {
        return this._invoker('deleteFriend ', window.deleteFriend, [
            operationID,
            data,
        ]);
    }
    addBlack(data, operationID = uuidv4()) {
        return this._invoker('addBlack ', window.addBlack, [operationID, data]);
    }
    removeBlack(data, operationID = uuidv4()) {
        return this._invoker('removeBlack ', window.removeBlack, [
            operationID,
            data,
        ]);
    }
    getBlackList(operationID = uuidv4()) {
        return this._invoker('getBlackList ', window.getBlackList, [operationID]);
    }
    inviteUserToGroup(data, operationID = uuidv4()) {
        return this._invoker('inviteUserToGroup ', window.inviteUserToGroup, [
            operationID,
            data.groupID,
            data.reason,
            JSON.stringify(data.userIDList),
        ]);
    }
    kickGroupMember(data, operationID = uuidv4()) {
        return this._invoker('kickGroupMember ', window.kickGroupMember, [
            operationID,
            data.groupID,
            data.reason,
            JSON.stringify(data.userIDList),
        ]);
    }
    /* 、、、、、、、、、、、、、、、、周一问 */
    getGroupMembersInfo(data, operationID = uuidv4()) {
        return this._invoker('getGroupMembersInfo ', window.getGroupMembersInfo, [
            operationID,
            data.groupID,
            JSON.stringify(data.userIDList),
        ]);
    }
    getGroupMemberListByJoinTimeFilter(data, operationID = uuidv4()) {
        return this._invoker('getGroupMemberListByJoinTimeFilter ', window.getGroupMemberListByJoinTimeFilter, [
            operationID,
            data.groupID,
            data.offset,
            data.count,
            data.joinTimeBegin,
            data.joinTimeEnd,
            JSON.stringify(data.filterUserIDList),
        ]);
    }
    searchGroupMembers(data, operationID = uuidv4()) {
        return this._invoker('searchGroupMembers ', window.searchGroupMembers, [
            operationID,
            JSON.stringify(data),
        ]);
    }
    setGroupApplyMemberFriend(data, operationID = uuidv4()) {
        return this._invoker('setGroupApplyMemberFriend ', window.setGroupApplyMemberFriend, [operationID, data.groupID, data.rule]);
    }
    setGroupLookMemberInfo(data, operationID = uuidv4()) {
        return this._invoker('setGroupLookMemberInfo ', window.setGroupLookMemberInfo, [operationID, data.groupID, data.rule]);
    }
    getJoinedGroupList(operationID = uuidv4()) {
        return this._invoker('getJoinedGroupList ', window.getJoinedGroupList, [
            operationID,
        ]);
    }
    createGroup(data, operationID = uuidv4()) {
        return this._invoker('createGroup ', window.createGroup, [
            operationID,
            JSON.stringify(data.groupBaseInfo),
            JSON.stringify(data.memberList),
        ]);
    }
    setGroupInfo(data, operationID = uuidv4()) {
        return this._invoker('setGroupInfo ', window.setGroupInfo, [
            operationID,
            data.groupID,
            JSON.stringify(data.groupInfo),
        ]);
    }
    setGroupMemberNickname(data, operationID = uuidv4()) {
        return this._invoker('setGroupMemberNickname ', window.setGroupMemberNickname, [operationID, data.groupID, data.userID, data.GroupMemberNickname]);
    }
    joinGroup(data, operationID = uuidv4()) {
        return this._invoker('joinGroup ', window.joinGroup, [
            operationID,
            data.groupID,
            data.reqMsg,
            data.joinSource,
        ]);
    }
    searchGroups(data, operationID = uuidv4()) {
        return this._invoker('searchGroups ', window.searchGroups, [
            operationID,
            JSON.stringify(data),
        ]);
    }
    quitGroup(data, operationID = uuidv4()) {
        return this._invoker('quitGroup ', window.quitGroup, [operationID, data]);
    }
    dismissGroup(data, operationID = uuidv4()) {
        return this._invoker('dismissGroup ', window.dismissGroup, [
            operationID,
            data,
        ]);
    }
    changeGroupMute(data, operationID = uuidv4()) {
        return this._invoker('changeGroupMute ', window.changeGroupMute, [
            operationID,
            data.groupID,
            data.isMute,
        ]);
    }
    changeGroupMemberMute(data, operationID = uuidv4()) {
        return this._invoker('changeGroupMemberMute ', window.changeGroupMemberMute, [operationID, data.groupID, data.userID, data.mutedSeconds]);
    }
    transferGroupOwner(data, operationID = uuidv4()) {
        return this._invoker('transferGroupOwner ', window.transferGroupOwner, [
            operationID,
            data.groupID,
            data.newOwnerUserID,
        ]);
    }
    getSendGroupApplicationList(operationID = uuidv4()) {
        return this._invoker('getSendGroupApplicationList ', window.getSendGroupApplicationList, [operationID]);
    }
    getRecvGroupApplicationList(operationID = uuidv4()) {
        return this._invoker('getRecvGroupApplicationList ', window.getRecvGroupApplicationList, [operationID]);
    }
    acceptGroupApplication(data, operationID = uuidv4()) {
        return this._invoker('acceptGroupApplication ', window.acceptGroupApplication, [operationID, data.groupID, data.fromUserID, data.handleMsg]);
    }
    refuseGroupApplication(data, operationID = uuidv4()) {
        return this._invoker('refuseGroupApplication ', window.refuseGroupApplication, [operationID, data.groupID, data.fromUserID, data.handleMsg]);
    }
    signalingInvite(data, operationID = uuidv4()) {
        return this._invoker('signalingInvite ', window.signalingInvite, [
            operationID,
            JSON.stringify({ invitation: data }),
        ]);
    }
    signalingInviteInGroup(data, operationID = uuidv4()) {
        return this._invoker('signalingInviteInGroup ', window.signalingInviteInGroup, [operationID, JSON.stringify({ invitation: data })]);
    }
    signalingAccept(data, operationID = uuidv4()) {
        return this._invoker('signalingAccept ', window.signalingAccept, [
            operationID,
            JSON.stringify(data),
        ]);
    }
    signalingReject(data, operationID = uuidv4()) {
        return this._invoker('signalingReject ', window.signalingReject, [
            operationID,
            JSON.stringify(data),
        ]);
    }
    signalingCancel(data, operationID = uuidv4()) {
        return this._invoker('signalingCancel ', window.signalingCancel, [
            operationID,
            JSON.stringify(data),
        ]);
    }
    signalingHungUp(data, operationID = uuidv4()) {
        return this._invoker('signalingHungUp ', window.signalingHungUp, [
            operationID,
            JSON.stringify(data),
        ]);
    }
    getSubDepartment(data, operationID = uuidv4()) {
        return this._invoker('getSubDepartment ', window.getSubDepartment, [
            operationID,
            data.departmentID,
            data.offset,
            data.count,
        ]);
    }
    getDepartmentMember(data, operationID = uuidv4()) {
        return this._invoker('getDepartmentMember ', window.getDepartmentMember, [
            operationID,
            data.departmentID,
            data.offset,
            data.count,
        ]);
    }
    getUserInDepartment(userID, operationID = uuidv4()) {
        return this._invoker('getUserInDepartment ', window.getUserInDepartment, [
            operationID,
            userID,
        ]);
    }
    getDepartmentMemberAndSubDepartment(departmentID, operationID = uuidv4()) {
        return this._invoker('getDepartmentMemberAndSubDepartment ', window.getDepartmentMemberAndSubDepartment, [operationID, departmentID]);
    }
    getDepartmentInfo(departmentID, operationID = uuidv4()) {
        return this._invoker('getDepartmentInfo ', window.getDepartmentInfo, [
            operationID,
            departmentID,
        ]);
    }
    searchOrganization(data, operationID = uuidv4()) {
        return this._invoker('searchOrganization ', window.searchOrganization, [
            operationID,
            JSON.stringify(data.input),
            data.offset,
            data.count,
        ]);
    }
    resetConversationGroupAtType(data, operationID = uuidv4()) {
        return this._invoker('resetConversationGroupAtType ', window.resetConversationGroupAtType, [operationID, data]);
    }
    setGroupMemberRoleLevel(data, operationID = uuidv4()) {
        return this._invoker('setGroupMemberRoleLevel ', window.setGroupMemberRoleLevel, [operationID, data.groupID, data.userID, data.roleLevel]);
    }
    setGroupVerification(data, operationID = uuidv4()) {
        return this._invoker('setGroupVerification ', window.setGroupVerification, [
            operationID,
            data.groupID,
            data.verification,
        ]);
    }
    setGlobalRecvMessageOpt(data, operationID = uuidv4()) {
        return this._invoker('setGlobalRecvMessageOpt ', window.setGlobalRecvMessageOpt, [operationID, data.opt]);
    }
    newRevokeMessage(data, operationID = uuidv4()) {
        return this._invoker('newRevokeMessage ', window.newRevokeMessage, [
            operationID,
            data,
        ]);
    }
    findMessageList(data, operationID = uuidv4()) {
        return this._invoker('findMessageList ', window.findMessageList, [
            operationID,
            JSON.stringify(data),
        ]);
    }
}
let instance;
export function getSDK(url = '/openIM.wasm') {
    if (typeof window === 'undefined') {
        return {};
    }
    if (instance) {
        return instance;
    }
    instance = new SDK(url);
    return instance;
}
