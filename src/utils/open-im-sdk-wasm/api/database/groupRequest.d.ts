export declare function insertGroupRequest(localGroupRequestStr: string): Promise<string>;
export declare function deleteGroupRequest(groupID: string, userID: string): Promise<string>;
export declare function updateGroupRequest(localGroupRequestStr: string): Promise<string>;
export declare function getSendGroupApplication(): Promise<string>;
export declare function insertAdminGroupRequest(localAdminGroupRequestStr: string): Promise<string>;
export declare function deleteAdminGroupRequest(groupID: string, userID: string): Promise<string>;
export declare function updateAdminGroupRequest(localGroupRequestStr: string): Promise<string>;
export declare function getAdminGroupApplication(): Promise<string>;
