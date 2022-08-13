const koa = require('koa')
const {serveStaticPlugin} = require('./plugins/serverPluginServeStatic');
const {moduleRewritePlugin} = require('./plugins/serverPluginModuleRewrite')
const {moduleResolvePlugin} = require('./plugins/serverPluginModuleResolve')
function createServer() {
    const app = new koa();
    // 当前进程的路径
    const root = process.cwd()
    const ctx = {
        app,
        root
    }
    // 静态资源
    const plugins = [
        // 重写路径导入
        moduleRewritePlugin,
        // 解析路径重写后的资源
        moduleResolvePlugin,
        // 静态资源获取
        serveStaticPlugin
    ]
    plugins.forEach(plugin => {
        plugin(ctx)
    })
    return app
}

module.exports = createServer;