module.exports = {
    baseUrl: process.env.NODE_ENV === 'production' ?
        '/production-sub-path/' : '/',
    // Todo Change the proxy to the actual deployment base

    devServer: {
        proxy: {
            '/api': {
                target: 'https://api.nicehash.com',
                changeOrigin: true,
            }
        }
    }

}