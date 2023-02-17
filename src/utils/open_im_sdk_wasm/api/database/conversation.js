import { DatabaseErrorCode } from '../../constant';
import { batchInsertConversationList as databaseBatchInsertConversationList, decrConversationUnreadCount as databaseDecrConversationUnreadCount, getAllConversationList as databaseGetAllConversationList, getAllConversationListToSync as databaseGetAllConversationListToSync, getConversation as databaseGetConversation, getHiddenConversationList as databaseGetHiddenConversationList, updateColumnsConversation as databaseUpdateColumnsConversation, getTotalUnreadMsgCount as databaseGetTotalUnreadMsgCount, getMultipleConversation as databaseGetMultipleConversation, getConversationByUserID as databaseGetConversationByUserID, getConversationListSplit as databaseGetConversationListSplit, incrConversationUnreadCount as databaseIncrConversationUnreadCount, updateConversation as databaseUpdateConversation, deleteConversation as databaseDeleteConversation, conversationIfExists as databaseConversationIfExists, resetConversation as databaseResetConversation, resetAllConversation as databaseResetAllConversation, clearConversation as databaseClearConversation, clearAllConversation as databaseClearAllConversation, setConversationDraft as databaseSetConversationDraft, removeConversationDraft as databaseRemoveConversationDraft, unPinConversation as databaseUnPinConversation, setMultipleConversationRecvMsgOpt as databaseSetMultipleConversationRecvMsgOpt, } from '../../sqls';
import { converSqlExecResult, convertObjectField, convertToSnakeCaseObject, formatResponse, } from '../../utils';
import { getInstance } from './instance';
export async function getAllConversationList() {
    try {
        const db = await getInstance();
        const execResult = databaseGetAllConversationList(db);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', [
            'isPinned',
            'isPrivateChat',
            'isNotInGroup',
        ]));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getAllConversationListToSync() {
    try {
        const db = await getInstance();
        const execResult = databaseGetAllConversationListToSync(db);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', [
            'isPinned',
            'isPrivateChat',
            'isNotInGroup',
        ]));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getHiddenConversationList() {
    try {
        const db = await getInstance();
        const execResult = databaseGetHiddenConversationList(db);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', [
            'isPinned',
            'isPrivateChat',
            'isNotInGroup',
        ]));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getConversation(conversationID) {
    try {
        const db = await getInstance();
        const execResult = databaseGetConversation(db, conversationID);
        if (execResult.length === 0) {
            return formatResponse('', DatabaseErrorCode.ErrorNoRecord, `no conversation with id ${conversationID}`);
        }
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', [
            'isPinned',
            'isPrivateChat',
            'isNotInGroup',
        ])[0]);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getMultipleConversation(conversationIDList) {
    try {
        const db = await getInstance();
        const idList = JSON.parse(conversationIDList);
        const execResult = databaseGetMultipleConversation(db, idList);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', [
            'isPinned',
            'isPrivateChat',
            'isNotInGroup',
        ]));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function updateColumnsConversation(conversationID, conversation) {
    try {
        const db = await getInstance();
        let parsedConversation = conversation;
        if (typeof conversation === 'string') {
            parsedConversation = convertToSnakeCaseObject(convertObjectField(JSON.parse(conversation)));
        }
        const execResult = databaseUpdateColumnsConversation(db, conversationID, parsedConversation);
        const modifed = db.getRowsModified();
        if (modifed === 0) {
            throw 'updateColumnsConversation no record updated';
        }
        return formatResponse(execResult);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function decrConversationUnreadCount(conversationID, count) {
    try {
        const db = await getInstance();
        const execResult = databaseDecrConversationUnreadCount(db, conversationID, count);
        return formatResponse(execResult);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function batchInsertConversationList(conversationListStr) {
    try {
        const db = await getInstance();
        const conversationList = (JSON.parse(conversationListStr) || []).map((v) => convertToSnakeCaseObject(v));
        if (conversationList.length === 0) {
            return formatResponse('');
        }
        const execResult = databaseBatchInsertConversationList(db, conversationList);
        return formatResponse(execResult);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function insertConversation(conversationStr) {
    return batchInsertConversationList(`[${conversationStr}]`);
}
export async function getTotalUnreadMsgCount() {
    try {
        const db = await getInstance();
        const execResult = databaseGetTotalUnreadMsgCount(db);
        return formatResponse(execResult[0]?.values[0]?.[0]??0);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getConversationByUserID(userID) {
    try {
        const db = await getInstance();
        const execResult = databaseGetConversationByUserID(db, userID);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', [
            'isPinned',
            'isPrivateChat',
            'isNotInGroup',
        ]));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getConversationListSplit(offset, count) {
    try {
        const db = await getInstance();
        const execResult = databaseGetConversationListSplit(db, offset, count);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', [
            'isPinned',
            'isPrivateChat',
            'isNotInGroup',
        ]));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function deleteConversation(conversationID) {
    try {
        const db = await getInstance();
        databaseDeleteConversation(db, conversationID);
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function updateConversation(conversationStr) {
    try {
        const db = await getInstance();
        const localConversation = convertToSnakeCaseObject(convertObjectField(JSON.parse(conversationStr)));
        databaseUpdateConversation(db, localConversation);
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function batchUpdateConversationList(conversationListStr) {
    try {
        const db = await getInstance();
        const conversationList = (JSON.parse(conversationListStr) || []).map((v) => convertToSnakeCaseObject(v));
        if (conversationList.length === 0) {
            return formatResponse('');
        }
        conversationList.forEach(conversation => {
            databaseUpdateConversation(db, conversation);
        });
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function conversationIfExists(conversationID) {
    try {
        const db = await getInstance();
        const execResult = databaseConversationIfExists(db, conversationID);
        return formatResponse(execResult.length !== 0);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function resetConversation(conversationID) {
    try {
        const db = await getInstance();
        const execResult = databaseResetConversation(db, conversationID);
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function resetAllConversation() {
    try {
        const db = await getInstance();
        const execResult = databaseResetAllConversation(db);
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function clearConversation(conversationID) {
    try {
        const db = await getInstance();
        const execResult = databaseClearConversation(db, conversationID);
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function clearAllConversation() {
    try {
        const db = await getInstance();
        const execResult = databaseClearAllConversation(db);
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function setConversationDraft(conversationID, draftText) {
    try {
        const db = await getInstance();
        const execResult = databaseSetConversationDraft(db, conversationID, draftText);
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function removeConversationDraft(conversationID, draftText) {
    try {
        const db = await getInstance();
        const execResult = databaseRemoveConversationDraft(db, conversationID, draftText);
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function unPinConversation(conversationID, isPinned) {
    try {
        const db = await getInstance();
        const execResult = databaseUnPinConversation(db, conversationID, isPinned);
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
// export async function updateAllConversation(
//   conversationID: string,
//   conversation: ClientConversation | string
// ): Promise<string> {
//   try {
//     const db = await getInstance();
//     let parsedConversation = conversation as ClientConversation;
//     if (typeof conversation === 'string') {
//       parsedConversation = convertToSnakeCaseObject(
//         convertObjectField(JSON.parse(conversation))
//       ) as ClientConversation;
//     }
//     const execResult = databaseUpdateColumnsConversation(
//       db,
//       conversationID,
//       parsedConversation
//     );
//     const modifed = db.getRowsModified();
//     if (modifed === 0) {
//       throw 'updateColumnsConversation no record updated';
//     }
//     return formatResponse(execResult);
//   } catch (e) {
//     console.error(e);
//     return formatResponse(
//       undefined,
//       DatabaseErrorCode.ErrorInit,
//       JSON.stringify(e)
//     );
//   }
// }
export async function incrConversationUnreadCount(conversationID) {
    try {
        const db = await getInstance();
        const execResult = databaseIncrConversationUnreadCount(db, conversationID);
        return formatResponse(execResult);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function setMultipleConversationRecvMsgOpt(conversationIDListStr, opt) {
    try {
        const db = await getInstance();
        const execResult = databaseSetMultipleConversationRecvMsgOpt(db, JSON.parse(conversationIDListStr), opt);
        return formatResponse('');
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
