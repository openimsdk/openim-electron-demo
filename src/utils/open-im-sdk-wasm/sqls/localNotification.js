export function localNotification(db) {
    return db.exec(`
    create table if not exists 'local_notification_seqs'
        (
            'conversation_id' char(128),
            'seq'             integer,
            PRIMARY KEY ('conversation_id')
        )
      `);
}
export function insertNotificationSeq(db, conversationID, seq) {
    return db.exec(`INSERT INTO local_notification_seqs (conversation_id, seq) VALUES ("${conversationID}", ${seq});`);
}
export function setNotificationSeq(db, conversationID, seq) {
    return db.exec(`UPDATE local_notification_seqs set seq = ${seq} where conversation_id = "${conversationID}"`);
}
export function getNotificationAllSeqs(db) {
    return db.exec('SELECT * from local_notification_seqs where 1 = 1;');
}
