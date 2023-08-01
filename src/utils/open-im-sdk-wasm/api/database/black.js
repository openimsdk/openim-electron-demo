import { DatabaseErrorCode } from '../../constant';
import { getBlackList as databaseGetBlackList, getBlackListUserID as databaseGetBlackListUserID, getBlackInfoByBlockUserID as databaseGetBlackInfoByBlockUserID, getBlackInfoList as databaseGetBlackInfoList, insertBlack as databaseInsertBlack, deleteBlack as databasedeleteBlack, updateBlack as databaseupdateBlack, } from '../../sqls';
import { converSqlExecResult, convertObjectField, convertToSnakeCaseObject, formatResponse, } from '../../utils';
import { getInstance } from './instance';
export async function getBlackList() {
    try {
        const db = await getInstance();
        const execResult = databaseGetBlackList(db);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', [], {
            block_user_id: 'userID',
        }));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getBlackListUserID() {
    try {
        const db = await getInstance();
        const execResult = databaseGetBlackListUserID(db);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase'));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getBlackInfoByBlockUserID(blockUserID, loginUserID) {
    try {
        const db = await getInstance();
        const execResult = databaseGetBlackInfoByBlockUserID(db, blockUserID, loginUserID);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase'));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getBlackInfoList(blockUserIDListStr) {
    try {
        const db = await getInstance();
        const execResult = databaseGetBlackInfoList(db, JSON.parse(blockUserIDListStr));
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase'));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function insertBlack(localBlackStr) {
    try {
        const db = await getInstance();
        const localBlack = convertToSnakeCaseObject(convertObjectField(JSON.parse(localBlackStr), {
            userID: 'block_user_id',
            name: 'nickname',
        }));
        databaseInsertBlack(db, localBlack);
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function deleteBlack(blockUserID, loginUserID) {
    try {
        const db = await getInstance();
        databasedeleteBlack(db, blockUserID, loginUserID);
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function updateBlack(localBlackStr) {
    try {
        const db = await getInstance();
        const localBlack = convertToSnakeCaseObject(convertObjectField(JSON.parse(localBlackStr)));
        databaseupdateBlack(db, localBlack);
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
