/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
declare module 'open-absurd-sql' {
  export class SQLiteFS {
    constructor(fs: any, backend: any);
  }
}
declare module 'open-absurd-sql/dist/memory-backend' {
  export default class MemoryBBackend {}
}

declare module 'open-absurd-sql/dist/indexeddb-backend' {
  export default class IndexedDBBackend {}
}

declare module 'open-absurd-sql/dist/indexeddb-main-thread' {
  export function initBackend(worker: Worker);
}
