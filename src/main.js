import Vue from 'vue'
import App from '@/App.vue'
import ElementUI from 'element-ui';
import router from '@/router'
import '@/permission'
import 'element-ui/lib/theme-chalk/index.css';
import 'babel-polyfill'
import Print from 'vue-print-nb'
Vue.use(Print)

Vue.config.productionTip = false
//UI框架
Vue.use(ElementUI);

new Vue({
    el: "#app",
    router,
    render: h => h(App),
})
