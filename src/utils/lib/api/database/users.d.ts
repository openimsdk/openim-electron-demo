import { ClientUser } from '../../sqls';
export declare function getLoginUser(userID: string): Promise<string>;
export declare function insertLoginUser(userStr: string): Promise<string>;
export declare function updateLoginUserByMap(userID: string, user: ClientUser): Promise<string>;
