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
export declare function escapeString(val: string, opts?: {
    backslashSupported: boolean;
}): string;
