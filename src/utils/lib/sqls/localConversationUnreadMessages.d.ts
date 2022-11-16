import { Database, QueryExecResult } from '@jlongster/sql.js';
export declare type ClientLocalConversationUnreadMessage = {
    [key: string]: any;
};
export declare function localConversationUnreadMessages(db: Database): QueryExecResult[];
export declare function deleteConversationUnreadMessageList(db: Database, conversationID: string, sendTime: number): QueryExecResult[];
export declare function batchInsertConversationUnreadMessageList(db: Database, messageList: ClientLocalConversationUnreadMessage[]): QueryExecResult[];
