import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);//全局安装插件

export default new Router({ //创建路由
    base: process.env.BASE_URL, //基本路径，值使用config中定义的baseUrl
    routes:[ //一级路由
        {
            path: '/',
            name: 'login',
            component:() => import('@/views/login')
            // component:() => import('@/views/index')
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
                {
                    path: '/goods/comment',  //商品评价
                    name: 'comment',
                    component: resolve => {require(['@/views/goods/comment'], resolve)},
                },
                {
                    path: '/goods/comment/detail',  //商品评价详情
                    name: 'commentDetail',
                    component: resolve => {require(['@/views/goods/commentDetail'], resolve)},
                },
                {
                    path: '/goods/category',  //商品分类
                    name: 'category',
                    component: resolve => {require(['@/views/goods/category'], resolve)},
                },
                {
                    path: '/goods/category/addCategory',  //添加商品分类
                    name: 'addCategory',
                    component: resolve => {require(['@/views/goods/addCategory'], resolve)},
                },
                {
                    path: '/goods/type',  //商品类型
                    name: 'type',
                    component: resolve => {require(['@/views/goods/type'], resolve)},
                },
                {
                    path: '/goods/type/prop/:id',   //商品类型属性
                    //:id 是router的params传参的参数名
                    name: 'prop',
                    component: resolve => {require(['@/views/goods/prop'], resolve)},
                },
                {
                    path: '/goods/type/addProp',   //添加商品类型属性
                    //:id 是router的params传参的参数名
                    name: 'addProp',
                    component: resolve => {require(['@/views/goods/addProp'], resolve)},
                },
                {
                    path: '/goods/type/params/:id',   //商品参数列表
                    //:id 是router的params传参的参数名
                    name: 'params',
                    component: resolve => {require(['@/views/goods/params'], resolve)},
                },
                {
                    path: '/goods/type/addParams',   //添加商品参数
                    //:id 是router的params传参的参数名
                    name: 'addParams',
                    component: resolve => {require(['@/views/goods/addParams'], resolve)},
                },
                {
                    path: '/goods/brand',   //品牌管理
                    //:id 是router的params传参的参数名
                    name: 'brand',
                    component: resolve => {require(['@/views/goods/brand'], resolve)},
                },
                {
                    path: '/goods/brand/addBrand',   //添加商品品牌
                    //:id 是router的params传参的参数名
                    name: 'addBrand',
                    component: resolve => {require(['@/views/goods/addBrand'], resolve)},
                },
                {
                    path: '/goods/imgGallery',   //商品图片库
                    //:id 是router的params传参的参数名
                    name: 'imgGallery',
                    component: resolve => {require(['@/views/goods/imgGallery'], resolve)},
                },
            ]
        }
    ]
})
