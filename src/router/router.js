import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);//全局安装插件

export default new Router({ //创建路由
    base: process.env.BASE_URL, //基本路径，值使用config中定义的baseUrl
    routes:[ //一级路由
        {
            path: '/',
            name: 'login',
            // component:() => import('@/views/login')
            component:() => import('@/views/index')
        },
        {
            path: '/index',
            name: 'index',
            component: resolve => {require(['@/views/index'],resolve)},
            redirect: '/index/systemIndex', //重定向
            children: [
                //二级路由
                {
                    path: '/index/systemIndex',//系统首页
                    name: 'systemIndex',
                    component: resolve => {require(['@/views/index/systemIndex'],resolve)},
                },
                {
                    path: '/index/accountSetting',//账户设置
                    name: 'accountSetting',
                    component: resolve => {require(['@/views/index/accountSetting'],resolve)},
                },
                {
                    path: '/index/systemInfo',//系统信息
                    name: 'systemInfo',
                    component: resolve => {require(['@/views/index/systemInfo'],resolve)},
                },
                {
                    path: '/index/conLog',//登录日志
                    name: 'conLog',
                    component: resolve => {require(['@/views/index/conLog'],resolve)},
                },
                {
                    path: '/goods/list',   //商品列表
                    name: 'goodsList',
                    component: resolve => {require(['@/views/goods/list'], resolve)},
                },
                {
                    path: '/goods/add',  //添加商品
                    name: 'add',
                    component: resolve => {require(['@/views/goods/add'], resolve)},
                },
                {
                    path: '/goods/recycle',  //商品回收站
                    name: 'recycle',
                    component: resolve => {require(['@/views/goods/recycle'], resolve)},
                },
            ]
        }
    ]
})
