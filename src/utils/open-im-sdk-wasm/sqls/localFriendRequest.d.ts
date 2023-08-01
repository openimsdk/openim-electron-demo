import { Database, QueryExecResult } from '@jlongster/sql.js';
export declare type LocalFriendRequest = {
    [key: string]: any;
};
export declare function localFriendRequests(db: Database): QueryExecResult[];
export declare function insertFriendRequest(db: Database, localFriendRequest: LocalFriendRequest): QueryExecResult[];
export declare function deleteFriendRequestBothUserID(db: Database, fromUserID: string, toUserID: string): QueryExecResult[];
export declare function updateFriendRequest(db: Database, localFriendRequest: LocalFriendRequest): QueryExecResult[];
export declare function getRecvFriendApplication(db: Database, loginUserID: string): QueryExecResult[];
export declare function getSendFriendApplication(db: Database, loginUserID: string): QueryExecResult[];
export declare function getFriendApplicationByBothID(db: Database, fromUserID: string, toUserID: boolean): QueryExecResult[];
export declare function getBothFriendReq(db: Database, fromUserID: string, toUserID: boolean): QueryExecResult[];
