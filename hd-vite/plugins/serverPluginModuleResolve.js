const { join, dirname, resolve } = require('path');

const fs = require('fs').promises;

function resolveVue(root) {
    const compilerPkgPath = join(root, 'node_modules', '@vue/compiler-sfc/package.json')
    const compilerPkg = require(compilerPkgPath);
    const compilerPath = join(dirname(compilerPkgPath), compilerPkg.main);

    resolvePath = (name) => {
        return resolve(root, 'node_modules', `@vue/${name}/dist/${name}.esm-bundler.js`)
    }

    // 用于后端读取编译文件
    return {
        compiler: compilerPath,
        '@vue/runtime-dom': resolvePath('runtime-dom'),
        '@vue/runtime-core': resolvePath('runtime-core'),
        '@vue/reactivity': resolvePath('reactivity'),
        '@vue/shared': resolvePath('shared'),
        vue: resolvePath('runtime-dom')
    }
}

function moduleResolvePlugin({ app, root }) {
    const reg = /^\/\@modules\//;

    const VueResolved = resolveVue(root);

    app.use(async (ctx, next) => {
        if (!reg.test(ctx.path)) {
            return next()
        } else {
            // /@modules/vue => vue
            const id = ctx.path.replace(reg, '');
            // console.log(id);
            ctx.type = 'js';
            const content = await fs.readFile(VueResolved[id], "utf8")
            ctx.body = content;
        }
    })
}


module.exports = {
    moduleResolvePlugin
}