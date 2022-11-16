import { DatabaseErrorCode } from '../../constant';
import { getLoginUser as databaseGetLoginUser, insertLoginUser as databaseInsertLoginUser, updateLoginUserByMap as databaseUpdateLoginUserByMap, } from '../../sqls';
import { formatResponse, converSqlExecResult, convertToSnakeCaseObject, convertObjectField, } from '../../utils';
import { getInstance } from './instance';
export async function getLoginUser(userID) {
    try {
        const db = await getInstance();
        const execResult = databaseGetLoginUser(db, userID);
        if (execResult.length === 0) {
            return formatResponse('', DatabaseErrorCode.ErrorNoRecord, `no login user with id ${userID}`);
        }
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', [], {
            name: 'nickname',
        })[0]);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function insertLoginUser(userStr) {
    try {
        const db = await getInstance();
        const user = convertToSnakeCaseObject(convertObjectField(JSON.parse(userStr), { nickname: 'name' }));
        const execResult = databaseInsertLoginUser(db, user);
        return formatResponse(execResult);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function updateLoginUserByMap(userID, user) {
    try {
        const db = await getInstance();
        const execResult = databaseUpdateLoginUserByMap(db, userID, user);
        return formatResponse(execResult);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
