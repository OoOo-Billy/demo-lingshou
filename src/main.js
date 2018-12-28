import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import { Message } from 'element-ui'
import plugin from './utils/plugin'
import VueResource from 'vue-resource'


Vue.config.productionTip = false;
// Vue.use(Element);
Vue.use(plugin);
Vue.use(VueResource);

//全局路由判断函数
router.beforeEach((to,from,next)=>{
    if (!localStorage.getItem('userInfo') || JSON.stringify(store.getters.userInfo) === '{}'){
        //如果是新用户或者本地储存数据为空的用户
        if (to.name === 'login'){
            next();
        } else {
            //this.$message.error('登陆过期');
            Message.error('登陆过期');
            router.replace('/');//replace不会再history中添加新记录，而是替换当前的history记录
        }
    }else {
        let module = to.path.split('/')[1] ? to.path.split('/')[1] : 'index';
        store.commit('ACTIVE_NAV',module); //调用vuex的commit方法修改状态
        next();
    }
});

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')
