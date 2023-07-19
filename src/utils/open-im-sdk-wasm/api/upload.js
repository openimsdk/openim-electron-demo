import { formatResponse } from '../utils';
const fileMap = new Map();
export const fileMapSet = (uuid, file) => {
    fileMap.set(uuid, file);
    return formatResponse(uuid);
};
export const fileMapClear = () => {
    fileMap.clear();
    return formatResponse('');
};
export const wasmOpen = (uuid) => {
    return new Promise((resolve, reject) => {
        const file = fileMap.get(uuid);
        if (!file) {
            reject('file not found');
        }
        else {
            resolve(formatResponse(file.size));
        }
    });
};
export const wasmClose = async (uuid) => {
    return new Promise(resolve => {
        fileMap.delete(uuid);
        resolve(formatResponse(uuid));
    });
};
export const wasmRead = (uuid, offset, length) => {
    const file = fileMap.get(uuid);
    if (!file) {
        throw 'file not found';
    }
    const blob = file.slice(offset, offset + length);
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = () => {
            reject(reader.error);
        };
        reader.readAsArrayBuffer(blob);
    });
};
