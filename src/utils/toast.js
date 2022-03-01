import {Message} from 'element-ui'

export function showError(msg) {
    show(msg, 'error')
}

export function showSuccess(msg) {
    show(msg, 'success')
}

export function showWarning(msg) {
    show(msg, 'warning')
}

export function showInfo(msg) {
    show(msg, 'info')
}

function show(msg, type) {
    Message({
        message: msg,
        type: type,
        showClose: true,
        offset:120,
        duration:5000,
    })
}
