export function formatResponse(data, errCode, errMsg) {
    let serializedData = data;
    if (typeof data === 'object') {
        serializedData = JSON.stringify(data);
    }
    return {
        data: data !== undefined ? serializedData : '{}',
        errCode: errCode || 0,
        errMsg: errMsg || '',
    };
}
