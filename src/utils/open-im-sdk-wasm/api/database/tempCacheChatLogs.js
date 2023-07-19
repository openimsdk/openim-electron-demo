import { DatabaseErrorCode } from '../../constant';
import { batchInsertTempCacheMessageList as databseBatchInsertTempCacheMessageList, } from '../../sqls';
import { convertToSnakeCaseObject, formatResponse } from '../../utils';
import { getInstance } from './instance';
export async function batchInsertTempCacheMessageList(messageListStr) {
    try {
        const db = await getInstance();
        const messageList = JSON.parse(messageListStr).map((v) => convertToSnakeCaseObject(v));
        const execResult = databseBatchInsertTempCacheMessageList(db, messageList);
        return formatResponse(execResult[0]);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function InsertTempCacheMessage(messageStr) {
    return batchInsertTempCacheMessageList(`[${messageStr}]`);
}
