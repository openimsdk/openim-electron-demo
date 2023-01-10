import squel from 'squel';
export function localFriends(db) {
    return db.exec(`
      create table if not exists 'local_friends'
      (
          'owner_user_id'    varchar(64),
          'friend_user_id'   varchar(64),
          'remark'           varchar(255),
          'create_time'      INTEGER,
          'add_source'       INTEGER,
          'operator_user_id' varchar(64),
          'name'             varchar(255),
          'face_url'         varchar(255),
          'gender'           INTEGER,
          'phone_number'     varchar(32),
          'birth'            INTEGER,
          'email'            varchar(64),
          'ex'               varchar(1024),
          'attached_info'    varchar(1024),
          primary key ('owner_user_id', 'friend_user_id')
      )       
      `);
}
export function insertFriend(db, localFriend) {
    console.log('localFriend::::insert');
    console.log(localFriend);
    const sql = squel
        .insert()
        .into('local_friends')
        .setFields(localFriend)
        .toString();
    return db.exec(sql);
}
export function deleteFriend(db, friendUserID, loginUserID) {
    return db.exec(`
    DELETE FROM local_friends 
          WHERE owner_user_id="${loginUserID}" 
          and friend_user_id="${friendUserID}"
        `);
}
export function updateFriend(db, localFriend) {
    const sql = squel
        .update()
        .table('local_friends')
        .setFields(localFriend)
        .where(`owner_user_id = '${localFriend.owner_user_id}' and friend_user_id = '${localFriend.friend_user_id}'`)
        .toString();
    return db.exec(sql);
}
export function getAllFriendList(db, loginUser) {
    return db.exec(`
      select *
        from local_friends
        where owner_user_id = "${loginUser}"
        `);
}
export function searchFriendList(db, keyword, isSearchUserID, isSearchNickname, isSearchRemark) {
    let totalConditionStr = '';
    const userIDCondition = `friend_user_id like "%${keyword}%"`;
    const nicknameCondition = `name like "%${keyword}%"`;
    const remarkCondition = `remark like "%${keyword}%"`;
    if (isSearchUserID) {
        totalConditionStr = userIDCondition;
    }
    if (isSearchNickname) {
        totalConditionStr = totalConditionStr
            ? totalConditionStr + ' or ' + nicknameCondition
            : nicknameCondition;
    }
    if (isSearchRemark) {
        totalConditionStr = totalConditionStr
            ? totalConditionStr + ' or ' + remarkCondition
            : remarkCondition;
    }
    return db.exec(`
      select *
        from local_friends
        where ${totalConditionStr}
        order by create_time desc
        `);
}
export function getFriendInfoByFriendUserID(db, friendUserID, loginUser) {
    return db.exec(`
      select *
        from local_friends
        where owner_user_id = "${loginUser}"
         and friend_user_id = "${friendUserID}"
        limit 1
        `);
}
export function getFriendInfoList(db, friendUserIDList) {
    const values = friendUserIDList.map(v => `'${v}'`).join(',');
    return db.exec(`
      select *
        from local_friends
        where friend_user_id in (${values})
        `);
}
