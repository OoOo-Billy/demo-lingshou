import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import axios from 'axios'
import { Message } from 'element-ui'
import Element from 'element-ui'
import plugin from './utils/plugin'
import './assets/css/element-variables.scss'

Vue.config.productionTip = false;
Vue.use(Element);
Vue.use(plugin);
Vue.prototype.$ajax = axios;
//全局路由判断函数
router.beforeEach((to,from,next)=>{//导航守卫
    if (!localStorage.getItem('userInfo') || JSON.stringify(store.getters.userInfo) === '{}'){
        //如果是新用户或者本地储存数据为空的用户
        if (to.name === 'login'){
            next();
        } else {
            Message.error('登陆过期');
            router.replace('/');//replace不会再history中添加新记录，而是替换当前的history记录
        }
    }else {//利用vuex更改nav状态，达到动态修改菜单的效果
        let module = to.path.split('/')[1] ? to.path.split('/')[1] : 'index';
        store.commit('ACTIVE_NAV',module); //调用vuex的commit方法修改状态
        next();
    }
});

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
