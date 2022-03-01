import axios from 'axios'
import {printLog} from "@/utils/log-util";
import {dismissLoading} from "@/utils/loading";
import {showError} from "@/utils/toast";

const service = axios.create({
    // baseURL: 'http://192.168.100.208:9810/',
    // baseURL: 'http://192.168.100.172:9810/',
    baseURL: 'http://47.108.167.249:9810/',
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 20000,
})

// request interceptor
service.interceptors.request.use(
    config => {
        printLog('http-data:' + JSON.stringify(config.data))

        config.headers['platform'] = 'pc';
        //去掉null的key
        if (config.data) {
            let data = JSON.parse(JSON.stringify(config.data))
            ///上传文件不做操作
            if (config.data instanceof FormData) {
                data = config.data
            }
            for (let key in data) {
                if (data[key] === null || data[key].length == 0) {
                    delete data[key]
                }
            }
            config.data = data;
        }
        // //去掉null的key
        if (config.params) {
            let params = JSON.parse(JSON.stringify(config.params))
            for (let key in params) {
                if (params[key] === null || params[key].length == 0) {
                    delete params[key]
                }
            }
            config.params = params;
        }
        printLog('http-headers:' + JSON.stringify(config.headers))
        printLog('http-data:' + JSON.stringify(config.data))
        printLog('http-params:' + JSON.stringify(config))
        printLog('http-url:' + JSON.stringify(config.url))

        ///如果FormData-上传模式不转否则报错-可以测试导入用户数据
        // if (config.data && !(config.data instanceof FormData)) {
        //     config.data = Qs.parse(config.data)
        // }
        // if (config.params) {
        //     config.params = Qs.parse(config.params)
        // }
        return config
    },
    error => {
        dismissLoading();
        // do something with request error
        console.log('onRejected:' + error) // for debug
        return Promise.reject(error)
    }
)

service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
        let noToast = false
        if (response && response.config
            && response.config.params
            && response.config.params.noToast) {
            noToast = true
        }
        dismissLoading();
        const res = response.data
        printLog(res, 'http-responseData')
        if (res.result == null) {
            return response;
        }
        // if the custom code is not 20000, it is judged as an error.
        if (!res.result) {
            if (!noToast) {
                showError(res.msg)
            }
            return Promise.reject(res);
        } else {
            //为空返回true
            return !res.data ? true : res.data;
        }
    },
    error => {
        let noToast = false
        if (error.config
            && error.config.params) {
            noToast = error.config.params.noToast
        }
        if (!noToast) {
            showError(error.message + ';code:' + error.code);
        }
        printLog(error, 'http-error') // for debug
        dismissLoading();
        return Promise.reject(error)
    }
)

export default service
