import squel from 'squel';
export function localGroupMembers(db) {
    return db.exec(`
      create table if not exists 'local_group_members' (
        'group_id' varchar(64),
        'user_id' varchar(64),
        'nickname' varchar(255),
        'user_group_face_url' varchar(255),
        'role_level' integer,
        'join_time' integer,
        'join_source' integer,
        'inviter_user_id' text,
        'mute_end_time' integer DEFAULT 0,
        'operator_user_id' varchar(64),
        'ex' varchar(1024),
        'attached_info' varchar(1024),
        PRIMARY KEY ('group_id', 'user_id')
    ) 
      `);
}
export function getGroupMemberInfoByGroupIDUserID(db, groupID, userID) {
    return db.exec(`
      select *
      from local_group_members
      WHERE group_id = "${groupID}" 
      AND user_id = "${userID}" 
      LIMIT 1
      `);
}
export function getAllGroupMemberList(db) {
    return db.exec(`
    SELECT *
    FROM local_group_members
      `);
}
export function getAllGroupMemberUserIDList(db) {
    return db.exec(`
      SELECT user_id
      FROM local_group_members
        `);
}
export function getGroupMemberCount(db, groupID) {
    return db.exec(`
    SELECT count(*) FROM local_group_members 
    WHERE group_id = "${groupID}" 
      `);
}
export function getGroupSomeMemberInfo(db, groupID, userIDList) {
    const ids = userIDList.map(v => `'${v}'`);
    return db.exec(`
    select *
    from local_group_members
    where group_id = "${groupID}"
    and user_id in (${ids.join(',')})
      `);
}
export function getGroupAdminID(db, groupID) {
    return db.exec(`
    SELECT user_id FROM local_group_members 
    WHERE group_id = "${groupID}" 
    And role_level = 3
      `);
}
export function getGroupMemberListByGroupID(db, groupID) {
    return db.exec(`
      SELECT * FROM local_group_members 
      WHERE group_id = "${groupID}" 
        `);
}
export function getGroupMemberListSplit(db, groupID, filter, offset, count) {
    let condition = `
    SELECT * FROM local_group_members 
        WHERE group_id = "${groupID}" 
        And role_level > 0 
        ORDER BY role_level DESC,join_time ASC 
    LIMIT ${count} OFFSET ${offset}
    `;
    if (filter === 1) {
        condition = `
        SELECT * FROM local_group_members 
            WHERE group_id = "${groupID}" 
            And role_level = 1 
        ORDER BY join_time ASC 
        LIMIT ${count} OFFSET ${offset}
        `;
    }
    if (filter === 4) {
        condition = `
        SELECT * FROM local_group_members 
            WHERE group_id = "${groupID}" 
            And ( role_level = 1 OR role_level = 3 )  
        ORDER BY role_level DESC,join_time ASC 
        LIMIT ${count} OFFSET ${offset}
        `;
    }
    return db.exec(condition);
}
export function getGroupMemberOwnerAndAdmin(db, groupID) {
    return db.exec(`
      SELECT * FROM local_group_members 
      WHERE group_id = "${groupID}" 
      And role_level > 1 
      ORDER BY join_time DESC
        `);
}
export function getGroupMemberOwner(db, groupID) {
    return db.exec(`
      SELECT * FROM local_group_members 
      WHERE group_id = "${groupID}" 
      And role_level = 2
        `);
}
export function getGroupMemberListSplitByJoinTimeFilter(db, groupID, offset, count, joinTimeBegin = 0, joinTimeEnd = 100000000000, userIDList) {
    let condition = '';
    if (userIDList.length === 0) {
        condition = `
        SELECT * FROM local_group_members 
            WHERE group_id = "${groupID}" 
            And join_time  between ${joinTimeBegin} and ${joinTimeEnd}  
            ORDER BY join_time DESC 
            LIMIT ${count} OFFSET ${offset}
        `;
    }
    else {
        const ids = userIDList.map(v => `'${v}'`);
        condition = `
        SELECT * FROM local_group_members 
        WHERE group_id = "${groupID}" 
        And join_time  between ${joinTimeBegin} and ${joinTimeEnd}  
        And user_id NOT IN (${ids.join(',')})
        ORDER BY join_time DESC 
        LIMIT ${count} OFFSET ${offset}
        `;
    }
    return db.exec(condition);
}
export function getGroupOwnerAndAdminByGroupID(db, groupID) {
    return db.exec(`
      SELECT * FROM local_group_members 
      WHERE group_id = "${groupID}" 
      And role_level > 1
        `);
}
export function getGroupMemberUIDListByGroupID(db, groupID) {
    return db.exec(`
      SELECT user_id FROM local_group_members 
      WHERE group_id = "${groupID}" 
        `);
}
export function insertGroupMember(db, localGroupMember) {
    const sql = squel
        .insert()
        .into('local_group_members')
        .setFields(localGroupMember)
        .toString();
    return db.exec(sql);
}
export function batchInsertGroupMember(db, localGroupMember) {
    const sql = squel
        .insert()
        .into('local_group_members')
        .setFieldsRows(localGroupMember)
        .toString();
    return db.exec(sql);
}
export function deleteGroupMember(db, groupID, userID) {
    return db.exec(`
    DELETE FROM local_group_members 
    WHERE group_id="${groupID}" 
    and user_id="${userID}"
      `);
}
export function deleteGroupAllMembers(db, groupID) {
    return db.exec(`
      DELETE FROM local_group_members 
      WHERE group_id="${groupID}"
        `);
}
export function updateGroupMember(db, localGroupMember) {
    const sql = squel
        .update()
        .table('local_group_members')
        .setFields(localGroupMember)
        .where(`group_id = '${localGroupMember.group_id}' and user_id = '${localGroupMember.user_id}'`)
        .toString();
    return db.exec(sql);
}
export function updateGroupMemberField(db, groupID, userID, localGroupMember) {
    const sql = squel
        .update()
        .table('local_group_members')
        .setFields(localGroupMember)
        .where(`group_id = '${groupID}' and user_id = '${userID}'`)
        .toString();
    return db.exec(sql);
}
export function searchGroupMembers(db, keyword, groupID, isSearchMemberNickname, isSearchUserID, offset, count) {
    let condition = '';
    if (groupID) {
        if (isSearchMemberNickname && isSearchUserID) {
            condition = `
            SELECT * FROM local_group_members 
            WHERE ( user_id like "%${keyword}%" or nickname like "%${keyword}%"  ) 
            and group_id IN ("${groupID}")  
            ORDER BY join_time DESC 
            LIMIT ${count} OFFSET ${offset}
            `;
        }
        else if (!isSearchMemberNickname && !isSearchUserID) {
            condition = `
        SELECT * FROM local_group_members 
        WHERE group_id IN ("${groupID}")  
        ORDER BY join_time DESC 
        LIMIT ${count} OFFSET ${offset}
        `;
        }
        else {
            const subCondition = isSearchMemberNickname
                ? `nickname like "%${keyword}%"`
                : `user_id like "%${keyword}%"`;
            condition = `
            SELECT * FROM local_group_members 
            WHERE ${subCondition}
            and group_id IN ("${groupID}")  
            ORDER BY join_time DESC 
            LIMIT ${count} OFFSET ${offset}
            `;
        }
    }
    else {
        if (isSearchMemberNickname && isSearchMemberNickname) {
            condition = `
        SELECT * FROM local_group_members 
        WHERE user_id like "%${keyword}%" or nickname like "%${keyword}%"  
        ORDER BY join_time DESC 
        LIMIT ${count} OFFSET ${offset}
        `;
        }
        else if (!isSearchMemberNickname && !isSearchMemberNickname) {
            condition = `
        SELECT * FROM local_group_members 
        ORDER BY join_time DESC 
        LIMIT ${count} OFFSET ${offset}
        `;
        }
        else {
            const subCondition = isSearchMemberNickname
                ? `nickname like "%${keyword}%"`
                : `user_id like "%${keyword}%"`;
            condition = `
        SELECT * FROM local_group_members 
        WHERE ${subCondition}  
        ORDER BY join_time DESC 
        LIMIT ${count} OFFSET ${offset}
        `;
        }
    }
    return db.exec(condition);
}
