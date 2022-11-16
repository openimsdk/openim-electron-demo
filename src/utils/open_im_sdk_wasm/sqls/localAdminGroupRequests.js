import squel from 'squel';
export function localAdminGroupRequests(db) {
    return db.exec(`
    create table if not exists "local_admin_group_requests" (
        "group_id" varchar(64),
        "group_name" text,
        "notification" varchar(255),
        "introduction" varchar(255),
        "face_url" varchar(255),
        "create_time" integer,
        "status" integer,
        "creator_user_id" varchar(64),
        "group_type" integer,
        "owner_user_id" varchar(64),
        "member_count" integer,
        "user_id" varchar(64),
        "nickname" varchar(255),
        "user_face_url" varchar(255),
        "gender" integer,
        "handle_result" integer,
        "req_msg" varchar(255),
        "handle_msg" varchar(255),
        "req_time" integer,
        "handle_user_id" varchar(64),
        "handle_time" integer,
        "ex" varchar(1024),
        "attached_info" varchar(1024),
        "join_source" integer,
        "inviter_user_id" text,
        PRIMARY KEY ("group_id", "user_id")
      );
      `);
}
export function insertAdminGroupRequest(db, localGroupRequest) {
    const sql = squel
        .insert()
        .into('local_admin_group_requests')
        .setFields(localGroupRequest)
        .toString();
    return db.exec(sql);
}
export function deleteAdminGroupRequest(db, groupID, userID) {
    return db.exec(`
        delete
        from local_admin_group_requests
        where group_id = "${groupID}"
          and user_id = "${userID}"
        `);
}
export function updateAdminGroupRequest(db, localGroupRequest) {
    const sql = squel
        .update()
        .table('local_admin_group_requests')
        .setFields(localGroupRequest)
        .where(`group_id = '${localGroupRequest.group_id}' and user_id = '${localGroupRequest.user_id}'`)
        .toString();
    return db.exec(sql);
}
export function getAdminGroupApplication(db) {
    return db.exec(`
        select *
        from local_admin_group_requests
        order by create_time desc
        `);
}
