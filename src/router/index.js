import Vue from 'vue'
import Router from 'vue-router'
import path from "@/router/path";

Vue.use(Router);
export const constantRoutes = [
    {
        path: '*',      //没有配置的路径
        redirect: path.EDITOR_INDEX,   //默认跳转首页
        meta: {
            title: 'TinyMce Editor Sample'
        },
    },
    {
        path: path.EDITOR_INDEX,
        meta: {
            title: '示例'
        },
        component: () => import("@/components/tinymce-demo"),
        children: [],
    },
]


const createRouter = () => new Router({
    mode: 'hash',
    routes: constantRoutes
})

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
const originalReplace = Router.prototype.replace;
Router.prototype.replace = function replace(location) {
    return originalReplace.call(this, location).catch(err => err);
};
const router = createRouter()
export default router
