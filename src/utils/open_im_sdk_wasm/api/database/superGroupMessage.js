import { DatabaseErrorCode } from '../../constant';
import { superGroupGetMessage as databaseSuperGroupGetMessage, superGroupGetMultipleMessage as databaseSuperGroupGetMultipleMessage, getSuperGroupNormalMsgSeq as databaseGetSuperGroupNormalMsgSeq, superGroupGetNormalMinSeq as databaseSuperGroupGetNormalMinSeq, superGroupUpdateMessageTimeAndStatus as databaseSuperGroupUpdateMessageTimeAndStatus, superGroupUpdateMessage as databaseSuperGroupUpdateMessage, superGroupInsertMessage as databaseSuperGroupInsertMessage, superGroupBatchInsertMessageList as databaseSuperGroupBatchInsertMessageList, superGroupGetMessageListNoTime as databaseSuperGroupGetMessageListNoTime, superGroupGetMessageList as databaseSuperGroupGetMessageList, superGroupDeleteAllMessage as databaseSuperGroupDeleteAllMessage, superGroupSearchMessageByKeyword as databaseSuperGroupSearchMessageByKeyword, superGroupSearchMessageByContentType as databaseSuperGroupSearchMessageByContentType, superGroupSearchMessageByContentTypeAndKeyword as databaseSuperGroupSearchMessageByContentTypeAndKeyword, superGroupUpdateMessageStatusBySourceID as databaseSuperGroupUpdateMessageStatusBySourceID, superGroupGetSendingMessageList as databaseSuperGroupGetSendingMessageList, superGroupUpdateGroupMessageHasRead as databaseSuperGroupUpdateGroupMessageHasRead, superGroupGetMsgSeqByClientMsgID as databaseSuperGroupGetMsgSeqByClientMsgID, superGroupUpdateMsgSenderFaceURLAndSenderNickname as databaseSuperGroupUpdateMsgSenderFaceURLAndSenderNickname, } from '../../sqls';
import { converSqlExecResult, convertToSnakeCaseObject, formatResponse, } from '../../utils';
import { getInstance } from './instance';
export async function superGroupGetMessage(groupID, messageId) {
    try {
        const db = await getInstance();
        const execResult = databaseSuperGroupGetMessage(db, groupID, messageId);
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
export async function superGroupGetMultipleMessage(messageIdsStr, groupID) {
    try {
        const db = await getInstance();
        const messageIds = JSON.parse(messageIdsStr || '[]');
        const execResult = databaseSuperGroupGetMultipleMessage(db, groupID, messageIds);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', ['isRead']));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getSuperGroupNormalMsgSeq(groupID) {
    try {
        const db = await getInstance();
        const execResult = databaseGetSuperGroupNormalMsgSeq(db, groupID);
        return formatResponse(execResult[0]?.values[0]?.[0]);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function superGroupGetNormalMinSeq(groupID) {
    try {
        const db = await getInstance();
        const execResult = databaseSuperGroupGetNormalMinSeq(db, groupID);
        return formatResponse(execResult[0]?.values[0]?.[0]);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function superGroupUpdateMessageTimeAndStatus(groupID, clientMsgID, serverMsgID, sendTime, status) {
    try {
        const db = await getInstance();
        const execResult = databaseSuperGroupUpdateMessageTimeAndStatus(db, groupID, clientMsgID, serverMsgID, sendTime, status);
        const modifed = db.getRowsModified();
        if (modifed === 0) {
            throw 'superGroupUpdateMessageTimeAndStatus no record updated';
        }
        return formatResponse(execResult);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function superGroupUpdateMessage(groupID, clientMsgID, messageStr) {
    try {
        const db = await getInstance();
        const message = convertToSnakeCaseObject(JSON.parse(messageStr));
        const execResult = databaseSuperGroupUpdateMessage(db, groupID, clientMsgID, message);
        const modifed = db.getRowsModified();
        if (modifed === 0) {
            throw 'superGroupUpdateMessage no record updated';
        }
        return formatResponse(execResult);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function superGroupUpdateColumnsMessage(clientMsgID, groupID, messageStr) {
    try {
        const db = await getInstance();
        const message = convertToSnakeCaseObject(JSON.parse(messageStr));
        const execResult = databaseSuperGroupUpdateMessage(db, groupID, clientMsgID, message);
        const modifed = db.getRowsModified();
        if (modifed === 0) {
            throw 'superGroupUpdateColumnsMessage no record updated';
        }
        return formatResponse(execResult);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function superGroupInsertMessage(messageStr, groupID) {
    try {
        const db = await getInstance();
        const message = convertToSnakeCaseObject(JSON.parse(messageStr));
        const execResult = databaseSuperGroupInsertMessage(db, groupID, message);
        return formatResponse(execResult);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function superGroupBatchInsertMessageList(messageListStr, groupID) {
    try {
        const db = await getInstance();
        const messageList = JSON.parse(messageListStr).map((v) => convertToSnakeCaseObject(v));
        const execResult = databaseSuperGroupBatchInsertMessageList(db, groupID, messageList);
        return formatResponse(execResult);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function superGroupGetMessageListNoTime(groupID, sessionType, count, isReverse = false) {
    try {
        const db = await getInstance();
        const execResult = databaseSuperGroupGetMessageListNoTime(db, groupID, sessionType, count, isReverse);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', ['isRead']));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function superGroupGetMessageList(groupID, sessionType, count, startTime, isReverse = false) {
    try {
        const db = await getInstance();
        const execResult = databaseSuperGroupGetMessageList(db, groupID, sessionType, count, startTime, isReverse);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', ['isRead']));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function superGroupDeleteAllMessage(groupID) {
    try {
        const db = await getInstance();
        const execResult = databaseSuperGroupDeleteAllMessage(db, groupID);
        return formatResponse(execResult);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function superGroupSearchMessageByKeyword(contentTypeStr, keywordListStr, keywordListMatchType, sourceID, startTime, endTime, sessionType, offset, count) {
    try {
        const db = await getInstance();
        const execResult = databaseSuperGroupSearchMessageByKeyword(db, JSON.parse(contentTypeStr), JSON.parse(keywordListStr), keywordListMatchType, sourceID, startTime, endTime, sessionType, offset, count);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', ['isRead']));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function superGroupSearchMessageByContentType(contentTypeStr, sourceID, startTime, endTime, sessionType, offset, count) {
    try {
        const db = await getInstance();
        const execResult = databaseSuperGroupSearchMessageByContentType(db, JSON.parse(contentTypeStr), sourceID, startTime, endTime, sessionType, offset, count);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', ['isRead']));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function superGroupSearchMessageByContentTypeAndKeyword(contentTypeStr, keywordListStr, keywordListMatchType, startTime, endTime, groupID) {
    try {
        const db = await getInstance();
        const execResult = databaseSuperGroupSearchMessageByContentTypeAndKeyword(db, JSON.parse(contentTypeStr), JSON.parse(keywordListStr), keywordListMatchType, startTime, endTime, groupID);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', ['isRead']));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function superGroupUpdateMessageStatusBySourceID(sourceID, status, sessionType) {
    try {
        const db = await getInstance();
        const execResult = databaseSuperGroupUpdateMessageStatusBySourceID(db, sourceID, status, sessionType);
        const modifed = db.getRowsModified();
        if (modifed === 0) {
            throw 'superGroupUpdateMessageStatusBySourceID no record updated';
        }
        return formatResponse(execResult);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function superGroupGetSendingMessageList(groupID) {
    try {
        const db = await getInstance();
        const execResult = databaseSuperGroupGetSendingMessageList(db, groupID);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', ['isRead']));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function superGroupUpdateGroupMessageHasRead(msgIDListStr, groupID) {
    try {
        const db = await getInstance();
        const execResult = databaseSuperGroupUpdateGroupMessageHasRead(db, JSON.parse(msgIDListStr), groupID);
        const modifed = db.getRowsModified();
        if (modifed === 0) {
            throw 'superGroupUpdateGroupMessageHasRead no record updated';
        }
        return formatResponse(execResult);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function superGroupGetMsgSeqByClientMsgID(clientMsgID, groupID) {
    try {
        const db = await getInstance();
        const execResult = databaseSuperGroupGetMsgSeqByClientMsgID(db, clientMsgID, groupID);
        return formatResponse(execResult[0]?.values[0]?.[0]);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function superGroupUpdateMsgSenderFaceURLAndSenderNickname(sendID, faceURL, nickname, sessionType, groupID) {
    try {
        const db = await getInstance();
        const execResult = databaseSuperGroupUpdateMsgSenderFaceURLAndSenderNickname(db, sendID, faceURL, nickname, sessionType, groupID);
        const modifed = db.getRowsModified();
        if (modifed === 0) {
            throw 'superGroupUpdateGroupMessageHasRead no record updated';
        }
        return formatResponse(execResult);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
