export declare function getJoinedSuperGroupList(): Promise<string>;
export declare function getJoinedSuperGroupIDList(): Promise<string>;
export declare function getSuperGroupInfoByGroupID(groupID: string): Promise<string>;
export declare function deleteSuperGroup(groupID: string): Promise<string>;
export declare function insertSuperGroup(groupStr: string): Promise<string>;
export declare function updateSuperGroup(groupID: string, groupStr: string): Promise<string>;
