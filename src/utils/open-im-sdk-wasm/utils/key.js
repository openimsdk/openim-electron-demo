const InternalConstraint = [
    ['user_id', 'userID'],
    ['group_id', 'groupID'],
    ['client_msg_id', 'clientMsgID'],
    ['server_msg_id', 'serverMsgID'],
    ['send_id', 'sendID'],
    ['recv_id', 'recvID'],
    ['sender_platform_id', 'senderPlatformID'],
    ['sender_nick_name', 'senderNickname'],
    ['sender_face_url', 'senderFaceURL'],
    ['session_type', 'sessionType'],
    ['msg_from', 'msgFrom'],
    ['content_type', 'contentType'],
    ['content', 'content'],
    ['is_read', 'isRead'],
    ['is_react', 'isReact'],
    ['is_external_extensions', 'isExternalExtensions'],
    ['msg_first_modify_time', 'msgFirstModifyTime'],
    ['status', 'status'],
    ['seq', 'seq'],
    ['send_time', 'sendTime'],
    ['create_time', 'createTime'],
    ['attached_info', 'attachedInfo'],
    ['ex', 'ex'],
    ['face_url', 'faceURL'],
    ['creator_user_id', 'creatorUserID'],
    ['conversation_id', 'conversationID'],
    ['owner_user_id', 'ownerUserID'],
    ['notification_user_id', 'notificationUserID'],
    ['operator_user_id', 'operatorUserID'],
    ['from_face_url', 'fromFaceURL'],
    ['from_user_id', 'fromUserID'],
    ['from_gender', 'fromGender'],
    ['from_nickname', 'fromNickname'],
    ['to_user_id', 'toUserID'],
    ['to_nickname', 'toNickname'],
    ['to_face_url', 'toFaceURL'],
    ['to_gender', 'toGender'],
    ['req_msg', 'reqMsg'],
    ['handle_msg', 'handleMsg'],
    ['handle_time', 'handleTime'],
    ['handle_result', 'handleResult'],
    ['handler_user_id', 'handlerUserID'],
    ['handle_user_id', 'handleUserID'],
    ['inviter_user_id', 'inviterUserID'],
    ['mute_end_time', 'muteEndTime'],
    ['role_level', 'roleLevel'],
    ['join_time', 'joinTime'],
    ['join_source', 'joinSource'],
    ['friend_user_id', 'friendUserID'],
    ['recv_msg_opt', 'recvMsgOpt'],
    ['group_at_type', 'groupAtType'],
    ['latest_msg_send_time', 'latestMsgSendTime'],
    ['draft_text_time', 'draftTextTime'],
    ['is_private_chat', 'isPrivateChat'],
    ['is_not_in_group', 'isNotInGroup'],
    ['update_unread_count_time', 'updateUnreadCountTime'],
    ['is_msg_destruct', 'isMsgDestruct'],
    ['msg_destruct_time', 'msgDestructTime'],
    ['part_hash', 'partHash'],
    ['upload_id', 'uploadID'],
    ['upload_info', 'uploadInfo'],
    ['expire_time', 'expireTime'],
];
function _getInternalCamelCaseBySnakeCase(key) {
    const pair = InternalConstraint.find(p => {
        return p[0] === key;
    });
    if (pair) {
        return pair[1];
    }
}
function _getInternalSnakeCaseByCamelCase(key) {
    const pair = InternalConstraint.find(p => {
        return p[1] === key;
    });
    if (pair) {
        return pair[0];
    }
}
export function convertSnakeCaseToCamelCase(key) {
    const internalKey = _getInternalCamelCaseBySnakeCase(key);
    if (internalKey) {
        return internalKey;
    }
    const cArr = [];
    let lastSign = -2;
    for (let i = 0; i < key.length; i++) {
        const c = key[i];
        if (c === '_' && i < key.length - 1) {
            lastSign = i;
            continue;
        }
        if (i - 1 === lastSign) {
            cArr.push(c.toUpperCase());
        }
        else {
            cArr.push(c);
        }
    }
    return cArr.join('');
}
export function convertCamelCaseToSnakeCase(key) {
    const internalKey = _getInternalSnakeCaseByCamelCase(key);
    if (internalKey) {
        return internalKey;
    }
    const cArr = [];
    for (let i = 0; i < key.length; i++) {
        const c = key[i];
        if (c.toLowerCase() !== c) {
            cArr.push('_');
        }
        cArr.push(c.toLowerCase());
    }
    return cArr.join('');
}
