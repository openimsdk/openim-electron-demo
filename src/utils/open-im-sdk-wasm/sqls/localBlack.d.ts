import { Database, QueryExecResult } from '@jlongster/sql.js';
export declare type LocalBlack = {
    [key: string]: any;
};
export declare function locaBlacks(db: Database): QueryExecResult[];
export declare function getBlackList(db: Database): QueryExecResult[];
export declare function getBlackListUserID(db: Database): QueryExecResult[];
export declare function getBlackInfoByBlockUserID(db: Database, blockUserID: string, loginUserID: string): QueryExecResult[];
export declare function getBlackInfoList(db: Database, blockUserIDList: string[]): QueryExecResult[];
export declare function insertBlack(db: Database, localBlack: LocalBlack): QueryExecResult[];
export declare function updateBlack(db: Database, localBlack: LocalBlack): QueryExecResult[];
export declare function deleteBlack(db: Database, blockUserID: string, loginUserID: string): QueryExecResult[];
