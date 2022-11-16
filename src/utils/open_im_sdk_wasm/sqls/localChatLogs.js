import squel from 'squel';
export function localChatLogs(db) {
    return db.exec(`
      create table if not exists 'local_chat_logs' (
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
        'seq' integer default 0,
        'send_time' integer,
        'create_time' integer,
        'attached_info' varchar(1024),
        'ex' varchar(1024),
        primary key ('client_msg_id'))
    `);
}
export function getMessage(db, messageId) {
    return db.exec(`
      select * from 'local_chat_logs' where client_msg_id='${messageId}'
    `);
}
export function getMultipleMessage(db, msgIDList) {
    const values = msgIDList.map(v => `'${v}'`).join(',');
    return db.exec(`
    SELECT * FROM local_chat_logs WHERE client_msg_id IN (${values}) ORDER BY send_time DESC
    `);
}
export function getSendingMessageList(db) {
    return db.exec(`
      select * from local_chat_logs where status = 1;
    `);
}
export function getNormalMsgSeq(db) {
    return db.exec(`
      select ifnull(max(seq),0) from local_chat_logs;
    `);
}
export function updateMessageTimeAndStatus(db, clientMsgID, serverMsgID, sendTime, status) {
    return db.exec(`
      update local_chat_logs set
        server_msg_id='${serverMsgID}',
        status=${status} ,
        send_time=${sendTime}
      where client_msg_id='${clientMsgID}' and seq=0;
    `);
}
export function updateMessage(db, clientMsgId, message) {
    const sql = squel
        .update()
        .table('local_chat_logs')
        .setFields(message)
        .where(`client_msg_id = '${clientMsgId}'`)
        .toString();
    return db.exec(sql);
}
export function insertMessage(db, message) {
    const sql = squel
        .insert()
        .into('local_chat_logs')
        .setFields(message)
        .toString();
    return db.exec(sql);
}
export function batchInsertMessageList(db, messageList) {
    const sql = squel
        .insert()
        .into('local_chat_logs')
        .setFieldsRows(messageList)
        .toString();
    return db.exec(sql);
}
export function getMessageList(db, sourceID, sessionType, count, startTime, isReverse, loginUserID) {
    const isSelf = loginUserID === sourceID;
    const condition = isSelf
        ? `recv_id = "${sourceID}" and send_id = "${sourceID}"`
        : `(recv_id = "${sourceID}" or send_id = "${sourceID}")`;
    return db.exec(`
        select * from local_chat_logs
        where
            ${condition}
            and status <= 3
            and send_time ${isReverse ? '>' : '<'} ${startTime}
            and session_type = ${sessionType}
        order by send_time ${isReverse ? 'asc' : 'desc'}
        limit ${count};    
    `);
}
export function getMessageListNoTime(db, sourceID, sessionType, count, isReverse, loginUserID) {
    const isSelf = loginUserID === sourceID;
    const condition = isSelf
        ? `recv_id = "${sourceID}" and send_id = "${sourceID}"`
        : `(recv_id = "${sourceID}" or send_id = "${sourceID}")`;
    return db.exec(`
        select * from local_chat_logs
        where
            ${condition}
            and status <= 3
            and session_type = ${sessionType}
        order by send_time ${isReverse ? 'asc' : 'desc'}
        limit ${count};    
    `);
}
export function messageIfExists(db, clientMsgID) {
    return db.exec(`
        select count(*) from local_chat_logs
        where 
            client_msg_id = "${clientMsgID}";
    `);
}
export function messageIfExistsBySeq(db, seq) {
    return db.exec(`
        select count(*) from local_chat_logs
        where 
            seq = ${seq};
    `);
}
export function searchMessageByKeyword(db, contentType, keywordList, keywordListMatchType, sourceID, startTime, endTime, sessionType, offset, count) {
    const finalEndTime = endTime ? endTime : new Date().getTime();
    const condition = sessionType !== 2
        ? `(send_id=="${sourceID}" OR recv_id=="${sourceID}")`
        : `recv_id=="${sourceID}"`;
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
    SELECT * FROM local_chat_logs 
          WHERE session_type==${sessionType}
          And ${condition}
          And send_time  between ${startTime} and ${finalEndTime} 
          AND status <=3  
          And content_type IN (${values}) 
          ${subCondition}
    ORDER BY send_time DESC LIMIT ${count} OFFSET ${offset};
    `);
}
export function searchMessageByContentType(db, contentType, sourceID, startTime, endTime, sessionType, offset, count) {
    const values = contentType.map(v => `${v}`).join(',');
    const finalEndTime = endTime ? endTime : new Date().getTime();
    const condition = sessionType !== 2
        ? `(send_id=="${sourceID}" OR recv_id=="${sourceID}")`
        : `recv_id=="${sourceID}"`;
    return db.exec(`  
    SELECT * FROM local_chat_logs 
          WHERE session_type==${sessionType}
          And ${condition}
          And send_time between ${startTime} and ${finalEndTime} 
          AND status <=3 
          And content_type IN (${values}) 
    ORDER BY send_time DESC LIMIT ${count} OFFSET ${offset};
    `);
}
export function searchMessageByContentTypeAndKeyword(db, contentType, keywordList, keywordListMatchType, startTime, endTime) {
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
    SELECT * FROM local_chat_logs 
          WHERE send_time between ${startTime} and ${finalEndTime}
          AND status <=3  
          And content_type IN (${values})
          ${subCondition}
    ORDER BY send_time DESC
    `);
}
export function updateMsgSenderNickname(db, sendID, nickname, sessionType) {
    return db.exec(`  
    UPDATE local_chat_logs 
          SET sender_nick_name="${nickname}" 
          WHERE send_id = "${sendID}" 
          and session_type = ${sessionType}
          and sender_nick_name != "${nickname}"
    `);
}
export function updateMsgSenderFaceURL(db, sendID, faceURL, sessionType) {
    return db.exec(`  
    UPDATE local_chat_logs 
          SET sender_face_url="${faceURL}" 
          WHERE send_id = "${sendID}" 
          and session_type = ${sessionType}
          and sender_face_url != "${faceURL}"
    `);
}
export function updateMsgSenderFaceURLAndSenderNickname(db, sendID, faceURL, nickname, sessionType) {
    return db.exec(`  
    UPDATE local_chat_logs 
          SET sender_face_url="${faceURL}",sender_nick_name="${nickname}" 
          WHERE send_id = "${sendID}" 
          and session_type = ${sessionType}
    `);
}
export function getMsgSeqByClientMsgID(db, clientMsgID) {
    return db.exec(`  
    SELECT seq FROM local_chat_logs 
    WHERE client_msg_id="${clientMsgID}" 
    LIMIT 1
    `);
}
export function getMsgSeqListByGroupID(db, groupID) {
    return db.exec(`  
    SELECT seq FROM local_chat_logs 
    WHERE recv_id="${groupID}"
    `);
}
export function getMsgSeqListByPeerUserID(db, userID) {
    return db.exec(`  
    SELECT seq FROM local_chat_logs 
    WHERE recv_id="${userID}" 
    or send_id="${userID}"
    `);
}
export function getMsgSeqListBySelfUserID(db, userID) {
    return db.exec(`  
    SELECT seq FROM local_chat_logs 
    WHERE recv_id="${userID}" 
    and send_id="${userID}"
    `);
}
export function deleteAllMessage(db) {
    return db.exec(`  
    UPDATE local_chat_logs SET content="",status=4
    `);
}
export function getAllUnDeleteMessageSeqList(db) {
    return db.exec(`  
    SELECT seq FROM local_chat_logs WHERE status != 4
    `);
}
export function updateSingleMessageHasRead(db, sendID, clientMsgIDList) {
    const values = clientMsgIDList.map(v => `'${v}'`).join(',');
    return db.exec(`  
    UPDATE local_chat_logs SET is_read=1 
    WHERE send_id="${sendID}"  
    AND session_type=1 
    AND client_msg_id in (${values})
    `);
}
export function updateGroupMessageHasRead(db, clientMsgIDList, sessionType) {
    const values = clientMsgIDList.map(v => `'${v}'`).join(',');
    return db.exec(`
        update local_chat_logs
        set is_read =1
        where session_type=${sessionType}
            and client_msg_id in (${values})

    `);
}
export function updateMessageStatusBySourceID(db, sourceID, status, sessionType, loginUserID) {
    let condition = `(send_id= "${sourceID}" or recv_id="${sourceID}")`;
    if (sessionType === 1 && sourceID === loginUserID) {
        condition = `send_id= "${sourceID}" AND recv_id="${sourceID}"`;
    }
    return db.exec(`
        update local_chat_logs
        set status=${status}
        where session_type=${sessionType}
        AND ${condition}
    `);
}
