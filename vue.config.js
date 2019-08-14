module.exports = {
    // 选项...
    // productionSourceMap: false,
    pluginOptions: {
        UglifyPlugin: {
            // 插件可以作为 `options.pluginOptions.foo` 访问这些选项。
        }
    },
    configureWebpack: (config) => {

        //  引入uglifyjs-webpack-plugin
        let UglifyPlugin = require('uglifyjs-webpack-plugin');

        if (process.env.NODE_ENV === 'production') {
            // 为生产环境修改配置
            config.mode = 'production';
            // 将每个依赖包打包成单独的js文件
            let optimization = {
                minimizer: [new UglifyPlugin({
                    uglifyOptions: {
                        warnings: false,
                        compress: {
                            drop_console: true,
                            drop_debugger: false,
                            pure_funcs: ['console.log']
                        }
                    }
                })]
            };
            Object.assign(config, {
                optimization
            })
        } else {
            // 为开发环境修改配置
            config.mode = 'development'
        }
    }
};
