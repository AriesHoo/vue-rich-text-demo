import {Loading} from "element-ui";

let loadingService = [];

/**
 * 全局loading
 * @param text
 * @param lock
 */
export function showLoading(text, lock) {
    let loading = Loading.service(
        {
            lock: lock ?? true,
            text: text,
            // spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)',
            fullscreen:true
        }
    );
    loadingService.push(loading);
    return loading;
}

/**
 * 关闭所有loading提示框
 */
export function dismissLoading() {
    if (loadingService != null && loadingService.length > 0) {
        loadingService.filter((item) =>
            item.close()
        );
    }
}
