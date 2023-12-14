import { DatabaseErrorCode } from '../../constant';
import { getMessage as databaseGetMessage, getAlreadyExistSeqList as databaseGetAlreadyExistSeqList, getMessageBySeq as databaseGetMessageBySeq, getMessagesByClientMsgIDs as databaseGetMessagesByClientMsgIDs, getMessagesBySeqs as databaseGetMessagesBySeqs, getMessageListNoTime as databaseGetMessageListNoTime, getConversationNormalMsgSeq as databaseGetConversationNormalMsgSeq, getConversationPeerNormalMsgSeq as databaseGetConversationPeerNormalMsgSeq, getMultipleMessage as databaseGetMultipleMessage, getSendingMessageList as databaseGetSendingMessageList, updateMessageTimeAndStatus as databaseUpdateMessageTimeAndStatus, updateMessage as databaseUpdateMessage, updateMessageBySeq as databaseUpdateMessageBySeq, updateColumnsMessage as databaseUpdateColumnsMessage, deleteConversationMsgs as databaseDeleteConversationMsgs, markConversationAllMessageAsRead as databaseMarkConversationAllMessageAsRead, searchAllMessageByContentType as databaseSearchAllMessageByContentType, insertMessage as databaseInsertMessage, batchInsertMessageList as databaseBatchInsertMessageList, getMessageList as databaseGetMesageList, messageIfExists as databaseMessageIfExists, searchMessageByKeyword as databaseSearchMessageByKeyword, searchMessageByContentType as databaseSearchMessageByContentType, searchMessageByContentTypeAndKeyword as databaseSearchMessageByContentTypeAndKeyword, updateMsgSenderFaceURLAndSenderNickname as databaseUpdateMsgSenderFaceURLAndSenderNickname, deleteConversationAllMessages as databaseDeleteConversationAllMessages, markDeleteConversationAllMessages as databaseMarkDeleteConversationAllMessages, getUnreadMessage as databaseGetUnreadMessage, markConversationMessageAsReadBySeqs as databaseMarkConversationMessageAsReadBySeqs, markConversationMessageAsRead as databaseMarkConversationMessageAsRead, } from '../../sqls';
import { converSqlExecResult, convertObjectField, convertToSnakeCaseObject, formatResponse, } from '../../utils';
import { getInstance } from './instance';
export async function getMessage(conversationID, clientMsgID) {
    try {
        const db = await getInstance();
        const execResult = databaseGetMessage(db, conversationID, clientMsgID);
        if (execResult.length === 0) {
            return formatResponse('', DatabaseErrorCode.ErrorNoRecord, `no message with id ${clientMsgID}`);
        }
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', [
            'isRead',
            'isReact',
            'isExternalExtensions',
        ])[0]);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getAlreadyExistSeqList(conversationID, lostSeqListStr) {
    try {
        const db = await getInstance();
        const execResult = databaseGetAlreadyExistSeqList(db, conversationID, JSON.parse(lostSeqListStr));
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', [
            'isRead',
            'isReact',
            'isExternalExtensions',
        ]).map(item => item.seq) ?? []);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getMessageList(conversationID, count, startTime, isReverse = false) {
    try {
        const db = await getInstance();
        const execResult = databaseGetMesageList(db, conversationID, count, startTime, isReverse);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', [
            'isRead',
            'isReact',
            'isExternalExtensions',
        ]));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getMessageBySeq(conversationID, seq) {
    try {
        const db = await getInstance();
        const execResult = databaseGetMessageBySeq(db, conversationID, seq);
        if (execResult.length === 0) {
            return formatResponse('', DatabaseErrorCode.ErrorNoRecord, `no message with seq ${seq}`);
        }
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', [
            'isRead',
            'isReact',
            'isExternalExtensions',
        ])[0]);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getMessagesByClientMsgIDs(conversationID, clientMsgIDListStr) {
    try {
        const db = await getInstance();
        const execResult = databaseGetMessagesByClientMsgIDs(db, conversationID, JSON.parse(clientMsgIDListStr));
        if (execResult.length === 0) {
            return formatResponse('', DatabaseErrorCode.ErrorNoRecord, `no message with clientMsgIDListStr ${clientMsgIDListStr}`);
        }
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', [
            'isRead',
            'isReact',
            'isExternalExtensions',
        ]));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getMessagesBySeqs(conversationID, seqListStr) {
    try {
        const db = await getInstance();
        const execResult = databaseGetMessagesBySeqs(db, conversationID, JSON.parse(seqListStr));
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', [
            'isRead',
            'isReact',
            'isExternalExtensions',
        ]));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getMessageListNoTime(conversationID, count, isReverse = false) {
    try {
        const db = await getInstance();
        const execResult = databaseGetMessageListNoTime(db, conversationID, count, isReverse);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', [
            'isRead',
            'isReact',
            'isExternalExtensions',
        ]));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getConversationNormalMsgSeq(conversationID) {
    try {
        const db = await getInstance();
        const execResult = databaseGetConversationNormalMsgSeq(db, conversationID);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase')[0]?.seq ?? 0);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getConversationPeerNormalMsgSeq(conversationID, loginUserID) {
    try {
        const db = await getInstance();
        const execResult = databaseGetConversationPeerNormalMsgSeq(db, conversationID, loginUserID);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase')[0]?.seq ?? 0);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getSendingMessageList(conversationID) {
    try {
        const db = await getInstance();
        const execResult = databaseGetSendingMessageList(db, conversationID);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', [
            'isRead',
            'isReact',
            'isExternalExtensions',
        ]));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function updateMessageTimeAndStatus(conversationID, clientMsgID, serverMsgID, sendTime, status) {
    try {
        const db = await getInstance();
        const execResult = databaseUpdateMessageTimeAndStatus(db, conversationID, clientMsgID, serverMsgID, sendTime, status);
        const modifed = db.getRowsModified();
        if (modifed === 0) {
            throw 'updateMessageTimeAndStatus no record updated';
        }
        return formatResponse(execResult);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function updateMessage(conversationID, clientMsgID, messageStr) {
    try {
        const db = await getInstance();
        const message = convertToSnakeCaseObject(convertObjectField(JSON.parse(messageStr)));
        const execResult = databaseUpdateMessage(db, conversationID, clientMsgID, message);
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
export async function updateMessageBySeq(conversationID, seq, messageStr) {
    try {
        const db = await getInstance();
        const message = convertToSnakeCaseObject(convertObjectField(JSON.parse(messageStr)));
        const execResult = databaseUpdateMessageBySeq(db, conversationID, seq, message);
        const modifed = db.getRowsModified();
        if (modifed === 0) {
            throw 'updateMessageBySeq no record updated';
        }
        return formatResponse(execResult);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function batchInsertMessageList(conversationID, messageListStr) {
    try {
        const db = await getInstance();
        const messageList = JSON.parse(messageListStr).map((v) => convertToSnakeCaseObject(v));
        const execResult = databaseBatchInsertMessageList(db, conversationID, messageList);
        return formatResponse(execResult);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function insertMessage(conversationID, messageStr) {
    try {
        const db = await getInstance();
        const message = convertToSnakeCaseObject(JSON.parse(messageStr));
        const execResult = databaseInsertMessage(db, conversationID, message);
        return formatResponse(execResult);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getMultipleMessage(conversationID, messageIDStr) {
    try {
        const db = await getInstance();
        const execResult = databaseGetMultipleMessage(db, conversationID, JSON.parse(messageIDStr));
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', [
            'isRead',
            'isReact',
            'isExternalExtensions',
        ]));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function searchMessageByKeyword(conversationID, contentTypeStr, keywordListStr, keywordListMatchType, startTime, endTime, offset, count) {
    try {
        const db = await getInstance();
        const execResult = databaseSearchMessageByKeyword(db, conversationID, JSON.parse(contentTypeStr), JSON.parse(keywordListStr), keywordListMatchType, startTime, endTime, offset, count);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', [
            'isRead',
            'isReact',
            'isExternalExtensions',
        ]));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function searchMessageByContentType(conversationID, contentTypeStr, startTime, endTime, offset, count) {
    try {
        const db = await getInstance();
        const execResult = databaseSearchMessageByContentType(db, conversationID, JSON.parse(contentTypeStr), startTime, endTime, offset, count);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', [
            'isRead',
            'isReact',
            'isExternalExtensions',
        ]));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function searchMessageByContentTypeAndKeyword(conversationID, contentTypeStr, keywordListStr, keywordListMatchType, startTime, endTime) {
    try {
        const db = await getInstance();
        const execResult = databaseSearchMessageByContentTypeAndKeyword(db, conversationID, JSON.parse(contentTypeStr), JSON.parse(keywordListStr), keywordListMatchType, startTime, endTime);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', [
            'isRead',
            'isReact',
            'isExternalExtensions',
        ]));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function messageIfExists(conversationID, clientMsgID) {
    try {
        const db = await getInstance();
        const execResult = databaseMessageIfExists(db, conversationID, clientMsgID);
        return formatResponse(execResult.length !== 0);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function updateMsgSenderFaceURLAndSenderNickname(conversationID, sendID, faceURL, nickname) {
    try {
        const db = await getInstance();
        databaseUpdateMsgSenderFaceURLAndSenderNickname(db, conversationID, sendID, faceURL, nickname);
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function deleteConversationAllMessages(conversationID) {
    try {
        const db = await getInstance();
        databaseDeleteConversationAllMessages(db, conversationID);
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function markDeleteConversationAllMessages(conversationID) {
    try {
        const db = await getInstance();
        databaseMarkDeleteConversationAllMessages(db, conversationID);
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getUnreadMessage(conversationID, loginUserID) {
    try {
        const db = await getInstance();
        const execResult = databaseGetUnreadMessage(db, conversationID, loginUserID);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', [
            'isRead',
            'isReact',
            'isExternalExtensions',
        ]));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function markConversationMessageAsReadBySeqs(conversationID, seqListStr, loginUserID) {
    try {
        const db = await getInstance();
        databaseMarkConversationMessageAsReadBySeqs(db, conversationID, JSON.parse(seqListStr), loginUserID);
        return formatResponse(db.getRowsModified());
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function markConversationMessageAsRead(conversationID, clientMsgIDListStr, loginUserID) {
    try {
        const db = await getInstance();
        databaseMarkConversationMessageAsRead(db, conversationID, JSON.parse(clientMsgIDListStr), loginUserID);
        return formatResponse(db.getRowsModified());
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function updateColumnsMessage(conversationID, clientMsgID, messageStr) {
    try {
        const db = await getInstance();
        const message = convertToSnakeCaseObject(convertObjectField(JSON.parse(messageStr)));
        const execResult = databaseUpdateColumnsMessage(db, conversationID, clientMsgID, message);
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
export async function deleteConversationMsgs(conversationID, clientMsgIDListStr) {
    try {
        const db = await getInstance();
        const execResult = databaseDeleteConversationMsgs(db, conversationID, JSON.parse(clientMsgIDListStr));
        return formatResponse(execResult);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function markConversationAllMessageAsRead(conversationID, clientMsgIDListStr) {
    try {
        const db = await getInstance();
        databaseMarkConversationAllMessageAsRead(db, conversationID, JSON.parse(clientMsgIDListStr));
        return formatResponse(db.getRowsModified());
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function searchAllMessageByContentType(conversationID, clientMsgIDListStr) {
    try {
        const db = await getInstance();
        const execResult = databaseSearchAllMessageByContentType(db, conversationID, JSON.parse(clientMsgIDListStr));
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', [
            'isRead',
            'isReact',
            'isExternalExtensions',
        ]));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
