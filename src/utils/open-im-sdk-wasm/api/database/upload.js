import { DatabaseErrorCode } from '../../constant';
import { getUpload as databaseGetUpload, insertUpload as databaseInsertUpload, updateUpload as databaseUpdateUpload, deleteUpload as databaseDeleteUpload, } from '../../sqls';
import { converSqlExecResult, convertObjectField, convertToSnakeCaseObject, formatResponse, } from '../../utils';
import { getInstance } from './instance';
export async function getUpload(partHash) {
    try {
        const db = await getInstance();
        const execResult = databaseGetUpload(db, partHash);
        const upload = converSqlExecResult(execResult[0], 'CamelCase');
        if (upload.length === 0) {
            throw `no upload with partHash = ${partHash}`;
        }
        return formatResponse(upload[0]);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function insertUpload(uploadStr) {
    try {
        const db = await getInstance();
        const upload = convertToSnakeCaseObject(convertObjectField(JSON.parse(uploadStr)));
        const execResult = databaseInsertUpload(db, upload);
        return formatResponse(execResult);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function updateUpload(uploadStr) {
    try {
        const db = await getInstance();
        const upload = convertToSnakeCaseObject(convertObjectField(JSON.parse(uploadStr)));
        const execResult = databaseUpdateUpload(db, upload);
        return formatResponse(execResult);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
export async function deleteUpload(partHash) {
    try {
        const db = await getInstance();
        const execResult = databaseDeleteUpload(db, partHash);
        return formatResponse(execResult);
    }
    catch (e) {
        console.error(e);
        return formatResponse(undefined, DatabaseErrorCode.ErrorInit, JSON.stringify(e));
    }
}
