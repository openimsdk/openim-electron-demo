import { Database, QueryExecResult } from '@jlongster/sql.js';
export declare type ErrorClientMessage = {
    [key: string]: any;
};
export declare function localErrChatLogs(db: Database): QueryExecResult[];
export declare function getAbnormalMsgSeq(db: Database): QueryExecResult[];
export declare function getAbnormalMsgSeqList(db: Database): QueryExecResult[];
export declare function batchInsertExceptionMsg(db: Database, messageList: ErrorClientMessage[]): QueryExecResult[];
export declare function isExistsInErrChatLogBySeq(db: Database, seq: number): QueryExecResult[];
