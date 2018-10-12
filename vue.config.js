module.exports = {
    // baseUrl: process.env.NODE_ENV === 'production' ?
    //     '/production-sub-path/' : '/',
    // Todo Change the proxy to the actual deployment base
    // ? It does not work becasue at deployment it does not know what the dev server is 

    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            config.proxy = {
                '/api': {
                    target: 'https://api.nicehash.com',
                    changeOrigin: true,
                }
            }
        } else {
            config.devServer = {
                    proxy: {
                        '/api': {
                            target: 'https://api.nicehash.com',
                            changeOrigin: true,
                        }
                    }
                }

        }
    }
}