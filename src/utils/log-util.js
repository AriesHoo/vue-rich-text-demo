let isDebug = true;

/**
 * 打印日志
 * @param msg
 * @param tag
 */
export function printLog(msg, tag) {
    if (!isDebug || !msg) {
        return
    }
    console.log((tag ? tag + ':' : '') + JSON.stringify(msg))
}
