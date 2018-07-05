module.exports = {
    proxy: {
        '/api': { //将www.exaple.com印射为/api
            target: 'http://www.wujiaweb.com', // 接口域名
            changeOrigin: true, //是否跨域
            // pathRewrite: {
            //     '^/api': '' //需要rewrite的,
            // }
        }
    }
}