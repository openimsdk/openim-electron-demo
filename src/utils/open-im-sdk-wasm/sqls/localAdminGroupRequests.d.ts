import { Database, QueryExecResult } from '@jlongster/sql.js';
export declare type LocalAdminGroupRequest = {
    [key: string]: any;
};
export declare function localAdminGroupRequests(db: Database): QueryExecResult[];
export declare function insertAdminGroupRequest(db: Database, localGroupRequest: LocalAdminGroupRequest): QueryExecResult[];
export declare function deleteAdminGroupRequest(db: Database, groupID: string, userID: string): QueryExecResult[];
export declare function updateAdminGroupRequest(db: Database, localGroupRequest: LocalAdminGroupRequest): QueryExecResult[];
export declare function getAdminGroupApplication(db: Database): QueryExecResult[];
