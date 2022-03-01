/**
 * 将日期格式化成指定格式的字符串
 * @param date 要格式化的日期，不传时默认当前时间，也可以是一个时间戳
 * @param fmt 目标字符串格式，支持的字符有：y,M,d,q,w,H,h,m,S，默认：yyyy-MM-dd HH:mm:ss
 * @returns 返回格式化后的日期字符串
 */
export function formatDate(date, fmt) {
    date = date == undefined ? new Date() : date;
    date = typeof date == 'number' ? new Date(date) : date;
    fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
    let obj =
        {
            'y': date.getFullYear(), // 年份，注意必须用getFullYear
            'M': date.getMonth() + 1, // 月份，注意是从0-11
            'd': date.getDate(), // 日期
            'q': Math.floor((date.getMonth() + 3) / 3), // 季度
            'w': date.getDay(), // 星期，注意是0-6
            'H': date.getHours(), // 24小时制
            'h': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 12小时制
            'm': date.getMinutes(), // 分钟
            's': date.getSeconds(), // 秒
            'S': date.getMilliseconds() // 毫秒
        };
    let week = ['天', '一', '二', '三', '四', '五', '六'];
    for (let i in obj) {
        fmt = fmt.replace(new RegExp(i + '+', 'g'), function (m) {
            let val = obj[i] + '';
            if (i == 'w') return (m.length > 2 ? '星期' : '周') + week[val];
            for (let j = 0, len = val.length; j < m.length - len; j++) val = '0' + val;
            return m.length == 1 ? val : val.substring(val.length - m.length);
        });
    }
    return fmt;
}

/**
 * 格式化数据
 * @param bytes
 * @returns {string}
 */
export function formatBytesToSize(bytes) {
    if (bytes === 0) return '0 B';
    let k = 1024;
    let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let i = Math.floor(Math.log(bytes) / Math.log(k))
    //return (bytes / Math.pow(k, i)) + ' ' + sizes[i];
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    //toPrecision(3) 后面保留两位小数，如1.00GB
}

/**
 * 获取当前week
 * @returns {number}
 */
export function getCurrentWeek() {
    let myDate = new Date();
    let days = myDate.getDay();
    switch (days) {
        case 1:
            days = '星期一';
            break;
        case 2:
            days = '星期二';
            break;
        case 3:
            days = '星期三';
            break;
        case 4:
            days = '星期四';
            break;
        case 5:
            days = '星期五';
            break;
        case 6:
            days = '星期六';
            break;
        case 0:
            days = '星期日';
            break;
    }
    return days;
}


/**
 * 将秒数转换为时分秒
 * @param value
 * @returns {string}
 */
export function formatSeconds(value) {
    let seconds = parseInt(value);// 秒
    let minutes = 0;// 分
    let hours = 0;// 小时
    if (seconds > 60) {
        minutes = parseInt(seconds / 60);
        seconds = parseInt(seconds % 60);
        if (minutes > 60) {
            hours = parseInt(minutes / 60);
            minutes = parseInt(minutes % 60);
        }
    }
    let result = parseInt(seconds) + "";
    if (hours == 0 && minutes == 0) {
        result = '00:00:' + result;
    } else if (hours == 0 && minutes > 0) {
        result = '00:' + parseInt(minutes) + ":" + result;
    } else {
        result = hours + ':' + parseInt(minutes) + ":" + result;
    }
    return result;
}

/**
 * 将时间戳转换为距离当前时间差-几分钟前、几天前、几小时前
 * @param dateTimeStamp
 * @returns {string}
 */
export function getDateDiff(dateTimeStamp) {
    let result = '';
    let minute = 1000 * 60;
    let hour = minute * 60;
    let day = hour * 24;
    let month = day * 30;
    let now = new Date().getTime();
    let diffValue = now - dateTimeStamp;
    if (diffValue < 0) {
        return result;
    }
    let monthC = diffValue / month;
    let weekC = diffValue / (7 * day);
    let dayC = diffValue / day;
    let hourC = diffValue / hour;
    let minC = diffValue / minute;
    if (monthC >= 1) {
        result = "" + parseInt(monthC) + "月前";
    } else if (weekC >= 1) {
        result = "" + parseInt(weekC) + "周前";
    } else if (dayC >= 1) {
        result = "" + parseInt(dayC) + "天前";
    } else if (hourC >= 1) {
        result = "" + parseInt(hourC) + "小时前";
    } else if (minC >= 1) {
        result = "" + parseInt(minC) + "分钟前";
    } else {
        result = "刚刚";
    }
    return result;
}

/**
 * 将格式化后的时间转换为时间差-几分钟前、几天前、几小时前
 * @param dateStr
 */
export function getDateDiffFromTimeFormat(dateStr) {
    let timeStamp = getDateTimeStampFromTimeFormat(dateStr);
    if (timeStamp <= 0) {
        return dateStr;
    }
    return getDateDiff(timeStamp);
}

/**
 * 将已格式化的时间转换为时间戳
 * @param dateStr
 * @returns {number}
 */
export function getDateTimeStampFromTimeFormat(dateStr) {
    try {
        return Date.parse(dateStr);
    } catch (e) {
        return -1;
    }
}
