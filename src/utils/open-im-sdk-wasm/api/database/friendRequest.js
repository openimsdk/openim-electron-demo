import { DatabaseErrorCode } from '../../constant';
import { insertFriendRequest as databaseInsertFriendRequest, deleteFriendRequestBothUserID as databasedeleteFriendRequestBothUserID, updateFriendRequest as databaseupdateFriendRequest, getRecvFriendApplication as databaseGetRecvFriendApplication, getSendFriendApplication as databaseGetSendFriendApplication, getFriendApplicationByBothID as databaseGetFriendApplicationByBothID, getBothFriendReq as databaseGetBothFriendReq, } from '../../sqls';
import { converSqlExecResult, convertObjectField, convertToSnakeCaseObject, formatResponse, } from '../../utils';
import { getInstance } from './instance';
export async function insertFriendRequest(localFriendRequestStr) {
    try {
        const db = await getInstance();
        const localFriendRequest = convertToSnakeCaseObject(convertObjectField(JSON.parse(localFriendRequestStr)));
        databaseInsertFriendRequest(db, localFriendRequest);
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function deleteFriendRequestBothUserID(fromUserID, toUserID) {
    try {
        const db = await getInstance();
        databasedeleteFriendRequestBothUserID(db, fromUserID, toUserID);
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function updateFriendRequest(localFriendRequestStr) {
    try {
        const db = await getInstance();
        const localFriendRequest = convertToSnakeCaseObject(convertObjectField(JSON.parse(localFriendRequestStr)));
        databaseupdateFriendRequest(db, localFriendRequest);
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getRecvFriendApplication(loginUserID) {
    try {
        const db = await getInstance();
        const execResult = databaseGetRecvFriendApplication(db, loginUserID);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase'));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getSendFriendApplication(fromUserId) {
    try {
        const db = await getInstance();
        const execResult = databaseGetSendFriendApplication(db, fromUserId);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase'));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getFriendApplicationByBothID(fromUserID, toUserID) {
    try {
        const db = await getInstance();
        const execResult = databaseGetFriendApplicationByBothID(db, fromUserID, toUserID);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase'));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getBothFriendReq(fromUserID, toUserID) {
    try {
        const db = await getInstance();
        const execResult = databaseGetBothFriendReq(db, fromUserID, toUserID);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase'));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
