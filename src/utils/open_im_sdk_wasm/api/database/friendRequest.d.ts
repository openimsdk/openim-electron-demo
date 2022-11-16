export declare function insertFriendRequest(localFriendRequestStr: string): Promise<string>;
export declare function deleteFriendRequestBothUserID(fromUserID: string, toUserID: string): Promise<string>;
export declare function updateFriendRequest(localFriendRequestStr: string): Promise<string>;
export declare function getRecvFriendApplication(loginUserID: string): Promise<string>;
export declare function getSendFriendApplication(fromUserId: string): Promise<string>;
export declare function getFriendApplicationByBothID(fromUserID: string, toUserID: boolean): Promise<string>;
