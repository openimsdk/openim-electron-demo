import { escapeString } from './escape';
import { isString } from './is';
import { convertSnakeCaseToCamelCase, convertCamelCaseToSnakeCase, } from './key';
export function converSqlExecResult(record, keyType = 'CamelCase', booleanKeys = [], convertMap = {}) {
    const { columns = [], values = [] } = record || {};
    const result = [];
    values.forEach(v => {
        const converted = {};
        columns.forEach((k, i) => {
            let ck = k;
            let cv = v[i];
            if (keyType === 'CamelCase') {
                ck = convertSnakeCaseToCamelCase(k);
            }
            if (keyType === 'SnakeCase') {
                ck = convertCamelCaseToSnakeCase(k);
            }
            if (booleanKeys.find(bk => bk === ck)) {
                cv = !!cv;
            }
            ck = convertMap[k] || ck;
            converted[ck] = cv;
        });
        result.push(converted);
    });
    return result;
}
export function convertToCamelCaseObject(obj) {
    const retObj = {};
    Object.keys(obj).forEach(k => {
        retObj[convertSnakeCaseToCamelCase(k)] = obj[k];
    });
    return retObj;
}
export function convertToSnakeCaseObject(obj, escape = true) {
    const retObj = {};
    Object.keys(obj).forEach(k => {
        let value = obj[k];
        if (escape && isString(value)) {
            value = escapeString(value).slice(1, -1);
        }
        retObj[convertCamelCaseToSnakeCase(k)] = value;
    });
    return retObj;
}
export function convertObjectField(obj, convertMap = {}) {
    const ret = {};
    Object.keys(obj).forEach(k => {
        const nk = convertMap[k] || k;
        ret[nk] = obj[k];
    });
    return ret;
}
