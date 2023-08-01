import { fileMapClear, fileMapSet, initDatabaseAPI, workerPromise, } from '../api';
import Emitter from '../utils/emitter';
import { v4 as uuidv4 } from 'uuid';
import { getGO, initializeWasm, getGoExitPromsie } from './initialize';
import { logBoxStyleValue } from '../utils';
class SDK extends Emitter {
    wasmInitializedPromise;
    goExitPromise;
    goExisted = false;
    tryParse = true;
    isLogStandardOutput = true;
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
    _logWrap(...args) {
        if (this.isLogStandardOutput) {
            console.info(...args);
        }
    }
    _invoker(functionName, func, args, processor) {
        return new Promise(async (resolve, reject) => {
            this._logWrap(`%cSDK =>%c [OperationID:${args[0]}] (invoked by js) run ${functionName} with args ${JSON.stringify(args)}`, 'font-size:14px; background:#7CAEFF; border-radius:4px; padding-inline:4px;', '');
            let response = {
                operationID: args[0],
                event: (functionName.slice(0, 1).toUpperCase() +
                    functionName.slice(1).toLowerCase()),
            };
            try {
                if (!getGO() || getGO().exited || this.goExisted) {
                    throw 'wasm exist already, fail to run';
                }
                let data = await func(...args);
                if (processor) {
                    this._logWrap(`%cSDK =>%c [OperationID:${args[0]}] (invoked by js) run ${functionName} with response before processor ${JSON.stringify(data)}`, logBoxStyleValue('#FFDC19'), '');
                    data = processor(data);
                }
                if (this.tryParse) {
                    try {
                        data = JSON.parse(data);
                    }
                    catch (error) {
                        console.log('SDK => parse error ', error);
                    }
                }
                response.data = data;
                resolve(response);
            }
            catch (error) {
                this._logWrap(`%cSDK =>%c [OperationID:${args[0]}] (invoked by js) run ${functionName} with error ${JSON.stringify(error)}`, logBoxStyleValue('#EE4245'), '');
                response = {
                    ...response,
                    ...error,
                };
                reject(response);
            }
        });
    }
    login = async (params, operationID = uuidv4()) => {
        this._logWrap(`SDK => (invoked by js) run login with args ${JSON.stringify({
            params,
            operationID,
        })}`);
        await workerPromise;
        await this.wasmInitializedPromise;
        window.commonEventFunc(event => {
            try {
                console.info(`%cSDK =>%c received event %c${event}%c `, logBoxStyleValue('#282828', '#ffffff'), '', 'color: #4f2398;', '');
                const parsed = JSON.parse(event);
                if (this.tryParse) {
                    try {
                        parsed.data = JSON.parse(parsed.data);
                    }
                    catch (error) {
                        console.log('SDK => parse error ', error);
                    }
                }
                this.emit(parsed.event, parsed);
            }
            catch (error) {
                console.error(error);
            }
        });
        const config = {
            platformID: params.platformID,
            apiAddr: params.apiAddr,
            wsAddr: params.wsAddr,
            dataDir: './',
            logLevel: params.logLevel || 5,
            isLogStandardOutput: params.isLogStandardOutput || true,
            logFilePath: './',
            isExternalExtensions: params.isExternalExtensions || false,
        };
        this.tryParse = params.tryParse ?? true;
        this.isLogStandardOutput = config.isLogStandardOutput;
        window.initSDK(operationID, JSON.stringify(config));
        return await window.login(operationID, params.userID, params.token);
    };
    logout = (operationID = uuidv4()) => {
        fileMapClear();
        return this._invoker('logout', window.logout, [operationID]);
    };
    getAllConversationList = (operationID = uuidv4()) => {
        return this._invoker('getAllConversationList', window.getAllConversationList, [operationID]);
    };
    getOneConversation = (params, operationID = uuidv4()) => {
        return this._invoker('getOneConversation', window.getOneConversation, [operationID, params.sessionType, params.sourceID]);
    };
    getAdvancedHistoryMessageList = (params, operationID = uuidv4()) => {
        return this._invoker('getAdvancedHistoryMessageList', window.getAdvancedHistoryMessageList, [operationID, JSON.stringify(params)]);
    };
    getAdvancedHistoryMessageListReverse = (params, operationID = uuidv4()) => {
        return this._invoker('getAdvancedHistoryMessageListReverse', window.getAdvancedHistoryMessageListReverse, [operationID, JSON.stringify(params)]);
    };
    getSpecifiedGroupsInfo = (params, operationID = uuidv4()) => {
        return this._invoker('getSpecifiedGroupsInfo', window.getSpecifiedGroupsInfo, [operationID, JSON.stringify(params)]);
    };
    deleteConversationAndDeleteAllMsg = (conversationID, operationID = uuidv4()) => {
        return this._invoker('deleteConversationAndDeleteAllMsg', window.deleteConversationAndDeleteAllMsg, [operationID, conversationID]);
    };
    markConversationMessageAsRead = (data, operationID = uuidv4()) => {
        return this._invoker('markConversationMessageAsRead', window.markConversationMessageAsRead, [operationID, data]);
    };
    markMessagesAsReadByMsgID = (params, operationID = uuidv4()) => {
        return this._invoker('markMessagesAsReadByMsgID', window.markMessagesAsReadByMsgID, [
            operationID,
            params.conversationID,
            JSON.stringify(params.clientMsgIDList),
        ]);
    };
    getGroupMemberList = (params, operationID = uuidv4()) => {
        return this._invoker('getGroupMemberList', window.getGroupMemberList, [operationID, params.groupID, params.filter, params.offset, params.count]);
    };
    createTextMessage = (text, operationID = uuidv4()) => {
        return this._invoker('createTextMessage', window.createTextMessage, [operationID, text], data => {
            // compitable with old version sdk
            return data[0];
        });
    };
    createImageMessage = (params, operationID = uuidv4()) => {
        return this._invoker('createImageMessage', window.createImageMessageByURL, [
            operationID,
            JSON.stringify(params.sourcePicture),
            JSON.stringify(params.bigPicture),
            JSON.stringify(params.snapshotPicture),
        ], data => {
            // compitable with old version sdk
            return data[0];
        });
    };
    createImageMessageByFile = (params, operationID = uuidv4()) => {
        fileMapSet(params.sourcePicture.uuid, params.file);
        return this._invoker('createImageMessageByFile', window.createImageMessageByURL, [
            operationID,
            JSON.stringify(params.sourcePicture),
            JSON.stringify(params.bigPicture),
            JSON.stringify(params.snapshotPicture),
        ], data => {
            // compitable with old version sdk
            return data[0];
        });
    };
    createCustomMessage = (params, operationID = uuidv4()) => {
        return this._invoker('createCustomMessage', window.createCustomMessage, [operationID, params.data, params.extension, params.description], data => {
            // compitable with old version sdk
            return data[0];
        });
    };
    createQuoteMessage = (params, operationID = uuidv4()) => {
        return this._invoker('createQuoteMessage', window.createQuoteMessage, [operationID, params.text, params.message], data => {
            // compitable with old version sdk
            return data[0];
        });
    };
    createAdvancedQuoteMessage = (params, operationID = uuidv4()) => {
        return this._invoker('createAdvancedQuoteMessage', window.createAdvancedQuoteMessage, [
            operationID,
            params.text,
            JSON.stringify(params.message),
            JSON.stringify(params.messageEntityList),
        ], data => {
            // compitable with old version sdk
            return data[0];
        });
    };
    createAdvancedTextMessage = (params, operationID = uuidv4()) => {
        return this._invoker('createAdvancedTextMessage', window.createAdvancedTextMessage, [operationID, params.text, JSON.stringify(params.messageEntityList)], data => {
            // compitable with old version sdk
            return data[0];
        });
    };
    sendMessage = (params, operationID = uuidv4()) => {
        const offlinePushInfo = params.offlinePushInfo ?? {
            title: '你有一条新消息',
            desc: '',
            ex: '',
            iOSPushSound: '+1',
            iOSBadgeCount: true,
        };
        return this._invoker('sendMessage', window.sendMessage, [
            operationID,
            JSON.stringify(params.message),
            params.recvID,
            params.groupID,
            JSON.stringify(offlinePushInfo),
        ]);
    };
    sendMessageNotOss = (params, operationID = uuidv4()) => {
        const offlinePushInfo = params.offlinePushInfo ?? {
            title: '你有一条新消息',
            desc: '',
            ex: '',
            iOSPushSound: '+1',
            iOSBadgeCount: true,
        };
        return this._invoker('sendMessageNotOss', window.sendMessageNotOss, [
            operationID,
            JSON.stringify(params.message),
            params.recvID,
            params.groupID,
            JSON.stringify(offlinePushInfo),
        ]);
    };
    sendMessageByBuffer = (params, operationID = uuidv4()) => {
        const offlinePushInfo = params.offlinePushInfo ?? {
            title: '你有一条新消息',
            desc: '',
            ex: '',
            iOSPushSound: '+1',
            iOSBadgeCount: true,
        };
        return this._invoker('sendMessageByBuffer', window.sendMessageByBuffer, [
            operationID,
            JSON.stringify(params.message),
            params.recvID,
            params.groupID,
            JSON.stringify(offlinePushInfo),
            params.fileArrayBuffer,
            params.snpFileArrayBuffer,
        ]);
    };
    setMessageLocalEx = (params, operationID = uuidv4()) => {
        return this._invoker('setMessageLocalEx', window.setMessageLocalEx, [
            operationID,
            params.conversationID,
            params.clientMsgID,
            params.localEx,
        ]);
    };
    exportDB(operationID = uuidv4()) {
        return this._invoker('exportDB', window.exportDB, [operationID]);
    }
    getHistoryMessageListReverse = (params, operationID = uuidv4()) => {
        return this._invoker('getHistoryMessageListReverse', window.getHistoryMessageListReverse, [operationID, JSON.stringify(params)]);
    };
    revokeMessage = (data, operationID = uuidv4()) => {
        return this._invoker('revokeMessage', window.revokeMessage, [
            operationID,
            data.conversationID,
            data.clientMsgID,
        ]);
    };
    setConversationPrivateChat = (params, operationID = uuidv4()) => {
        return this._invoker('setConversationPrivateChat', window.setConversationPrivateChat, [operationID, params.conversationID, params.isPrivate]);
    };
    setConversationBurnDuration = (params, operationID = uuidv4()) => {
        return this._invoker('setConversationBurnDuration', window.setConversationBurnDuration, [operationID, params.conversationID, params.burnDuration]);
    };
    getLoginStatus = (operationID = uuidv4()) => {
        return this._invoker('getLoginStatus', window.getLoginStatus, [operationID], data => {
            // compitable with old version sdk
            return data[0];
        });
    };
    setAppBackgroundStatus = (data, operationID = uuidv4()) => {
        return this._invoker('setAppBackgroundStatus', window.setAppBackgroundStatus, [operationID, data]);
    };
    networkStatusChanged = (operationID = uuidv4()) => {
        return this._invoker('networkStatusChanged ', window.networkStatusChanged, [operationID]);
    };
    getLoginUser = (operationID = uuidv4()) => {
        return this._invoker('getLoginUser', window.getLoginUser, [
            operationID,
        ]);
    };
    getSelfUserInfo = (operationID = uuidv4()) => {
        return this._invoker('getSelfUserInfo', window.getSelfUserInfo, [operationID]);
    };
    getUsersInfo = (data, operationID = uuidv4()) => {
        return this._invoker('getUsersInfo', window.getUsersInfo, [
            operationID,
            JSON.stringify(data),
        ]);
    };
    setSelfInfo = (data, operationID = uuidv4()) => {
        return this._invoker('setSelfInfo', window.setSelfInfo, [
            operationID,
            JSON.stringify(data),
        ]);
    };
    createTextAtMessage = (data, operationID = uuidv4()) => {
        return this._invoker('createTextAtMessage', window.createTextAtMessage, [
            operationID,
            data.text,
            JSON.stringify(data.atUserIDList),
            JSON.stringify(data.atUsersInfo),
            JSON.stringify(data.message) ?? '',
        ], data => {
            // compitable with old version sdk
            return data[0];
        });
    };
    createSoundMessage = (data, operationID = uuidv4()) => {
        return this._invoker('createSoundMessage', window.createSoundMessageByURL, [operationID, JSON.stringify(data)], data => {
            // compitable with old version sdk
            return data[0];
        });
    };
    createSoundMessageByFile = (data, operationID = uuidv4()) => {
        fileMapSet(data.uuid, data.file);
        return this._invoker('createSoundMessageByFile', window.createSoundMessageByURL, [operationID, JSON.stringify(data)], data => {
            // compitable with old version sdk
            return data[0];
        });
    };
    createVideoMessage = (data, operationID = uuidv4()) => {
        return this._invoker('createVideoMessage', window.createVideoMessageByURL, [operationID, JSON.stringify(data)], data => {
            // compitable with old version sdk
            return data[0];
        });
    };
    createVideoMessageByFile = (data, operationID = uuidv4()) => {
        fileMapSet(data.videoUUID, data.videoFile);
        fileMapSet(data.snapshotUUID, data.snapFile);
        return this._invoker('createVideoMessageByFile', window.createVideoMessageByURL, [operationID, JSON.stringify(data)], data => {
            // compitable with old version sdk
            return data[0];
        });
    };
    createFileMessage = (data, operationID = uuidv4()) => {
        return this._invoker('createFileMessage', window.createFileMessageByURL, [operationID, JSON.stringify(data)], data => {
            // compitable with old version sdk
            return data[0];
        });
    };
    createFileMessageByFile = (data, operationID = uuidv4()) => {
        fileMapSet(data.uuid, data.file);
        return this._invoker('createFileMessageByFile', window.createFileMessageByURL, [operationID, JSON.stringify(data)], data => {
            // compitable with old version sdk
            return data[0];
        });
    };
    createFileMessageFromFullPath = (data, operationID = uuidv4()) => {
        return this._invoker('createFileMessageFromFullPath', window.createFileMessageFromFullPath, [operationID, data.fileFullPath, data.fileName], data => {
            // compitable with old version sdk
            return data[0];
        });
    };
    createImageMessageFromFullPath = (data, operationID = uuidv4()) => {
        return this._invoker('createImageMessageFromFullPath ', window.createImageMessageFromFullPath, [operationID, data], data => {
            // compitable with old version sdk
            return data[0];
        });
    };
    createSoundMessageFromFullPath = (data, operationID = uuidv4()) => {
        return this._invoker('createSoundMessageFromFullPath ', window.createSoundMessageFromFullPath, [operationID, data.soundPath, data.duration], data => {
            // compitable with old version sdk
            return data[0];
        });
    };
    createVideoMessageFromFullPath = (data, operationID = uuidv4()) => {
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
    };
    createMergerMessage = (data, operationID = uuidv4()) => {
        return this._invoker('createMergerMessage ', window.createMergerMessage, [
            operationID,
            JSON.stringify(data.messageList),
            data.title,
            JSON.stringify(data.summaryList),
        ], data => {
            // compitable with old version sdk
            return data[0];
        });
    };
    createForwardMessage = (data, operationID = uuidv4()) => {
        return this._invoker('createForwardMessage ', window.createForwardMessage, [operationID, JSON.stringify(data)], data => {
            // compitable with old version sdk
            return data[0];
        });
    };
    createFaceMessage = (data, operationID = uuidv4()) => {
        return this._invoker('createFaceMessage ', window.createFaceMessage, [operationID, data.index, data.data], data => {
            // compitable with old version sdk
            return data[0];
        });
    };
    createLocationMessage = (data, operationID = uuidv4()) => {
        return this._invoker('createLocationMessage ', window.createLocationMessage, [operationID, data.description, data.longitude, data.latitude], data => {
            // compitable with old version sdk
            return data[0];
        });
    };
    createCardMessage = (data, operationID = uuidv4()) => {
        return this._invoker('createCardMessage ', window.createCardMessage, [operationID, JSON.stringify(data)], data => {
            // compitable with old version sdk
            return data[0];
        });
    };
    deleteMessageFromLocalStorage = (data, operationID = uuidv4()) => {
        return this._invoker('deleteMessageFromLocalStorage ', window.deleteMessageFromLocalStorage, [operationID, data.conversationID, data.clientMsgID]);
    };
    deleteMessage = (data, operationID = uuidv4()) => {
        return this._invoker('deleteMessage ', window.deleteMessage, [
            operationID,
            data.conversationID,
            data.clientMsgID,
        ]);
    };
    deleteAllConversationFromLocal = (operationID = uuidv4()) => {
        return this._invoker('deleteAllConversationFromLocal ', window.deleteAllConversationFromLocal, [operationID]);
    };
    deleteAllMsgFromLocal = (operationID = uuidv4()) => {
        return this._invoker('deleteAllMsgFromLocal ', window.deleteAllMsgFromLocal, [operationID]);
    };
    deleteAllMsgFromLocalAndSvr = (operationID = uuidv4()) => {
        return this._invoker('deleteAllMsgFromLocalAndSvr ', window.deleteAllMsgFromLocalAndSvr, [operationID]);
    };
    insertSingleMessageToLocalStorage = (data, operationID = uuidv4()) => {
        return this._invoker('insertSingleMessageToLocalStorage ', window.insertSingleMessageToLocalStorage, [operationID, JSON.stringify(data.message), data.recvID, data.sendID]);
    };
    insertGroupMessageToLocalStorage = (data, operationID = uuidv4()) => {
        return this._invoker('insertGroupMessageToLocalStorage ', window.insertGroupMessageToLocalStorage, [operationID, JSON.stringify(data.message), data.groupID, data.sendID]);
    };
    typingStatusUpdate = (data, operationID = uuidv4()) => {
        return this._invoker('typingStatusUpdate ', window.typingStatusUpdate, [
            operationID,
            data.recvID,
            data.msgTip,
        ]);
    };
    clearConversationAndDeleteAllMsg = (data, operationID = uuidv4()) => {
        return this._invoker('clearConversationAndDeleteAllMsg ', window.clearConversationAndDeleteAllMsg, [operationID, data]);
    };
    hideConversation = (data, operationID = uuidv4()) => {
        return this._invoker('hideConversation ', window.hideConversation, [
            operationID,
            data,
        ]);
    };
    getConversationListSplit = (data, operationID = uuidv4()) => {
        return this._invoker('getConversationListSplit ', window.getConversationListSplit, [operationID, data.offset, data.count]);
    };
    getConversationIDBySessionType = (data, operationID = uuidv4()) => {
        return this._invoker('getConversationIDBySessionType ', window.getConversationIDBySessionType, [operationID, data.sourceID, data.sessionType]);
    };
    getMultipleConversation = (data, operationID = uuidv4()) => {
        return this._invoker('getMultipleConversation ', window.getMultipleConversation, [operationID, JSON.stringify(data)]);
    };
    deleteConversation = (data, operationID = uuidv4()) => {
        return this._invoker('deleteConversation ', window.deleteConversation, [
            operationID,
            data,
        ]);
    };
    setConversationDraft = (data, operationID = uuidv4()) => {
        return this._invoker('setConversationDraft ', window.setConversationDraft, [operationID, data.conversationID, data.draftText]);
    };
    pinConversation = (data, operationID = uuidv4()) => {
        return this._invoker('pinConversation ', window.pinConversation, [
            operationID,
            data.conversationID,
            data.isPinned,
        ]);
    };
    getTotalUnreadMsgCount = (operationID = uuidv4()) => {
        return this._invoker('getTotalUnreadMsgCount ', window.getTotalUnreadMsgCount, [operationID]);
    };
    getConversationRecvMessageOpt = (data, operationID = uuidv4()) => {
        return this._invoker('getConversationRecvMessageOpt ', window.getConversationRecvMessageOpt, [operationID, JSON.stringify(data)]);
    };
    setConversationRecvMessageOpt = (data, operationID = uuidv4()) => {
        return this._invoker('setConversationRecvMessageOpt ', window.setConversationRecvMessageOpt, [operationID, data.conversationID, data.opt]);
    };
    searchLocalMessages = (data, operationID = uuidv4()) => {
        return this._invoker('searchLocalMessages ', window.searchLocalMessages, [operationID, JSON.stringify(data)]);
    };
    addFriend = (data, operationID = uuidv4()) => {
        return this._invoker('addFriend ', window.addFriend, [
            operationID,
            JSON.stringify(data),
        ]);
    };
    searchFriends = (data, operationID = uuidv4()) => {
        return this._invoker('searchFriends ', window.searchFriends, [operationID, JSON.stringify(data)]);
    };
    getSpecifiedFriendsInfo = (data, operationID = uuidv4()) => {
        return this._invoker('getSpecifiedFriendsInfo ', window.getSpecifiedFriendsInfo, [operationID, JSON.stringify(data)]);
    };
    getFriendApplicationListAsRecipient = (operationID = uuidv4()) => {
        return this._invoker('getFriendApplicationListAsRecipient ', window.getFriendApplicationListAsRecipient, [operationID]);
    };
    getFriendApplicationListAsApplicant = (operationID = uuidv4()) => {
        return this._invoker('getFriendApplicationListAsApplicant ', window.getFriendApplicationListAsApplicant, [operationID]);
    };
    getFriendList = (operationID = uuidv4()) => {
        return this._invoker('getFriendList ', window.getFriendList, [operationID]);
    };
    setFriendRemark = (data, operationID = uuidv4()) => {
        return this._invoker('setFriendRemark ', window.setFriendRemark, [
            operationID,
            JSON.stringify(data),
        ]);
    };
    checkFriend = (data, operationID = uuidv4()) => {
        return this._invoker('checkFriend', window.checkFriend, [
            operationID,
            JSON.stringify(data),
        ]);
    };
    acceptFriendApplication = (data, operationID = uuidv4()) => {
        return this._invoker('acceptFriendApplication', window.acceptFriendApplication, [operationID, JSON.stringify(data)]);
    };
    refuseFriendApplication = (data, operationID = uuidv4()) => {
        return this._invoker('refuseFriendApplication ', window.refuseFriendApplication, [operationID, JSON.stringify(data)]);
    };
    deleteFriend = (data, operationID = uuidv4()) => {
        return this._invoker('deleteFriend ', window.deleteFriend, [
            operationID,
            data,
        ]);
    };
    addBlack = (data, operationID = uuidv4()) => {
        return this._invoker('addBlack ', window.addBlack, [operationID, data]);
    };
    removeBlack = (data, operationID = uuidv4()) => {
        return this._invoker('removeBlack ', window.removeBlack, [
            operationID,
            data,
        ]);
    };
    getBlackList = (operationID = uuidv4()) => {
        return this._invoker('getBlackList ', window.getBlackList, [operationID]);
    };
    inviteUserToGroup = (data, operationID = uuidv4()) => {
        return this._invoker('inviteUserToGroup ', window.inviteUserToGroup, [
            operationID,
            data.groupID,
            data.reason,
            JSON.stringify(data.userIDList),
        ]);
    };
    kickGroupMember = (data, operationID = uuidv4()) => {
        return this._invoker('kickGroupMember ', window.kickGroupMember, [
            operationID,
            data.groupID,
            data.reason,
            JSON.stringify(data.userIDList),
        ]);
    };
    isJoinGroup = (data, operationID = uuidv4()) => {
        return this._invoker('isJoinGroup ', window.isJoinGroup, [
            operationID,
            data,
        ]);
    };
    getSpecifiedGroupMembersInfo = (data, operationID = uuidv4()) => {
        return this._invoker('getSpecifiedGroupMembersInfo ', window.getSpecifiedGroupMembersInfo, [operationID, data.groupID, JSON.stringify(data.userIDList)]);
    };
    getGroupMemberListByJoinTimeFilter = (data, operationID = uuidv4()) => {
        return this._invoker('getGroupMemberListByJoinTimeFilter ', window.getGroupMemberListByJoinTimeFilter, [
            operationID,
            data.groupID,
            data.offset,
            data.count,
            data.joinTimeBegin,
            data.joinTimeEnd,
            JSON.stringify(data.filterUserIDList),
        ]);
    };
    searchGroupMembers = (data, operationID = uuidv4()) => {
        return this._invoker('searchGroupMembers ', window.searchGroupMembers, [operationID, JSON.stringify(data)]);
    };
    setGroupApplyMemberFriend = (data, operationID = uuidv4()) => {
        return this._invoker('setGroupApplyMemberFriend ', window.setGroupApplyMemberFriend, [operationID, data.groupID, data.rule]);
    };
    setGroupLookMemberInfo = (data, operationID = uuidv4()) => {
        return this._invoker('setGroupLookMemberInfo ', window.setGroupLookMemberInfo, [operationID, data.groupID, data.rule]);
    };
    getJoinedGroupList = (operationID = uuidv4()) => {
        return this._invoker('getJoinedGroupList ', window.getJoinedGroupList, [operationID]);
    };
    createGroup = (data, operationID = uuidv4()) => {
        return this._invoker('createGroup ', window.createGroup, [
            operationID,
            JSON.stringify(data),
        ]);
    };
    setGroupInfo = (data, operationID = uuidv4()) => {
        return this._invoker('setGroupInfo ', window.setGroupInfo, [
            operationID,
            JSON.stringify(data),
        ]);
    };
    setGroupMemberNickname = (data, operationID = uuidv4()) => {
        return this._invoker('setGroupMemberNickname ', window.setGroupMemberNickname, [operationID, data.groupID, data.userID, data.groupMemberNickname]);
    };
    setGroupMemberInfo = (data, operationID = uuidv4()) => {
        return this._invoker('setGroupMemberInfo ', window.setGroupMemberInfo, [
            operationID,
            JSON.stringify(data),
        ]);
    };
    joinGroup = (data, operationID = uuidv4()) => {
        return this._invoker('joinGroup ', window.joinGroup, [
            operationID,
            data.groupID,
            data.reqMsg,
            data.joinSource,
        ]);
    };
    searchGroups = (data, operationID = uuidv4()) => {
        return this._invoker('searchGroups ', window.searchGroups, [
            operationID,
            JSON.stringify(data),
        ]);
    };
    quitGroup = (data, operationID = uuidv4()) => {
        return this._invoker('quitGroup ', window.quitGroup, [
            operationID,
            data,
        ]);
    };
    dismissGroup = (data, operationID = uuidv4()) => {
        return this._invoker('dismissGroup ', window.dismissGroup, [
            operationID,
            data,
        ]);
    };
    changeGroupMute = (data, operationID = uuidv4()) => {
        return this._invoker('changeGroupMute ', window.changeGroupMute, [
            operationID,
            data.groupID,
            data.isMute,
        ]);
    };
    changeGroupMemberMute = (data, operationID = uuidv4()) => {
        return this._invoker('changeGroupMemberMute ', window.changeGroupMemberMute, [operationID, data.groupID, data.userID, data.mutedSeconds]);
    };
    transferGroupOwner = (data, operationID = uuidv4()) => {
        return this._invoker('transferGroupOwner ', window.transferGroupOwner, [
            operationID,
            data.groupID,
            data.newOwnerUserID,
        ]);
    };
    getGroupApplicationListAsApplicant = (operationID = uuidv4()) => {
        return this._invoker('getGroupApplicationListAsApplicant ', window.getGroupApplicationListAsApplicant, [operationID]);
    };
    getGroupApplicationListAsRecipient = (operationID = uuidv4()) => {
        return this._invoker('getGroupApplicationListAsRecipient ', window.getGroupApplicationListAsRecipient, [operationID]);
    };
    acceptGroupApplication = (data, operationID = uuidv4()) => {
        return this._invoker('acceptGroupApplication ', window.acceptGroupApplication, [operationID, data.groupID, data.fromUserID, data.handleMsg]);
    };
    refuseGroupApplication = (data, operationID = uuidv4()) => {
        return this._invoker('refuseGroupApplication ', window.refuseGroupApplication, [operationID, data.groupID, data.fromUserID, data.handleMsg]);
    };
    resetConversationGroupAtType = (data, operationID = uuidv4()) => {
        return this._invoker('resetConversationGroupAtType ', window.resetConversationGroupAtType, [operationID, data]);
    };
    setGroupMemberRoleLevel = (data, operationID = uuidv4()) => {
        return this._invoker('setGroupMemberRoleLevel ', window.setGroupMemberRoleLevel, [operationID, data.groupID, data.userID, data.roleLevel]);
    };
    setGroupVerification = (data, operationID = uuidv4()) => {
        return this._invoker('setGroupVerification ', window.setGroupVerification, [operationID, data.groupID, data.verification]);
    };
    getGroupMemberOwnerAndAdmin = (data, operationID = uuidv4()) => {
        return this._invoker('getGroupMemberOwnerAndAdmin ', window.getGroupMemberOwnerAndAdmin, [operationID, data]);
    };
    setGlobalRecvMessageOpt = (opt, operationID = uuidv4()) => {
        return this._invoker('setGlobalRecvMessageOpt ', window.setGlobalRecvMessageOpt, [operationID, opt]);
    };
    findMessageList = (data, operationID = uuidv4()) => {
        return this._invoker('findMessageList ', window.findMessageList, [operationID, JSON.stringify(data)]);
    };
    uploadFile = (data, operationID = uuidv4()) => {
        fileMapSet(data.uuid, data.file);
        return this._invoker('uploadFile ', window.uploadFile, [
            operationID,
            JSON.stringify({
                ...data,
                filepath: '',
                cause: '',
            }),
        ]);
    };
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
