import { DatabaseErrorCode } from '../../constant';
import { batchInsertConversationUnreadMessageList as databaseBatchInsertConversationUnreadMessageList, deleteConversationUnreadMessageList as databaseDeleteConversationUnreadMessageList, } from '../../sqls';
import { convertToSnakeCaseObject, formatResponse } from '../../utils';
import { getInstance } from './instance';
export async function deleteConversationUnreadMessageList(conversationID, sendTime) {
    try {
        const db = await getInstance();
        databaseDeleteConversationUnreadMessageList(db, conversationID, sendTime);
        const modifed = db.getRowsModified();
        return formatResponse(modifed);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function batchInsertConversationUnreadMessageList(messageListStr) {
    try {
        const db = await getInstance();
        const messageList = JSON.parse(messageListStr).map((v) => convertToSnakeCaseObject(v));
        const execResult = databaseBatchInsertConversationUnreadMessageList(db, messageList);
        return formatResponse(execResult[0]);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
