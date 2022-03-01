import router from '@/router'

//路由开始前
router.beforeEach(async (to, from, next) => {
    //设置页面标题-public/home-page.html的title标签值
    next();
})

//路由完结
router.afterEach(() => {
})
