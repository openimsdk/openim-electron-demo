import squel from 'squel';
export function localUploads(db) {
    return db.exec(`
        create table if not exists 'local_uploads' (
            'part_hash'   text,
            'upload_id'   varchar(1000),
            'upload_info'        varchar(2000),
            'expire_time' integer,
            'create_time' integer,
            PRIMARY KEY ('part_hash')
          )
      `);
}
export function getUpload(db, partHash) {
    return db.exec(`
        select * from local_uploads where part_hash = '${partHash}'  limit 1;
    `);
}
export function insertUpload(db, upload) {
    const sql = squel.insert().into('local_uploads').setFields(upload).toString();
    return db.exec(sql);
}
export function updateUpload(db, upload) {
    const sql = squel
        .update()
        .table('local_uploads')
        .setFields(upload)
        .where(`part_hash = '${upload.part_hash}'`)
        .toString();
    return db.exec(sql);
}
export function deleteUpload(db, partHash) {
    const sql = squel
        .delete()
        .from('local_uploads')
        .where(`part_hash = '${partHash}'`)
        .toString();
    return db.exec(sql);
}
export function deleteExpireUpload(db) {
    const sql = squel
        .delete()
        .from('local_uploads')
        .where(`expire_time <= ${Date.now()}`)
        .toString();
    return db.exec(sql);
}
