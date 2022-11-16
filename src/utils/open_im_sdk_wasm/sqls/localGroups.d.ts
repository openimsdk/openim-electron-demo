import { Database, QueryExecResult } from '@jlongster/sql.js';
export declare type LocalGroup = {
    [key: string]: any;
};
export declare function localGroups(db: Database): QueryExecResult[];
export declare function insertGroup(db: Database, localGroup: LocalGroup): QueryExecResult[];
export declare function deleteGroup(db: Database, groupID: string): QueryExecResult[];
export declare function updateGroup(db: Database, groupID: string, localGroup: LocalGroup): QueryExecResult[];
export declare function getJoinedGroupList(db: Database): QueryExecResult[];
export declare function getGroupInfoByGroupID(db: Database, groupID: string): QueryExecResult[];
export declare function getAllGroupInfoByGroupIDOrGroupName(db: Database, keyword: string, isSearchGroupID: boolean, isSearchGroupName: boolean): QueryExecResult[];
export declare function subtractMemberCount(db: Database, groupID: string): QueryExecResult[];
export declare function addMemberCount(db: Database, groupID: string): QueryExecResult[];
