/** 移动号码包括的号段：134/135/136/137,138,139；
 *                     147/148(物联卡号)；
 *                     150/151/152/157/158/159；
 *                     165（虚拟运营商）；
 *                     1703/1705/1706（虚拟运营商）、178；
 *                     182/183/184/187/188
 *                     198

 * 联通号段包括：130/131
 *               145
 *               155/156
 *               166/167(虚拟运营商)
 *               1704/1707/1708/1709、171
 *               186/186
 *
 * 电信号段包括： 133
 *                153
 *                162(虚拟运营商)
 *                1700/1701/1702(虚拟运营商)
 *                180/181/189
 *                191/199
 * 验证是否为手机号码（移动手机）
 *
 * @param {}
 *            source
 */

export function isMobilePhone(phoneNum) {

    let regex = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    return regex.test(phoneNum);

}

/**
 * 校验密码8-16位
 * @param password 需校验密码
 * @returns {*}
 */
export function isPassword(password) {
    let pwdRegex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z]).{8,16}');
    return pwdRegex.test(password);

}


/**
 *
 * @param idCard
 * @returns {boolean}
 */
export function isIdCard(idCard) {
    if (!idCard) {
        return false;
    }
    let p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
    let code = idCard.substring(17);
    if (p.test(idCard)) {
        let sum = 0;
        for (let i = 0; i < 17; i++) {
            sum += idCard[i] * factor[i];
        }
        if (parity[sum % 11] == code.toUpperCase()) {
            return true;
        }
    }
    return false;
}

/**
 * 是否经度
 */
export function isLongitude(lonStr) {
    let lon = /^-?((0|[1-8]\d?|1[1-7]\d)(\.\d{1,7})?|180(\.0{1,7})?)?$/;
    let lonRe = new RegExp(lon);
    return lonRe.test(lonStr);
}

/**
 * 是否纬度
 */
export function isLatitude(latStr) {
    let lat = /^-?((0|[1-8]\d|)(\.\d{1,7})?|90(\.0{1,7})?)?$/;
    let latRe = new RegExp(lat);
    return latRe.test(latStr);
}

/**
 * 去掉特殊字符
 * @param str 原始输入
 * @returns {string} 返回过滤后的字符
 */
export function clearStr(str) {
    //格式 RegExp("[在中间定义特殊过滤字符]")
    let pattern = new RegExp("[%--`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——| {}【】‘；：”“'。，、？]")
    let resultStr = "";
    for (let i = 0; i < str.length; i++) {
        resultStr = str + str.substr(i, 1).replace(pattern, '');
    }
    return resultStr;
}
