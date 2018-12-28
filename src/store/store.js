import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({ //创建Store对象，并暴露
    state:{
        //定义state对象，这里放的是我们需要进行状态管理得数据，类似与vue的data
        userInfo: localStorage.getItem('userInfo') ||{},
        activeNav: 'index',
    },
    getters:{
        //定义getter，这个可以认为是store的计算属性，意思就是只有当getter中的依赖值发生变化时才会重新计算，不然会被缓存起来。
        //例如这里的getter返回的userInfo的值只有发生了变化，state中的数据才会发生对应的变化
        userInfo: state => state.userInfo,
        activeNav: state => state.activeNav,
    },
    mutations:{
        //定义状态值的提交方法mutations
        SET_USERINFO(state,userInfo){
            state.userInfo = userInfo;
            localStorage.setItem('userInfo',userInfo);
        },
        CLEAR_USERINFO(state){
            state.userInfo = {};
            localStorage.removeItem('userInfo');
        },
        ACTIVE_NAV(state,module){
            state.activeNav = module;
        }
    },
    actions:{

    }
})