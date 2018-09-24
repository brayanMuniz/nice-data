module.exports = {
    // baseUrl: process.env.NODE_ENV === 'production' ?
    //     '/production-sub-path/' : '/',
    devServer: {
        proxy: {
            '/api': {
                target: 'https://api.nicehash.com',
                ws: true,
                changeOrigin: true,
            }
        }
    }

}