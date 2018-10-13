module.exports = {
    configureWebpack: {
        proxy: {
            '/api': {
                target: 'https://api.nicehash.com',
                changeOrigin: true,
            }
        }
    }



}