import request from "@/api/http";

import * as qiniu from 'qiniu-js'
import {showError} from "@/utils/toast";
import {formatBytesToSize, formatDate} from "@/utils/format-util";
import {dismissLoading, showLoading} from "@/utils/loading";
import {printLog} from "@/utils/log-util";
import {btoa, getUuid} from "@/utils/math-util";


/**
 * 文件上传
 * @type {string}
 */
const domain_course = 'http://lz-special-education.sunhobby.cn/';


/**
 * 上传资源-主要为图片资源
 * @param file
 * @returns {Promise<unknown>}
 */
export function uploadResourceToQiNiuYun(file) {
    return uploadFileToQiNiuYun(file, true);
}

/**
 * 上传课程-课时 视频/图片等到七牛云
 * @param file
 * @returns {Promise<unknown>}
 */
export function uploadCourseToQiNiuYun(file) {
    return uploadFileToQiNiuYun(file, false);
}

/**
 * 上传文件到七牛云
 * @param file
 * @returns {Promise<unknown>}
 */
/**
 * 上传文件到七牛云
 * @param file 文件
 * @param domainUrl 存储地址
 * @param type 1-资源;2-课程
 * @param upload 是否不需要上传自己服务器生成fileId
 * @returns {Promise<unknown>}
 */
export async function uploadFileToQiNiuYun(file, isResource, upload) {
    let starTime = new Date().getTime()
    printLog('开始上传:' + formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss'), 'uploadFileToQiNiuYun_star')
    let fileType = getFileType(file);
    // let fileName = file.name.replace(fileType, '')
    //修改上传文件名保留扩展名-避免预览下载异常文件-转换成小写
    let fileName = file.name ? file.name.toLowerCase() : starTime + fileType

    // let key = new Date().getTime() + file.name;
    // let key = file.name;
    ///key使用lastModified保证同一文件不同命名指向同一文件
    // let key = file.lastModified + fileType;
    //可根据UUID生成
    let key = btoa(getUuid())
    printLog(
        'key:' + key + ';type:' + file.type + ';name:'
        + file.name + ';lastModified:' + file.lastModified
        + ';lastModifiedDate:' + file.lastModifiedDate
        + ';fileType:' + fileType, 'uploadFileToQiNiuYun', true)
    let token = await getFileToken(key);
    let config = {
        // useCdnDomain: true,
        // region: qiniu.region.z0,
        uptoken: token,
        domain: domain_course,
        unique_names: true,
    };
    let putExtra = {
        fname: fileName,
        // params: {},
        // mimeType: [] || null
        ...config,
    }
    let percent = 0;
    let percentStart = 1
    let percentInterval = 10
    let sizeM = file.size / 1024 / 1024
    //根据内存空间大小设置开始及更新频率
    if (sizeM <= 2) {
        percentStart = 10
        percentInterval = 50
    } else if (sizeM <= 10) {
        percentStart = 5
        percentInterval = 30
    } else if (sizeM <= 20) {
        percentStart = 3
        percentInterval = 20
    } else if (sizeM <= 50) {
        percentStart = 2
        percentInterval = 12
    } else {
        percentStart = 1
        percentInterval = 6
    }
    showLoading('上传中(' + percentStart + '%)-预计30秒到2分钟由当前网络情况决定')
    let observable = qiniu.upload(file, key, token, putExtra, config)
    return new Promise((resolve) => {
        observable.subscribe({
            error(err) {
                dismissLoading();
                printLog(err, 'uploadFileToQiNiuYun_error')
                showError(JSON.stringify(err))
            },
            next(res) {
                let currentPercent = parseInt(res.total.percent)
                if (currentPercent - percent > percentInterval) {
                    percent = currentPercent
                    //dismissLoading()
                    showLoading('上传中(' + currentPercent + '%)-预计30秒到2分钟由当前网络情况决定')
                }
                printLog(res, 'uploadFileToQiNiuYun_next')
            },
            async complete(data) {
                printLog('上传结束:' + formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss') + ';耗时:' + (new Date().getTime() - starTime) / 1000, 'uploadFileToQiNiuYun_star')
                data.fileUrl = config.domain + data.key; //拼上七牛云域名  如   https://cdn.qniyun.com/ ${data.key}
                let uploadParams = {
                    fileType: fileType,
                    hash: data.hash,
                    //音频长度s
                    length: 0,
                    mediaType: file.type ? file.type : '',
                    name: fileName,
                    qiniuKey: data.key,
                    size: "",
                    //1-资源;2-课程
                    type: isResource ? 1 : 2,
                    url: data.fileUrl
                };
                uploadParams.length = file.duration ? file.duration : 0;
                uploadParams.size = formatBytesToSize(data.fsize)
                let fileId = upload ? -1 : await uploadFileToService(uploadParams);
                data.fileId = fileId;
                data.fileName = uploadParams.name;
                data.creator = -1
                printLog(data, 'uploadFileToQiNiuYun_data')
                printLog(uploadParams, 'uploadFileToQiNiuYun_uploadParams')
                resolve(data);
            }
        })
    })
}

export function getFileType(file) {
    let fileType = '';
    let index;
    if (file.type) {
        fileType = file.type.replace('/', '.')
    } else if (file.name) {
        fileType = file.name
    }
    index = fileType.lastIndexOf('.');
    if (index != -1) {
        fileType = fileType.slice(index, fileType.length);
    }
    return fileType.toLowerCase()
}

/**
 * 获取上传七牛云token
 * @param key
 * @returns {Promise<AxiosResponse<any>>}
 */
function getFileToken(key) {
    return request.get('api/common/qiniu/uptoken',
        {
            params: {
                key: key,
                expireSeconds: 3600,
                // putPolicy: {
                //     callbackBody: "{\"key\":\"$(key)\",\"hash\":\"$(etag)\",\"bucket\":\"$(bucket)\",\"fsize\":$(fsize),\"user\":\"$(x:user)\",\"age\",$(x:age)}",
                // }
            }
        })
        .then((result) => {
            return result;
        });
}

/***
 * 上传七牛云后再上传服务器以创建关联
 * @param params
 * @returns {Promise<AxiosResponse<any>>}
 */
function uploadFileToService(params) {
    return request.post('api/common/qiniu', params)
        .then((result) => {
            printLog(result, 'uploadFileToService')
            return result;
        });
}


