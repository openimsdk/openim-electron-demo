import squel from 'squel';
export function tempCacheLocalChatLogs(db) {
    return db.exec(`
    create table if not exists 'temp_cache_local_chat_logs' (
        'client_msg_id' char(64),
        'server_msg_id' char(64),
        'send_id' char(64),
        'recv_id' char(64),
        'sender_platform_id' integer,
        'sender_nick_name' varchar(255),
        'sender_face_url' varchar(255),
        'session_type' integer,
        'msg_from' integer,
        'content_type' integer,
        'content' varchar(1000),
        'is_read' numeric,
        'status' integer,
        'seq' integer DEFAULT 0,
        'send_time' integer,
        'create_time' integer,
        'attached_info' varchar(1024),
        'ex' varchar(1024),
        PRIMARY KEY ('client_msg_id')
      );
      `);
}
export function batchInsertTempCacheMessageList(db, messageList) {
    const sql = squel
        .insert()
        .into('temp_cache_local_chat_logs')
        .setFieldsRows(messageList)
        .toString();
    return db.exec(sql);
}
