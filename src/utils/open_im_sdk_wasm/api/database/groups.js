import { DatabaseErrorCode } from '../../constant';
import { insertGroup as databaseInsertGroup, deleteGroup as databasedeleteGroup, updateGroup as databaseupdateGroup, getJoinedGroupList as databaseGetJoinedGroupList, getGroupInfoByGroupID as databaseGetGroupInfoByGroupID, getAllGroupInfoByGroupIDOrGroupName as databaseGetAllGroupInfoByGroupIDOrGroupName, subtractMemberCount as databasesubtractMemberCount, addMemberCount as databaseaddMemberCount, } from '../../sqls';
import { converSqlExecResult, convertObjectField, convertToSnakeCaseObject, formatResponse, } from '../../utils';
import { getInstance } from './instance';
export async function insertGroup(localGroupStr) {
    try {
        const db = await getInstance();
        const localGroup = convertToSnakeCaseObject(convertObjectField(JSON.parse(localGroupStr), { groupName: 'name' }));
        databaseInsertGroup(db, localGroup);
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function deleteGroup(groupID) {
    try {
        const db = await getInstance();
        databasedeleteGroup(db, groupID);
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function updateGroup(groupID, localGroupStr) {
    try {
        const db = await getInstance();
        const localGroup = convertToSnakeCaseObject(convertObjectField(JSON.parse(localGroupStr), { groupName: 'name' }));
        databaseupdateGroup(db, groupID, localGroup);
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getJoinedGroupList() {
    try {
        const db = await getInstance();
        const execResult = databaseGetJoinedGroupList(db);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', [], { name: 'groupName' }));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getGroupInfoByGroupID(groupID) {
    try {
        const db = await getInstance();
        const execResult = databaseGetGroupInfoByGroupID(db, groupID);
        if (execResult.length === 0) {
            return formatResponse('', DatabaseErrorCode.ErrorNoRecord, `no group with id ${groupID}`);
        }
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', [], {
            name: 'groupName',
        })[0]);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getAllGroupInfoByGroupIDOrGroupName(keyword, isSearchGroupID, isSearchGroupName) {
    try {
        const db = await getInstance();
        const execResult = databaseGetAllGroupInfoByGroupIDOrGroupName(db, keyword, isSearchGroupID, isSearchGroupName);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', [], { name: 'groupName' }));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function subtractMemberCount(groupID) {
    try {
        const db = await getInstance();
        databasesubtractMemberCount(db, groupID);
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function addMemberCount(groupID) {
    try {
        const db = await getInstance();
        const execResult = databaseaddMemberCount(db, groupID);
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getJoinedWorkingGroupIDList() {
    try {
        const db = await getInstance();
        const execResult = databaseGetJoinedGroupList(db);
        const allJoinedGroupList = converSqlExecResult(execResult[0], 'CamelCase');
        const filterIDList = [];
        allJoinedGroupList.forEach(group => {
            if (group.groupType === 2) {
                filterIDList.push(group.groupID);
            }
        });
        return formatResponse(JSON.stringify(filterIDList));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getJoinedWorkingGroupList() {
    try {
        const db = await getInstance();
        const execResult = databaseGetJoinedGroupList(db);
        const allJoinedGroupList = converSqlExecResult(execResult[0], 'CamelCase', [], { name: 'groupName' });
        const filterList = allJoinedGroupList.filter(group => group.group_type === 2);
        return formatResponse(JSON.stringify(filterList));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
