import { Database, QueryExecResult } from '@jlongster/sql.js';
export declare type LocalStranger = {
    [key: string]: any;
};
export declare function localStranger(db: Database): QueryExecResult[];
export declare function getStrangerInfo(db: Database, userIDList: string[]): QueryExecResult[];
export declare function insertStrangerInfo(db: Database, localStranger: LocalStranger): QueryExecResult[];
export declare function updateStrangerInfo(db: Database, localStranger: LocalStranger): QueryExecResult[];
