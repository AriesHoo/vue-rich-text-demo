module.exports = {
    //修改或新增html-webpack-plugin的值，在index.html里面能读取htmlWebpackPlugin.options.title
    publicPath: "./",
    assetsDir: "static",
    outputDir: 'dist',
    runtimeCompiler: true,
    devServer: {
        open: true, // 配置自动启动浏览器
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
    },
    transpileDependencies: ['resize-detector']
};
