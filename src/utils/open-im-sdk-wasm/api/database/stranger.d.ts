import { LocalStranger } from '../../sqls';
export declare function getStrangerInfo(userIDListStr: string): Promise<string>;
export declare function setStrangerInfo(localStrangerInfoListStr: string): Promise<string>;
export declare function setSingleStrangerInfo(localStrangerInfo: LocalStranger): Promise<string>;
