export declare function getBlackList(): Promise<string>;
export declare function getBlackListUserID(blockUserID: string): Promise<string>;
export declare function getBlackInfoByBlockUserID(blockUserID: string, loginUserID: string): Promise<string>;
export declare function getBlackInfoList(blockUserIDListStr: string): Promise<string>;
export declare function insertBlack(localBlackStr: string): Promise<string>;
export declare function deleteBlack(blockUserID: string, loginUserID: string): Promise<string>;
export declare function updateBlack(localBlackStr: string): Promise<string>;
