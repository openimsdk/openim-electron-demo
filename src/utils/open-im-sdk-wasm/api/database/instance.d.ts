import { Database } from '@jlongster/sql.js';
export declare function getInstance(filePath?: string): Promise<Database>;
export declare function resetInstance(): Promise<void>;
