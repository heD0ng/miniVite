const static = require('koa-static');
const { resolve,join } = require('path')
function serveStaticPlugin(ctx) {
    const { app, root } = ctx;

    app.use(static(root));
    app.use(static(join(root, 'public')))
}

// 静态服务器
module.exports = {
    serveStaticPlugin
}