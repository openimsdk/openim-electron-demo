import squel from 'squel';
export function localSuperGroups(db) {
    return db.exec(`
      create table if not exists 'local_super_groups' (
            'group_id' varchar(64),
            'name' text,
            'notification' varchar(255),
            'introduction' varchar(255),
            'face_url' varchar(255),
            'create_time' integer,
            'status' integer,
            'creator_user_id' varchar(64),
            'group_type' integer,
            'owner_user_id' varchar(64),
            'member_count' integer,
            'ex' varchar(1024),
            'attached_info' varchar(1024),
            'need_verification' integer,
            'look_member_info' integer,
            'apply_member_friend' integer,
            'notification_update_time' integer,
            'notification_user_id' text,
        primary key ('group_id')
     )
    `);
}
export function getJoinedSuperGroupList(db) {
    return db.exec(`
        select * from local_super_groups;
    `);
}
export function insertSuperGroup(db, group) {
    const sql = squel
        .insert()
        .into('local_super_groups')
        .setFields(group)
        .toString();
    return db.exec(sql);
}
export function updateSuperGroup(db, groupID, group) {
    const sql = squel
        .update()
        .table('local_super_groups')
        .setFields(group)
        .where(`group_id = '${groupID}'`)
        .toString();
    return db.exec(sql);
}
export function deleteSuperGroup(db, groupID) {
    return db.exec(`
        delete from local_super_groups where group_id = '${groupID}';
    `);
}
export function getSuperGroupInfoByGroupID(db, groupID) {
    return db.exec(`
        select * from local_super_groups where group_id = '${groupID}'  LIMIT 1;
    `);
}
