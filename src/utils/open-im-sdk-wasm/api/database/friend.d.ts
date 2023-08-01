export declare function insertFriend(localFriendStr: string): Promise<string>;
export declare function deleteFriend(friendUserID: string, loginUserID: string): Promise<string>;
export declare function updateFriend(localFriendStr: string): Promise<string>;
export declare function getAllFriendList(loginUserID: string): Promise<string>;
export declare function getPageFriendList(offset: number, count: number, loginUserID: string): Promise<string>;
export declare function searchFriendList(key: string, isSearchUserID: boolean, isSearchNickname: boolean, isSearchRemark: boolean): Promise<string>;
export declare function getFriendInfoByFriendUserID(friendUserID: string, loginUserID: string): Promise<string>;
export declare function getFriendInfoList(friendUserIDListStr: string): Promise<string>;
