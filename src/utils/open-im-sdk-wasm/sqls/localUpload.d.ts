import { Database, QueryExecResult } from '@jlongster/sql.js';
export declare type ClientUpload = {
    [key: string]: unknown;
};
export declare function localUploads(db: Database): QueryExecResult[];
export declare function getUpload(db: Database, partHash: string): QueryExecResult[];
export declare function insertUpload(db: Database, upload: ClientUpload): QueryExecResult[];
export declare function updateUpload(db: Database, upload: ClientUpload): QueryExecResult[];
export declare function deleteUpload(db: Database, partHash: string): QueryExecResult[];
export declare function deleteExpireUpload(db: Database): QueryExecResult[];
