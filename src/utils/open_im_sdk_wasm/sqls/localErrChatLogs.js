import squel from 'squel';
export function localErrChatLogs(db) {
    return db.exec(`
    create table if not exists 'local_err_chat_logs' (
        'seq' integer,
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
        'send_time' integer,
        'create_time' integer,
        'attached_info' varchar(1024),
        'ex' varchar(1024),
        PRIMARY KEY ('seq')
      );
      `);
}
export function getAbnormalMsgSeq(db) {
    return db.exec(`
      select ifnull(max(seq),0) from local_err_chat_logs;
      `);
}
export function getAbnormalMsgSeqList(db) {
    return db.exec(`
    SELECT seq FROM local_err_chat_logs
      `);
}
export function batchInsertExceptionMsg(db, messageList) {
    const sql = squel
        .insert()
        .into('local_err_chat_logs')
        .setFieldsRows(messageList)
        .toString();
    return db.exec(sql);
}
export function isExistsInErrChatLogBySeq(db, seq) {
    return db.exec(`
          select count(*) from local_err_chat_logs
          where 
              seq = ${seq};
      `);
}
