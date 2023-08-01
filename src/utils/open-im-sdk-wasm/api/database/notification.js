import { DatabaseErrorCode } from '../../constant';
import { insertNotificationSeq as databaseInsertNotificationSeq, setNotificationSeq as databaseSetNotificationSeq, getNotificationAllSeqs as databaseGetNotificationAllSeqs, } from '../../sqls';
import { converSqlExecResult, formatResponse } from '../../utils';
import { getInstance } from './instance';
export async function setNotificationSeq(conversationID, seq) {
    try {
        const db = await getInstance();
        let execResult = databaseSetNotificationSeq(db, conversationID, seq);
        const modified = db.getRowsModified();
        if (modified === 0) {
            execResult = databaseInsertNotificationSeq(db, conversationID, seq);
        }
        return formatResponse(execResult[0]);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function getNotificationAllSeqs() {
    try {
        const db = await getInstance();
        const execResult = databaseGetNotificationAllSeqs(db);
        return formatResponse(converSqlExecResult(execResult[0], 'CamelCase'));
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
