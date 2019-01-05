export default {
    index:{
        title: '首页',
        path: '/index/systemIndex',
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
    test:{
        title: '测试页',
        path: '/index/test',
        child:[//子项
            {
                sub:'测试标题',
                menu:[//侧边菜单栏数组
                    {
                        name:'测试标题',//菜单item名
                        path:'/index/systemIndex',
                    },
                    {
                        name:'测试1',
                        path:'/index/accountSetting',
                    },
                    {
                        name:'测试2',
                        path:'/index/systemInfo',
                    },
                    {
                        name:'测试3',
                        path:'/index/conLog',
                    },
                ]
            }
        ]
    }
}