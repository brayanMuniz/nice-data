module.exports = {
    configureWebpack: {
        devServer: {
            proxy: {
                '/api': {
                    target: 'https://api.nicehash.com',
                    changeOrigin: true,
                }
            }
        }
    }

}