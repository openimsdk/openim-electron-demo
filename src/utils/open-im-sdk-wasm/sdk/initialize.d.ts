/// <reference types="./src/types" />
export declare function initializeWasm(url: string): Promise<Go | null>;
export declare function reset(): void;
export declare function getGO(): Go;
export declare function getGoExitPromsie(): Promise<void> | undefined;
