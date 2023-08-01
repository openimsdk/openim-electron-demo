export function isString(value) {
    return typeof value === 'string';
}
export function isNumber(value) {
    return typeof value === 'number';
}
export function isBoolean(value) {
    return typeof value === 'boolean';
}
export function isUndefined(value) {
    return typeof value === 'undefined';
}
export function isObject(value) {
    return typeof value === 'object' && value !== null;
}
export function isFunction(value) {
    return typeof value === 'function';
}
