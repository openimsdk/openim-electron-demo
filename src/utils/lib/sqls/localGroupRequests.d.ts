import { Database, QueryExecResult } from '@jlongster/sql.js';
export declare type LocalGroupRequest = {
    [key: string]: any;
};
export declare function localGroupRequests(db: Database): QueryExecResult[];
export declare function insertGroupRequest(db: Database, localGroupRequest: LocalGroupRequest): QueryExecResult[];
export declare function deleteGroupRequest(db: Database, groupID: string, userID: string): QueryExecResult[];
export declare function updateGroupRequest(db: Database, localGroupRequest: LocalGroupRequest): QueryExecResult[];
export declare function getSendGroupApplication(db: Database): QueryExecResult[];
