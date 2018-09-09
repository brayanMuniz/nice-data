module.exports = {
    // baseUrl: process.env.NODE_ENV === 'production' ?
    //     '/production-sub-path/' : '/',
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                ws: true,
                changeOrigin: true
            }
        }
    }

}