import { Database, QueryExecResult } from '@jlongster/sql.js';
export declare type ClientUser = {
    [key: string]: unknown;
};
export declare function localUsers(db: Database): QueryExecResult[];
export declare function getLoginUser(db: Database, userID: string): QueryExecResult[];
export declare function insertLoginUser(db: Database, user: ClientUser): QueryExecResult[];
export declare function updateLoginUserByMap(db: Database, userID: string, user: ClientUser): QueryExecResult[];
