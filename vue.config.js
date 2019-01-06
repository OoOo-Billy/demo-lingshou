module.exports = {
    baseUrl: './',
    lintOnSave: false,//解除eslint限制
    devServer: { //配置代理
        proxy: {
            '/api': {
                target: 'http://47.107.167.164:8080',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
};