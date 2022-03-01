import {printLog} from "@/utils/log-util";

export function floatAdd(arg1, arg2) {
    let r1, r2, m;
    try {
        r1 = arg1.toString().split(".")[1].length
    } catch (e) {
        r1 = 0
        printLog(e)
    }
    try {
        r2 = arg2.toString().split(".")[1].length
    } catch (e) {
        r2 = 0
        printLog(e)
    }
    m = Math.pow(10, Math.max(r1, r2));
    let result = (arg1 * m + arg2 * m) / m
    return result;
}

//减
export function floatSub(arg1, arg2) {
    let r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length
    } catch (e) {
        r1 = 0
        printLog(e)
    }
    try {
        r2 = arg2.toString().split(".")[1].length
    } catch (e) {
        r2 = 0
        printLog(e)
    }
    m = Math.pow(10, Math.max(r1, r2));
    //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

//乘
export function floatMul(arg1, arg2) {
    let m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length
    } catch (e) {
        printLog(e)
    }
    try {
        m += s2.split(".")[1].length
    } catch (e) {
        printLog(e)
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}


//除
export function floatDiv(arg1, arg2) {
    let t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length
    } catch (e) {
        printLog(e)
    }
    try {
        t2 = arg2.toString().split(".")[1].length
    } catch (e) {
        printLog(e)
    }

    r1 = Number(arg1.toString().replace(".", ""));

    r2 = Number(arg2.toString().replace(".", ""));
    return (r1 / r2) * Math.pow(10, t2 - t1);
}

/**
 * 获取UUID
 * @param len
 * @param radix
 * @returns {string}
 */
export function getUuid(len, radix) {
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    let uuid = [],
        i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        let r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
}

/**
 * str 转base64
 * @param str 目标str
 * @returns {string}
 */
export function btoa(str) {
    return window.btoa(unescape(encodeURIComponent(str)))
}

/**
 * base64 转str
 * @param base64 目标
 * @returns {string}
 */
export function atob(base64) {
    return decodeURIComponent(escape(window.atob(base64)))
}

/**
 * 将数保留两位小数
 * @param num
 * @returns {boolean|number}
 */
export function keepTwoDecimal(num) {
    let result = parseFloat(num);
    if (isNaN(result)) {
        return num;
    }
    result = Math.round(num * 100) / 100;
    return result;
}
