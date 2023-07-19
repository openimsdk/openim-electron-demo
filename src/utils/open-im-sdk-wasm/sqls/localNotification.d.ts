import { Database, QueryExecResult } from '@jlongster/sql.js';
export declare type LocalNotification = {
    [key: string]: any;
};
export declare function localNotification(db: Database): QueryExecResult[];
export declare function insertNotificationSeq(db: Database, conversationID: string, seq: number): QueryExecResult[];
export declare function setNotificationSeq(db: Database, conversationID: string, seq: number): QueryExecResult[];
export declare function getNotificationAllSeqs(db: Database): QueryExecResult[];
