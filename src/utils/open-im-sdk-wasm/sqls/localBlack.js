import squel from 'squel';
export function locaBlacks(db) {
    return db.exec(`
      create table if not exists 'local_blacks' (
        'owner_user_id'     varchar(64),
        'block_user_id'     varchar(64),
        'nickname'         varchar(255),
        'face_url'         varchar(255),
        'gender'           INTEGER,
        'create_time'      INTEGER,
        'add_source'      INTEGER,
        'operator_user_id'   varchar(64),
        'ex'              varchar(1024),
        'attached_info'     varchar(1024),
        primary key  ('owner_user_id', 'block_user_id')
    ) 
      `);
}
export function getBlackList(db) {
    return db.exec(`
      select *
      from local_blacks
      `);
}
export function getBlackListUserID(db) {
    return db.exec(`
    SELECT block_user_id
    FROM local_blacks
      `);
}
export function getBlackInfoByBlockUserID(db, blockUserID, loginUserID) {
    return db.exec(`
      SELECT *
        FROM local_blacks
        WHERE owner_user_id = "${loginUserID}"
          AND block_user_id = "${blockUserID}"
        LIMIT 1
      `);
}
export function getBlackInfoList(db, blockUserIDList) {
    const ids = blockUserIDList.map(v => `'${v}'`);
    return db.exec(`
    select *
    from local_blacks
    where block_user_id in (${ids.join(',')})
      `);
}
export function insertBlack(db, localBlack) {
    const sql = squel
        .insert()
        .into('local_blacks')
        .setFields(localBlack)
        .toString();
    return db.exec(sql);
}
export function updateBlack(db, localBlack) {
    const sql = squel
        .update()
        .table('local_blacks')
        .setFields(localBlack)
        .where(`owner_user_id = '${localBlack.owner_user_id}' and block_user_id = '${localBlack.block_user_id}'`)
        .toString();
    return db.exec(sql);
}
export function deleteBlack(db, blockUserID, loginUserID) {
    return db.exec(`
    delete
    from local_blacks
    where owner_user_id = "${loginUserID}"
    and block_user_id = "${blockUserID}"
      `);
}
