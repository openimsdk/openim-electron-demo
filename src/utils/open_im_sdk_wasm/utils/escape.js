// eslint-disable-next-line no-control-regex
const CHARS_GLOBAL_BACKSLASH_SUPPORTED_RX = /[\0\b\t\n\r\x1a"'\\]/g;
const CHARS_ESCAPE_BACKSLASH_SUPPORTED_MAP = {
    '\0': '\\0',
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\r': '\\r',
    '\x1a': '\\Z',
    '"': '\\"',
    "'": "\\'",
    '\\': '\\\\',
};
/**
 * Escapes the given string to protect against SQL injection attacks.
 *
 * By default it assumes that backslashes are not supported as they are not part of the standard SQL spec.
 * Quoting from the [SQLlite web site](https://sqlite.org/lang_expr.html):
 *
 * > C-style escapes using the backslash character are not supported because they are not standard SQL.
 *
 * This means three things:
 *
 * - backslashes and double quotes `"` are not escaped by default
 * - single quotes are escaped via `''` instead of `\'`
 * - your sql engine should throw an error when encountering a backslash escape
 *   as part of a string, unless it is a literal backslash, i.e. `'backslash: \\'`.
 *
 * It is recommended to set the `backslashSupported` option `true` if your SQL
 * engine supports it. In that case backslash sequences are escaped and single
 * and double quotes are escaped via a backslash, i.e. `'\''`.
 *
 */
export function escapeString(val, opts = { backslashSupported: false }) {
    if (val == null) {
        throw new Error('Need to pass a valid string');
    }
    opts = opts || {};
    const backslashSupported = !!opts.backslashSupported;
    if (!backslashSupported)
        return "'" + val.replace(/'/g, "''") + "'";
    const charsRx = CHARS_GLOBAL_BACKSLASH_SUPPORTED_RX;
    const charsEscapeMap = CHARS_ESCAPE_BACKSLASH_SUPPORTED_MAP;
    let chunkIndex = (charsRx.lastIndex = 0);
    let escapedVal = '';
    let match;
    while ((match = charsRx.exec(val))) {
        escapedVal += val.slice(chunkIndex, match.index) + charsEscapeMap[match[0]];
        chunkIndex = charsRx.lastIndex;
    }
    // Nothing was escaped
    if (chunkIndex === 0)
        return "'" + val + "'";
    if (chunkIndex < val.length)
        return "'" + escapedVal + val.slice(chunkIndex) + "'";
    return "'" + escapedVal + "'";
}
