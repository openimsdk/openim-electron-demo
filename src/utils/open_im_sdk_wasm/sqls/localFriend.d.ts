import { Database, QueryExecResult } from '@jlongster/sql.js';
export declare type LocalFriend = {
    [key: string]: any;
};
export declare function localFriends(db: Database): QueryExecResult[];
export declare function insertFriend(db: Database, localFriend: LocalFriend): QueryExecResult[];
export declare function deleteFriend(db: Database, friendUserID: string, loginUserID: string): QueryExecResult[];
export declare function updateFriend(db: Database, localFriend: LocalFriend): QueryExecResult[];
export declare function getAllFriendList(db: Database, loginUser: string): QueryExecResult[];
export declare function searchFriendList(db: Database, keyword: string, isSearchUserID: boolean, isSearchNickname: boolean, isSearchRemark: boolean): QueryExecResult[];
export declare function getFriendInfoByFriendUserID(db: Database, friendUserID: string, loginUser: string): QueryExecResult[];
export declare function getFriendInfoList(db: Database, friendUserIDList: string[]): QueryExecResult[];
