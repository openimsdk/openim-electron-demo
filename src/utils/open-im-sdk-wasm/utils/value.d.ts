import { QueryExecResult } from '@jlongster/sql.js';
import { KeyType } from './key';
export declare function converSqlExecResult(record: QueryExecResult, keyType?: KeyType, booleanKeys?: string[], convertMap?: Record<string, string>): Record<string, unknown>[];
export declare function convertToCamelCaseObject(obj: Record<string, unknown>): Record<string, unknown>;
export declare function convertToSnakeCaseObject(obj: Record<string, unknown>, escape?: boolean): Record<string, unknown>;
export declare function convertObjectField(obj: Record<string, unknown>, convertMap?: Record<string, string>): Record<string, any>;
