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
                    name: 'imgGallery',
                    component: resolve => {require(['@/views/goods/imgGallery'], resolve)},
                },
                {
                    path: '/goods/imgGallery/addImage', //添加商品图片库
                    name: 'addImage',
                    component: resolve => {require(['@/views/goods/addImage'], resolve)},
                },
                /*注意：
                *   ↑'/goods/imgGallery/addImage'
                * 和↓'/goods/imgGallery/:id'
                * 的顺序不能颠倒,因为路由匹配顺序从上往下
                * */
                {
                    path: '/goods/imgGallery/:id', //查看相册图片
                    name: 'imageList',
                    component: resolve => {require(['@/views/goods/imageList'], resolve)},
                },
                {
                    path: '/order/list', //订单列表
                    name: 'orderList',
                    component: resolve => {require(['@/views/order/list'], resolve)},
                },
                {
                    path: '/order/list/orderDetail', //订单列表
                    name: 'orderDetail',
                    component: resolve => {require(['@/views/order/orderDetail'], resolve)},
                },
                {
                    path: '/order/receipt', //确认收货
                    name: 'receipt',
                    component: resolve => {require(['@/views/order/receipt'], resolve)},
                },
                {
                    path: '/order/orderSetting', //订单设置
                    name: 'orderSetting',
                    component: resolve => {require(['@/views/order/orderSetting'], resolve)},
                },
                {
                    path: '/order/returnGoods', //退货申请处理
                    name: 'returnGoods',
                    component: resolve => {require(['@/views/order/returnGoods'], resolve)},
                },
                {
                    path: '/order/returnGoods/returnGoodsDetail', //退货详情
                    name: 'returnGoodsDetail',
                    component: resolve => {require(['@/views/order/returnGoodsDetail'], resolve)},
                },
                {
                    path: '/order/refund', //退货详情
                    name: 'refund',
                    component: resolve => {require(['@/views/order/refund'], resolve)},
                },
                {
                    path: "/order/refund/refundDetail",//退款详情
                    name: 'refundDetail',
                    component: resolve => {require(['@/views/order/refundDetail'], resolve)},
                },
                {
                    path: "/order/returnCause",//退货原因设置
                    name: 'returnCause',
                    component: resolve => {require(['@/views/order/returnCause'], resolve)},
                },
                {
                    path: "/order/address",//退货点
                    name: 'address',
                    component: resolve => {require(['@/views/order/addressList'], resolve)},
                },
                {
                    path: "/order/address/addAddress",//发货点信息管理
                    name: 'addAddress',
                    component: resolve => {require(['@/views/order/addAddress'], resolve)},
                },
            ]
        }
    ]
})
