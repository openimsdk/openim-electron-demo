import { Database, QueryExecResult } from '@jlongster/sql.js';
export declare type LocalSendingMessage = {
    [key: string]: any;
};
export declare function localSendingMessages(db: Database): QueryExecResult[];
export declare function insertSendingMessage(db: Database, localSendingMessage: LocalSendingMessage): QueryExecResult[];
export declare function deleteSendingMessage(db: Database, conversationID: string, clientMsgID: string): QueryExecResult[];
export declare function getAllSendingMessages(db: Database): QueryExecResult[];
