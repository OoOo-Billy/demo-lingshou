export default {
    index:{
        title: '首页',
        // path: '/index/systemIndex',
        path: '/index/',//调试
        child:[//子项
            {
                sub:'系统首页',
                menu:[//侧边菜单栏数组
                    {
                        name:'系统首页',//菜单item名
                        path:'/index/systemIndex',
                    },
                    {
                        name:'账户设置',
                        path:'/index/accountSetting',
                    },
                    {
                        name:'系统信息',
                        path:'/index/systemInfo',
                    },
                    {
                        name:'登陆设置',
                        path:'/index/conLog',
                    },
                ]
            }
        ]
    },
    goods: {
        title: "商品",
        path: '/goods/list',
        child: [
            {
                sub: "商品管理",
                menu: [
                    {
                        name: "商品列表",
                        path: "/goods/list"
                    },
                    {
                        name: "添加商品",
                        path: "/goods/add"
                    },
                    {
                        name: "商品回收站",
                        path: "/goods/recycle"
                    },
                    {
                        name: "商品评价",
                        path: "/goods/comment"
                    }
                ]
            },
            {
                sub: "商品配置",
                menu: [
                    {
                        name: "商品分类",
                        path: "/goods/category"
                    },
                    {
                        name: "商品类型",
                        path: "/goods/type"
                    },
                    {
                        name: "品牌管理",
                        path: "/goods/brand"
                    },
                    {
                        name: "商品图片库",
                        path: "/goods/image"
                    },
                ]
            }
        ]
    },
}