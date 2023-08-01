/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import initSqlJs from '@jlongster/sql.js';
import { SQLiteFS } from 'absurd-sql-optimized';
import IndexedDBBackend from 'absurd-sql-optimized/dist/indexeddb-backend';
self.$RefreshReg$ = () => { };
self.$RefreshSig$ = () => () => { };
let instance;
let SQL;
async function InitializeDB(filePath) {
    if (!SQL) {
        SQL = await initSqlJs({ locateFile: () => '/sql-wasm.wasm' });
        const sqlFS = new SQLiteFS(SQL.FS, new IndexedDBBackend());
        SQL.register_for_idb(sqlFS);
        SQL.FS.mkdir('/sql');
        SQL.FS.mount(sqlFS, {}, '/sql');
    }
    const path = `/sql/${filePath}`;
    const db = new SQL.Database(path, { filename: true });
    if (typeof SharedArrayBuffer === 'undefined') {
        // @ts-ignore
        const stream = SQL.FS.open(path, 'a+');
        await stream.node.contents.readIfFallback();
        // @ts-ignore
        SQL.FS.close(stream);
    }
    db.exec(`
    PRAGMA page_size=8192;
    PRAGMA journal_mode=MEMORY;
  `);
    return db;
}
export function getInstance(filePath) {
    if (instance) {
        return instance;
    }
    if (!filePath) {
        throw new Error('must speciefic database file');
    }
    instance = new Promise((resolve, reject) => {
        const db = InitializeDB(filePath);
        db.then(res => resolve(res)).catch(err => reject(err));
    });
    return instance;
}
export async function resetInstance() {
    if (!instance) {
        return;
    }
    const db = await instance;
    db.close();
    instance = undefined;
}
