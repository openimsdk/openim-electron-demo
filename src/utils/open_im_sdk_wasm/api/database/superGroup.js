import { DatabaseErrorCode } from '../../constant';
import { getJoinedSuperGroupList as databaseGetJoinedSuperGroupList, insertSuperGroup as databaseInsertSuperGroup, updateSuperGroup as databaseUpdateSuperGroup, deleteSuperGroup as databaseDeleteSuperGroup, getSuperGroupInfoByGroupID as databaseGetSuperGroupInfoByGroupID, } from '../../sqls';
import { formatResponse, converSqlExecResult, convertToSnakeCaseObject, convertObjectField, } from '../../utils';
import { getInstance } from './instance';
export async function getJoinedSuperGroupList() {
    try {
        const db = await getInstance();
        const execResult = databaseGetJoinedSuperGroupList(db);
        return formatResponse(converSqlExecResult(execResult[0]));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getJoinedSuperGroupIDList() {
    try {
        const db = await getInstance();
        const execResult = databaseGetJoinedSuperGroupList(db);
        const records = converSqlExecResult(execResult[0]);
        const groupIds = records.map(r => r.groupID);
        return formatResponse(groupIds);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getSuperGroupInfoByGroupID(groupID) {
    try {
        const db = await getInstance();
        const execResult = databaseGetSuperGroupInfoByGroupID(db, groupID);
        if (execResult.length === 0) {
            return formatResponse('', DatabaseErrorCode.ErrorNoRecord, `no super group with id ${groupID}`);
        }
        return formatResponse(converSqlExecResult(execResult[0])[0]);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function deleteSuperGroup(groupID) {
    try {
        const db = await getInstance();
        const execResult = databaseDeleteSuperGroup(db, groupID);
        return formatResponse(execResult);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function insertSuperGroup(groupStr) {
    try {
        const db = await getInstance();
        const group = convertToSnakeCaseObject(convertObjectField(JSON.parse(groupStr), { groupName: 'name' }));
        const execResult = databaseInsertSuperGroup(db, group);
        return formatResponse(execResult);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function updateSuperGroup(groupID, groupStr) {
    try {
        const db = await getInstance();
        const group = convertToSnakeCaseObject(convertObjectField(JSON.parse(groupStr), { groupName: 'name' }));
        const execResult = databaseUpdateSuperGroup(db, groupID, group);
        const modifed = db.getRowsModified();
        if (modifed === 0) {
            throw 'updateSuperGroup no record updated';
        }
        return formatResponse(execResult);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
