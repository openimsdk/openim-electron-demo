import squel from 'squel';
export function localConversationUnreadMessages(db) {
    return db.exec(`
      create table if not exists 'local_conversation_unread_messages' (
            'conversation_id' char(128),
            'client_msg_id' char(64),
            'send_time' integer,
            'ex' varchar(1024),
            primary key (
                'conversation_id',
                'client_msg_id'
            )
        );
    `);
}
export function deleteConversationUnreadMessageList(db, conversationID, sendTime) {
    return db.exec(`
        delete from local_conversation_unread_messages where conversation_id = '${conversationID}' and send_time <= ${sendTime};
    `);
}
export function batchInsertConversationUnreadMessageList(db, messageList) {
    const sql = squel
        .insert()
        .into('local_conversation_unread_messages')
        .setFieldsRows(messageList)
        .toString();
    return db.exec(sql);
}
