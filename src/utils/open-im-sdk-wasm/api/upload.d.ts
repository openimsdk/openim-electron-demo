export declare const fileMapSet: (uuid: string, file: File) => any;
export declare const fileMapClear: () => any;
export declare const wasmOpen: (uuid: string) => Promise<unknown>;
export declare const wasmClose: (uuid: string) => Promise<unknown>;
export declare const wasmRead: (uuid: string, offset: number, length: number) => Promise<unknown>;
