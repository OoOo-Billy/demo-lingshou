module.exports = {
    baseUrl: './',
    lintOnSave: false,//解除eslint限制
    devServer: { //配置代理
        proxy: {
            '/api': {
                target: 'http://192.168.249.108:8080',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
};