import { DatabaseErrorCode } from '../../constant';
import { getLoginUser as databaseGetLoginUser, insertLoginUser as databaseInsertLoginUser, updateLoginUser as databaseUpdateLoginUser, } from '../../sqls';
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
export async function updateLoginUser(userStr) {
    try {
        const db = await getInstance();
        const user = convertToSnakeCaseObject(convertObjectField(JSON.parse(userStr), { nickname: 'name' }));
        const execResult = databaseUpdateLoginUser(db, user);
        const modifed = db.getRowsModified();
        if (modifed === 0) {
            throw 'updateLoginUser no record updated';
        }
        return formatResponse(execResult);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
