import { Database, QueryExecResult } from '@jlongster/sql.js';
export declare type ClientGroup = {
    [key: string]: unknown;
};
export declare function localSuperGroups(db: Database): QueryExecResult[];
export declare function getJoinedSuperGroupList(db: Database): QueryExecResult[];
export declare function insertSuperGroup(db: Database, group: ClientGroup): QueryExecResult[];
export declare function updateSuperGroup(db: Database, groupID: string, group: ClientGroup): QueryExecResult[];
export declare function deleteSuperGroup(db: Database, groupID: string): QueryExecResult[];
export declare function getSuperGroupInfoByGroupID(db: Database, groupID: string): QueryExecResult[];
