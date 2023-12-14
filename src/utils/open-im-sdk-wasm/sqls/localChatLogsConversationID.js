import squel from 'squel';
function _initLocalChatLogsTable(db, conversationID) {
    localChatLogsConversationID(db, conversationID);
}
export function localChatLogsConversationID(db, conversationID) {
    return db.exec(`
    create table if not exists 'chat_logs_${conversationID}' (
        'client_msg_id' char(32),
        'server_msg_id' char(32),
        'send_id' char(32),
        'recv_id' char(32),
        'sender_platform_id' smallint,
        'sender_nick_name' varchar(255),
        'sender_face_url' varchar(255),
        'session_type' smallint,
        'msg_from' smallint,
        'content_type' smallint,
        'content' varchar(1000),
        'is_read' tinyint(1),
        'status' smallint,
        'seq' int DEFAULT 0,
        'send_time' int,
        'create_time' int,
        'attached_info' varchar(1024),
        'ex' varchar(1024),
        'local_ex' varchar(1024),
        'is_react' tinyint(1),
        'is_external_extensions' tinyint(1),
        'msg_first_modify_time' int,
        PRIMARY KEY ('client_msg_id')
      );
      `);
}
export function getMessage(db, conversationID, clientMsgID) {
    _initLocalChatLogsTable(db, conversationID);
    return db.exec(`
    SELECT * FROM 'chat_logs_${conversationID}' WHERE client_msg_id = '${clientMsgID}' limit 1
    `);
}
export function getAlreadyExistSeqList(db, conversationID, lostSeqList) {
    return db.exec(`
    SELECT seq FROM 'chat_logs_${conversationID}' WHERE seq in (${lostSeqList.join(',')})
    `);
}
export function getMessageList(db, conversationID, count, startTime, isReverse) {
    return db.exec(`
    SELECT * FROM 'chat_logs_${conversationID}' WHERE send_time ${!isReverse ? '<' : '>'} ${startTime} ORDER BY send_time ${!isReverse ? 'DESC' : 'ASC'} LIMIT ${count}
    `);
}
export function getMessageBySeq(db, conversationID, seq) {
    _initLocalChatLogsTable(db, conversationID);
    return db.exec(`
    SELECT * FROM 'chat_logs_${conversationID}' WHERE seq = ${seq} limit 1;
    `);
}
export function getMessagesByClientMsgIDs(db, conversationID, clientMsgIDs) {
    return db.exec(`
    SELECT * FROM 'chat_logs_${conversationID}' WHERE client_msg_id in (${clientMsgIDs
        .map(item => `'${item}'`)
        .join(',')}) order by send_time desc;
    `);
}
export function getMessagesBySeqs(db, conversationID, seqs) {
    _initLocalChatLogsTable(db, conversationID);
    return db.exec(`
    SELECT * FROM 'chat_logs_${conversationID}' WHERE seq in (${seqs.join(',')}) order by send_time desc;
    `);
}
export function getMessageListNoTime(db, conversationID, count, isReverse) {
    _initLocalChatLogsTable(db, conversationID);
    return db.exec(`
    SELECT * FROM 'chat_logs_${conversationID}' ORDER BY send_time ${!isReverse ? 'DESC' : 'ASC'} LIMIT ${count}
    `);
}
export function getConversationNormalMsgSeq(db, conversationID) {
    _initLocalChatLogsTable(db, conversationID);
    return db.exec(`
      SELECT seq FROM 'chat_logs_${conversationID}' order by seq desc limit 1;
      `);
}
export function getConversationPeerNormalMsgSeq(db, conversationID, loginUserID) {
    return db.exec(`
      SELECT seq FROM 'chat_logs_${conversationID}' where send_id != '${loginUserID}' order by seq desc limit 1;
      `);
}
export function getSendingMessageList(db, conversationID) {
    return db.exec(`
    SELECT * FROM 'chat_logs_${conversationID}' WHERE status = 1;
    `);
}
export function updateMessageTimeAndStatus(db, conversationID, clientMsgID, serverMsgID, sendTime, status) {
    return db.exec(`
    UPDATE 'chat_logs_${conversationID}' SET server_msg_id = '${serverMsgID}', send_time = ${sendTime}, status = ${status} WHERE client_msg_id = '${clientMsgID}' and seq=0;
    `);
}
export function updateMessage(db, conversationID, clientMsgID, localChatLogs) {
    const sql = squel
        .update()
        .table(`chat_logs_${conversationID}`)
        .setFields(localChatLogs)
        .where(`client_msg_id = '${clientMsgID}'`)
        .toString();
    return db.exec(sql);
}
export function updateMessageBySeq(db, conversationID, seq, localChatLogs) {
    const sql = squel
        .update()
        .table(`chat_logs_${conversationID}`)
        .setFields(localChatLogs)
        .where(`seq = '${seq}'`)
        .toString();
    return db.exec(sql);
}
export function batchInsertMessageList(db, conversationID, messageList) {
    const sql = squel
        .insert()
        .into(`chat_logs_${conversationID}`)
        .setFieldsRows(messageList)
        .toString();
    return db.exec(sql);
}
export function insertMessage(db, conversationID, localChatLogs) {
    const sql = squel
        .insert()
        .into(`chat_logs_${conversationID}`)
        .setFields(localChatLogs)
        .toString();
    return db.exec(sql);
}
export function getMultipleMessage(db, conversationID, clientMsgIDs) {
    return db.exec(`
    SELECT * FROM 'chat_logs_${conversationID}' WHERE client_msg_id in (${clientMsgIDs
        .map(item => `'${item}'`)
        .join(',')}) order by send_time desc;
    `);
}
export function searchMessageByKeyword(db, conversationID, contentType, keywordList, keywordListMatchType, startTime, endTime, offset, count) {
    const finalEndTime = endTime ? endTime : new Date().getTime();
    let subCondition = '';
    const values = contentType.map(v => `${v}`).join(',');
    const connectStr = keywordListMatchType === 0 ? 'or ' : 'and ';
    keywordList.forEach((keyword, index) => {
        if (index == 0) {
            subCondition += 'And (';
        }
        if (index + 1 >= keywordList.length) {
            subCondition += 'content like ' + "'%" + keywordList[index] + "%') ";
        }
        else {
            subCondition +=
                'content like ' + "'%" + keywordList[index] + "%' " + connectStr;
        }
    });
    return db.exec(`  
    SELECT * FROM chat_logs_${conversationID} 
          WHERE send_time  between ${startTime} and ${finalEndTime} 
          AND status <=3  
          And content_type IN (${values}) 
          ${subCondition}
    ORDER BY send_time DESC LIMIT ${count} OFFSET ${offset};
    `);
}
export function searchMessageByContentType(db, conversationID, contentType, startTime, endTime, offset, count) {
    const values = contentType.map(v => `${v}`).join(',');
    const finalEndTime = endTime ? endTime : new Date().getTime();
    return db.exec(`  
    SELECT * FROM chat_logs_${conversationID} 
          WHERE send_time between ${startTime} and ${finalEndTime} 
          AND status <=3 
          And content_type IN (${values}) 
    ORDER BY send_time DESC LIMIT ${count} OFFSET ${offset};
    `);
}
export function searchMessageByContentTypeAndKeyword(db, conversationID, contentType, keywordList, keywordListMatchType, startTime, endTime) {
    const values = contentType.map(v => `${v}`).join(',');
    const finalEndTime = endTime ? endTime : new Date().getTime();
    let subCondition = '';
    const connectStr = keywordListMatchType === 0 ? 'or ' : 'and ';
    keywordList.forEach((keyword, index) => {
        if (index == 0) {
            subCondition += 'And (';
        }
        if (index + 1 >= keywordList.length) {
            subCondition += 'content like ' + "'%" + keywordList[index] + "%') ";
        }
        else {
            subCondition +=
                'content like ' + "'%" + keywordList[index] + "%' " + connectStr;
        }
    });
    return db.exec(`  
      SELECT * FROM chat_logs_${conversationID} 
            WHERE send_time between ${startTime} and ${finalEndTime} 
            AND status <=3 
            And content_type IN (${values}) 
            ${subCondition}
      ORDER BY send_time DESC;
      `);
}
export function messageIfExists(db, conversationID, clientMsgID) {
    return db.exec(`
      SELECT * FROM chat_logs_${conversationID} WHERE client_msg_id = '${clientMsgID}';
      `);
}
// export function MessageIfExistsBySeq(
//     db: Database,
//     conversationID: string,
//     seq: number
// ): QueryExecResult[] {
//     return db.exec(
//         `
//       SELECT * FROM 'chat_logs_${conversationID}' WHERE seq = ${seq};
//       `
//     );
// }
// export function UpdateGroupMessageHasRead(
//     db: Database,
// )
// export function getMultipleMessage(
//     db: Database,
// )
// export function updateMsgSenderNickname(
//     db: Database,
// )
// export function updateMsgSenderFaceURL(
//     db: Database,
// )
export function updateMsgSenderFaceURLAndSenderNickname(db, conversationID, sendID, faceURL, nickname) {
    _initLocalChatLogsTable(db, conversationID);
    return db.exec(`
      UPDATE chat_logs_${conversationID} SET sender_face_url = '${faceURL}', sender_nick_name = '${nickname}' WHERE send_id = '${sendID}';
      `);
}
// export function getMsgSeqByClientMsgID(
//     db: Database,
// )
// export function getMsgSeqListByGroupID(
//     db: Database,
// )
// export function getMsgSeqListByPeerUserID(
//     db: Database,
// )
// export function getMsgSeqListBySelfUserID(
//     db: Database,
// )
// export function deleteAllMessage(
//     db: Database,
// )
// export function getAllUnDeleteMessageSeqList(
//     db: Database,
// )
export function deleteConversationAllMessages(db, conversationID) {
    return db.exec(`
      DELETE FROM chat_logs_${conversationID} WHERE 1=1;
      `);
}
export function markDeleteConversationAllMessages(db, conversationID) {
    return db.exec(`
      UPDATE chat_logs_${conversationID} SET status = 2 WHERE (1=1) and (conversation_id = '${conversationID}')';
      `);
}
export function getUnreadMessage(db, conversationID, loginUserID) {
    return db.exec(`
      SELECT * FROM chat_logs_${conversationID} WHERE send_id != '${loginUserID}' and is_read = 0;
      `);
}
export function markConversationMessageAsReadBySeqs(db, conversationID, seqList, loginUserID) {
    _initLocalChatLogsTable(db, conversationID);
    const values = seqList.map(v => `${v}`).join(',');
    return db.exec(`
      UPDATE chat_logs_${conversationID} SET is_read = 1 WHERE seq IN (${values}) and send_id != '${loginUserID}';
      `);
}
export function markConversationMessageAsRead(db, conversationID, clientMsgIDList, loginUserID) {
    const values = clientMsgIDList.map(v => `'${v}'`).join(',');
    return db.exec(`
      UPDATE chat_logs_${conversationID} SET is_read = 1 WHERE client_msg_id IN (${values}) and send_id != '${loginUserID}';
      `);
}
export function updateColumnsMessage(db, conversationID, clientMsgID, localChatLogs) {
    const sql = squel
        .update()
        .table(`chat_logs_${conversationID}`)
        .setFields(localChatLogs)
        .where(`client_msg_id = '${clientMsgID}'`)
        .toString();
    return db.exec(sql);
}
export function deleteConversationMsgs(db, conversationID, clientMsgIDList) {
    const values = clientMsgIDList.map(v => `'${v}'`).join(',');
    return db.exec(`
      DELETE FROM chat_logs_${conversationID} WHERE client_msg_id IN (${values});
      `);
}
// export function updateSingleMessageHasRead(
//     db: Database,
// )
// export function updateGroupMessageHasRead(
//     db: Database,
// )
// export function updateMessageStatusBySourceID(
//     db: Database,
// )
export function markConversationAllMessageAsRead(db, conversationID, loginUserID) {
    return db.exec(`
      UPDATE chat_logs_${conversationID} SET is_read = 1 WHERE is_read = 0 and send_id != '${loginUserID}';
      `);
}
// export function deleteConversationMsgsBySeqs(
//     db: Database,
// )
export function searchAllMessageByContentType(db, conversationID, contentType) {
    return db.exec(`
      SELECT * FROM chat_logs_${conversationID} WHERE content_type = ${contentType};
      `);
}
