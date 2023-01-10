import { DatabaseErrorCode } from '../../constant';
import { getMessage as databaseGetMessage, getMultipleMessage as databaseGetMultipleMessage, getSendingMessageList as databaseGetSendingMessageList, getNormalMsgSeq as databaseGetNormalMsgSeq, updateMessageTimeAndStatus as databaseUpdateMessageTimeAndStatus, updateMessage as databaseUpdateMessage, insertMessage as databaseAddMessage, batchInsertMessageList as databaseBatchInsertMessageList, getMessageList as databaseGetMesageList, getMessageListNoTime as databaseGetMessageListNoTime, messageIfExists as databaseMessageIfExists, isExistsInErrChatLogBySeq as databaseIsExistsInErrChatLogBySeq, messageIfExistsBySeq as databaseMessageIfExistsBySeq, getAbnormalMsgSeq as databaseGetAbnormalMsgSeq, getAbnormalMsgSeqList as databaseGetAbnormalMsgSeqList, batchInsertExceptionMsg as databaseBatchInsertExceptionMsg, searchMessageByKeyword as databaseSearchMessageByKeyword, searchMessageByContentType as databaseSearchMessageByContentType, searchMessageByContentTypeAndKeyword as databaseSearchMessageByContentTypeAndKeyword, updateMsgSenderNickname as databaseUpdateMsgSenderNickname, updateMsgSenderFaceURL as databaseUpdateMsgSenderFaceURL, updateMsgSenderFaceURLAndSenderNickname as databaseUpdateMsgSenderFaceURLAndSenderNickname, getMsgSeqByClientMsgID as databaseGetMsgSeqByClientMsgID, getMsgSeqListByGroupID as databaseGetMsgSeqListByGroupID, getMsgSeqListByPeerUserID as databaseGetMsgSeqListByPeerUserID, getMsgSeqListBySelfUserID as databaseGetMsgSeqListBySelfUserID, deleteAllMessage as databaseDeleteAllMessage, getAllUnDeleteMessageSeqList as databaseGetAllUnDeleteMessageSeqList, updateSingleMessageHasRead as databaseUpdateSingleMessageHasRead, updateGroupMessageHasRead as databaseUpdateGroupMessageHasRead, updateMessageStatusBySourceID as databaseUpdateMessageStatusBySourceID, } from '../../sqls';
import { converSqlExecResult, convertObjectField, convertToSnakeCaseObject, formatResponse, } from '../../utils';
import { getInstance } from './instance';
export async function getMessage(messageId) {
    try {
        const db = await getInstance();
        const execResult = databaseGetMessage(db, messageId);
        if (execResult.length === 0) {
            return formatResponse('', DatabaseErrorCode.ErrorNoRecord, `no message with id ${messageId}`);
        }
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', ['isRead'])[0]);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getMultipleMessage(messageIDStr) {
    try {
        const db = await getInstance();
        const execResult = databaseGetMultipleMessage(db, JSON.parse(messageIDStr));
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', ['isRead']));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getSendingMessageList() {
    try {
        const db = await getInstance();
        const execResult = databaseGetSendingMessageList(db);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', ['isRead']));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getNormalMsgSeq() {
    try {
        const db = await getInstance();
        const execResult = databaseGetNormalMsgSeq(db);
        return formatResponse(execResult[0]?.values[0]?.[0]);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function updateMessageTimeAndStatus(clientMsgID, serverMsgID, sendTime, status) {
    try {
        const db = await getInstance();
        const execResult = databaseUpdateMessageTimeAndStatus(db, clientMsgID, serverMsgID, sendTime, status);
        return formatResponse(execResult);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function updateMessage(clientMsgId, messageStr) {
    try {
        const db = await getInstance();
        const message = convertToSnakeCaseObject(convertObjectField(JSON.parse(messageStr)));
        const execResult = databaseUpdateMessage(db, clientMsgId, message);
        const modifed = db.getRowsModified();
        if (modifed === 0) {
            throw 'updateMessage no record updated';
        }
        return formatResponse(execResult);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function updateColumnsMessage(clientMsgId, messageStr) {
    try {
        const db = await getInstance();
        const message = convertToSnakeCaseObject(convertObjectField(JSON.parse(messageStr)));
        const execResult = databaseUpdateMessage(db, clientMsgId, message);
        const modifed = db.getRowsModified();
        if (modifed === 0) {
            throw 'updateMessage no record updated';
        }
        return formatResponse(execResult);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function insertMessage(messageStr) {
    try {
        const db = await getInstance();
        const message = convertToSnakeCaseObject(JSON.parse(messageStr));
        const execResult = databaseAddMessage(db, message);
        return formatResponse(execResult);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function batchInsertMessageList(messageListStr) {
    try {
        const db = await getInstance();
        const messageList = JSON.parse(messageListStr).map((v) => convertToSnakeCaseObject(v));
        const execResult = databaseBatchInsertMessageList(db, messageList);
        return formatResponse(execResult);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getMessageListNoTime(sourceID, sessionType, count, isReverse = false, loginUserID) {
    try {
        const db = await getInstance();
        const execResult = databaseGetMessageListNoTime(db, sourceID, sessionType, count, isReverse, loginUserID);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', ['isRead']));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getMessageList(sourceID, sessionType, count, startTime, isReverse = false, loginUserID) {
    try {
        const db = await getInstance();
        const execResult = databaseGetMesageList(db, sourceID, sessionType, count, startTime, isReverse, loginUserID);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', ['isRead']));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function messageIfExists(clientMsgID) {
    try {
        const db = await getInstance();
        const execResult = databaseMessageIfExists(db, clientMsgID);
        return formatResponse(execResult.length !== 0);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function isExistsInErrChatLogBySeq(seq) {
    try {
        const db = await getInstance();
        const execResult = databaseIsExistsInErrChatLogBySeq(db, seq);
        return formatResponse(execResult.length !== 0);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function messageIfExistsBySeq(seq) {
    try {
        const db = await getInstance();
        const execResult = databaseMessageIfExistsBySeq(db, seq);
        return formatResponse(execResult.length !== 0);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getAbnormalMsgSeq() {
    try {
        const db = await getInstance();
        const execResult = databaseGetAbnormalMsgSeq(db);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase'));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getAbnormalMsgSeqList() {
    try {
        const db = await getInstance();
        const execResult = databaseGetAbnormalMsgSeqList(db);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase'));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function batchInsertExceptionMsg(messageListStr) {
    try {
        const db = await getInstance();
        const messageList = JSON.parse(messageListStr).map((v) => convertToSnakeCaseObject(v));
        const execResult = databaseBatchInsertExceptionMsg(db, messageList);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase'));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function searchMessageByKeyword(contentTypeStr, keywordListStr, keywordListMatchType, sourceID, startTime, endTime, sessionType, offset, count) {
    try {
        const db = await getInstance();
        const execResult = databaseSearchMessageByKeyword(db, JSON.parse(contentTypeStr), JSON.parse(keywordListStr), keywordListMatchType, sourceID, startTime, endTime, sessionType, offset, count);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', ['isRead']));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function searchMessageByContentType(contentTypeStr, sourceID, startTime, endTime, sessionType, offset, count) {
    try {
        const db = await getInstance();
        const execResult = databaseSearchMessageByContentType(db, JSON.parse(contentTypeStr), sourceID, startTime, endTime, sessionType, offset, count);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', ['isRead']));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function searchMessageByContentTypeAndKeyword(contentTypeStr, keywordListStr, keywordListMatchType, startTime, endTime) {
    try {
        const db = await getInstance();
        const execResult = databaseSearchMessageByContentTypeAndKeyword(db, JSON.parse(contentTypeStr), JSON.parse(keywordListStr), keywordListMatchType, startTime, endTime);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', ['isRead']));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function updateMsgSenderNickname(sendID, nickname, sessionType) {
    try {
        const db = await getInstance();
        databaseUpdateMsgSenderNickname(db, sendID, nickname, sessionType);
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function updateMsgSenderFaceURL(sendID, faceURL, sessionType) {
    try {
        const db = await getInstance();
        databaseUpdateMsgSenderFaceURL(db, sendID, faceURL, sessionType);
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function updateMsgSenderFaceURLAndSenderNickname(sendID, faceURL, nickname, sessionType) {
    try {
        const db = await getInstance();
        databaseUpdateMsgSenderFaceURLAndSenderNickname(db, sendID, faceURL, nickname, sessionType);
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getMsgSeqByClientMsgID(clientMsgID) {
    try {
        const db = await getInstance();
        const execResult = databaseGetMsgSeqByClientMsgID(db, clientMsgID);
        return formatResponse(execResult[0]?.values[0]?.[0]);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getMsgSeqListByGroupID(groupID) {
    try {
        const db = await getInstance();
        const execResult = databaseGetMsgSeqListByGroupID(db, groupID);
        const seqList = converSqlExecResult(execResult[0], 'CamelCase');
        return formatResponse(seqList.map(item => item.seq));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getMsgSeqListByPeerUserID(userID) {
    try {
        const db = await getInstance();
        const execResult = databaseGetMsgSeqListByPeerUserID(db, userID);
        const seqList = converSqlExecResult(execResult[0], 'CamelCase');
        return formatResponse(seqList.map(item => item.seq));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getMsgSeqListBySelfUserID(userID) {
    try {
        const db = await getInstance();
        const execResult = databaseGetMsgSeqListBySelfUserID(db, userID);
        const seqList = converSqlExecResult(execResult[0], 'CamelCase');
        return formatResponse(seqList.map(item => item.seq));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function deleteAllMessage() {
    try {
        const db = await getInstance();
        databaseDeleteAllMessage(db);
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getAllUnDeleteMessageSeqList() {
    try {
        const db = await getInstance();
        const execResult = databaseGetAllUnDeleteMessageSeqList(db);
        const seqList = converSqlExecResult(execResult[0], 'CamelCase');
        return formatResponse(seqList.map(item => item.seq));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function updateSingleMessageHasRead(sendID, clientMsgIDListStr) {
    try {
        const db = await getInstance();
        databaseUpdateSingleMessageHasRead(db, sendID, JSON.parse(clientMsgIDListStr));
        const modifed = db.getRowsModified();
        if (modifed === 0) {
            throw 'updateSingleMessageHasRead no record updated';
        }
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function updateGroupMessageHasRead(clientMsgIDListStr, sessionType) {
    try {
        const db = await getInstance();
        databaseUpdateGroupMessageHasRead(db, JSON.parse(clientMsgIDListStr), sessionType);
        const modifed = db.getRowsModified();
        if (modifed === 0) {
            throw 'updateGroupMessageHasRead no record updated';
        }
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function updateMessageStatusBySourceID(sourceID, status, sessionType, loginUserID) {
    try {
        const db = await getInstance();
        databaseUpdateMessageStatusBySourceID(db, sourceID, status, sessionType, loginUserID);
        const modifed = db.getRowsModified();
        if (modifed === 0) {
            throw 'updateMessageStatusBySourceID no record updated';
        }
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
