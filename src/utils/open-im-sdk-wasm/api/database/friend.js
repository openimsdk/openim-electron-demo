import { DatabaseErrorCode } from '../../constant';
import { insertFriend as databaseInsertFriend, deleteFriend as databasedeleteFriend, updateFriend as databaseupdateFriend, getAllFriendList as databaseGetAllFriendList, getPageFriendList as databaseGetPageFriendList, searchFriendList as databasesearchFriendList, getFriendInfoByFriendUserID as databaseGetFriendInfoByFriendUserID, getFriendInfoList as databaseGetFriendInfoList, } from '../../sqls';
import { converSqlExecResult, convertObjectField, convertToSnakeCaseObject, formatResponse, } from '../../utils';
import { getInstance } from './instance';
export async function insertFriend(localFriendStr) {
    try {
        const db = await getInstance();
        const localFriend = convertToSnakeCaseObject(convertObjectField(JSON.parse(localFriendStr), {
            userID: 'friend_user_id',
            nickname: 'name',
        }));
        databaseInsertFriend(db, localFriend);
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function deleteFriend(friendUserID, loginUserID) {
    try {
        const db = await getInstance();
        databasedeleteFriend(db, friendUserID, loginUserID);
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function updateFriend(localFriendStr) {
    try {
        const db = await getInstance();
        const localFriend = convertToSnakeCaseObject(convertObjectField(JSON.parse(localFriendStr), {
            userID: 'friend_user_id',
            nickname: 'name',
        }));
        databaseupdateFriend(db, localFriend);
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getAllFriendList(loginUserID) {
    try {
        const db = await getInstance();
        const execResult = databaseGetAllFriendList(db, loginUserID);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', [], {
            name: 'nickname',
            friend_user_id: 'userID',
        }));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getPageFriendList(offset, count, loginUserID) {
    try {
        const db = await getInstance();
        const execResult = databaseGetPageFriendList(db, offset, count, loginUserID);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', [], {
            name: 'nickname',
            friend_user_id: 'userID',
        }));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function searchFriendList(key, isSearchUserID, isSearchNickname, isSearchRemark) {
    try {
        const db = await getInstance();
        const execResult = databasesearchFriendList(db, key, isSearchUserID, isSearchNickname, isSearchRemark);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', [], {
            name: 'nickname',
            friend_user_id: 'userID',
        }));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getFriendInfoByFriendUserID(friendUserID, loginUserID) {
    try {
        const db = await getInstance();
        const execResult = databaseGetFriendInfoByFriendUserID(db, friendUserID, loginUserID);
        if (execResult.length === 0) {
            return formatResponse('', DatabaseErrorCode.ErrorNoRecord, `no friend with id ${friendUserID}`);
        }
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', [], {
            name: 'nickname',
            friend_user_id: 'userID',
        })[0]);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getFriendInfoList(friendUserIDListStr) {
    try {
        const db = await getInstance();
        const execResult = databaseGetFriendInfoList(db, JSON.parse(friendUserIDListStr));
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', [], {
            name: 'nickname',
            friend_user_id: 'userID',
        }));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
