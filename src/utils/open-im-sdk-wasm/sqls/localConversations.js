import squel from 'squel';
export function localConversations(db) {
    return db.exec(`
      create table if not exists 'local_conversations' (
            'conversation_id' char(128),
            'conversation_type' integer,
            'user_id' char(64),
            'group_id' char(128),
            'show_name' varchar(255),
            'face_url' varchar(255),
            'recv_msg_opt' integer,
            'unread_count' integer,
            'group_at_type' integer,
            'latest_msg' varchar(1000),
            'latest_msg_send_time' integer,
            'draft_text' text,
            'draft_text_time' integer,
            'is_pinned' numeric,
            'burn_duration' integer,
            'is_private_chat' numeric,
            'is_not_in_group' numeric,
            'update_unread_count_time' integer,
            'attached_info' varchar(1024),
            'ex' varchar(1024),
            'max_seq' integer,
            'min_seq' integer,
            'has_read_seq' integer,
            'msg_destruct_time' integer default 604800,
            'is_msg_destruct' numeric default false,
            primary key ('conversation_id')
        )
    `);
}
export function getConversationByUserID(db, userID) {
    return db.exec(`
        select * from local_conversations where user_id = "${userID}" limit 1;
    `);
}
export function getAllConversationList(db) {
    return db.exec(`
        select * from local_conversations where latest_msg_send_time > 0 order by case when is_pinned=1 then 0 else 1 end,max(latest_msg_send_time,draft_text_time) desc;
    `);
}
export function getAllConversationListToSync(db) {
    return db.exec(`
        select * from local_conversations;
    `);
}
export function getAllSingleConversationIDList(db) {
    return db.exec(`
        select conversation_id from local_conversations where conversation_type = 1;
    `);
}
export function getAllConversationIDList(db) {
    return db.exec(`
        select conversation_id from local_conversations;
    `);
}
export function getHiddenConversationList(db) {
    return db.exec(`
        select * from local_conversations where latest_msg_send_time = 0;
    `);
}
export function getConversationListSplit(db, offset, count) {
    return db.exec(`
    SELECT *
    FROM local_conversations
    WHERE latest_msg_send_time > 0
    ORDER BY case
                 when is_pinned = 1 then 0
                 else 1 end, max(latest_msg_send_time, draft_text_time) DESC
    LIMIT ${count} OFFSET ${offset}
    `);
}
export function getConversation(db, conversationID) {
    return db.exec(`
        select * from local_conversations where conversation_id = '${conversationID}' limit 1;
    `);
}
export function getMultipleConversation(db, conversationIDList) {
    const ids = conversationIDList.map(v => `'${v}'`);
    return db.exec(`
        select * from local_conversations where conversation_id in (${ids.join(',')});
    `);
}
export function updateColumnsConversation(db, conversationID, conversation) {
    const sql = squel
        .update()
        .table('local_conversations')
        .setFields(conversation)
        .where(`conversation_id = '${conversationID}'`)
        .toString();
    return db.exec(sql);
}
export function incrConversationUnreadCount(db, conversationID) {
    return db.exec(`
        update local_conversations set 
            unread_count=unread_count+1 
        where conversation_id = '${conversationID}';
    `);
}
export function decrConversationUnreadCount(db, conversationID, count) {
    db.exec('begin');
    db.exec(`
        update local_conversations set 
            unread_count=unread_count-${count} 
        where conversation_id = '${conversationID}';
    `);
    const current = db.exec(`select unread_count from local_conversations where conversation_id = '${conversationID}'`);
    if (Number(current[0].values[0]) < 0) {
        db.exec(`
          update local_conversations set 
              unread_count=${0} 
          where conversation_id = '${conversationID}';
      `);
    }
    return db.exec('commit');
}
export function batchInsertConversationList(db, conversationList) {
    const sql = squel
        .insert()
        .into('local_conversations')
        .setFieldsRows(conversationList)
        .toString();
    return db.exec(sql);
}
export function insertConversation(db, localConversation) {
    const sql = squel
        .insert()
        .into('local_conversations')
        .setFields(localConversation)
        .toString();
    return db.exec(sql);
}
export function updateConversation(db, localConversation) {
    const sql = squel
        .update()
        .table('local_conversations')
        .setFields(localConversation)
        .where(`conversation_id = '${localConversation.conversation_id}'`)
        .toString();
    return db.exec(sql);
}
export function deleteConversation(db, conversationID) {
    return db.exec(`
    DELETE
      FROM local_conversations
      WHERE conversation_id = "${conversationID}"
  `);
}
export function conversationIfExists(db, conversationID) {
    return db.exec(`
  SELECT count(*)
  FROM local_conversations
  WHERE conversation_id = "${conversationID}"
  `);
}
export function resetConversation(db, conversationID) {
    return db.exec(`
  UPDATE local_conversations
    SET unread_count=0,
    latest_msg="",
    latest_msg_send_time=0,
    draft_text="",
    draft_text_time=0
WHERE conversation_id = "${conversationID}"
  `);
}
export function resetAllConversation(db) {
    return db.exec(`
  UPDATE local_conversations
    SET unread_count=0,
    latest_msg="",
    latest_msg_send_time=0,
    draft_text="",
    draft_text_time=0
  `);
}
export function clearConversation(db, conversationID) {
    return db.exec(`
  UPDATE local_conversations
SET unread_count=0,
    latest_msg="",
    draft_text="",
    draft_text_time=0
WHERE conversation_id = "${conversationID}"
  `);
}
export function clearAllConversation(db) {
    return db.exec(`
  UPDATE local_conversations
SET unread_count=0,
    latest_msg="",
    draft_text="",
    draft_text_time=0
  `);
}
export function setConversationDraft(db, conversationID, draftText) {
    const nowDate = new Date().getTime();
    return db.exec(`
  update local_conversations
    set draft_text='${draftText}',
    draft_text_time=${nowDate},
    latest_msg_send_time=case when latest_msg_send_time = 0 then ${nowDate} else latest_msg_send_time end
    where conversation_id = "${conversationID}"
  `);
}
export function removeConversationDraft(db, conversationID, draftText) {
    return db.exec(`
  update local_conversations
    set draft_text="${draftText}",
    draft_text_time=0
    where conversation_id = "${conversationID}"
  `);
}
export function unPinConversation(db, conversationID, isPinned) {
    return db.exec(`
  update local_conversations
    set is_pinned=${isPinned},
    draft_text_time=case when draft_text = "" then 0 else draft_text_time end
    where conversation_id = "${conversationID}"
  `);
}
export function getTotalUnreadMsgCount(db) {
    return db.exec(`
        select sum(unread_count) from local_conversations where recv_msg_opt < 2;
    `);
}
export function setMultipleConversationRecvMsgOpt(db, conversationIDList, opt) {
    const values = conversationIDList.map(v => `${v}`).join(',');
    return db.exec(`
    UPDATE local_conversations
    SET recv_msg_opt=${opt}
    WHERE conversation_id IN (${values})
    `);
}
export function getAllConversations(db) {
    return db.exec(`
    SELECT * FROM local_conversations
    `);
}
