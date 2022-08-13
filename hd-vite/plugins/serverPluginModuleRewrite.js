const MagicString = require('magic-string');
const { parse } = require('es-module-lexer')
const { readBody } = require('../utils')

function importRewrite(source) {
    let imports = parse(source)[0]
    console.log(imports);
    // parse(source) : [ [ {s:10,e:12}, {s:20,e:32}] ]
    // 字符串变成对象
    let magicString = new MagicString(source);
    if (imports && imports.length) {

        for (let i = 0; i < imports.length; i++) {
            const { s, e } = imports[i];
            let id = source.substring(s, e);
            // 如果开头不是.或者/，就需要重写路径
            const reg = /(^\/|^\.)/
            if (!reg.test(id)) {
                id = `/@modules/${id}`;
                magicString.overwrite(s, e, id);
            }
        }

    }
    return magicString.toString();
}

function moduleRewritePlugin(ctx) {
    const { app, root } = ctx;

    app.use(async (context, next) => {
        // 先让静态资源读取，然后修改路径
        await next()

        // 只处理js文件
        if (context.body && context.response.is('js')) {
            const content = await readBody(context.body)
            // console.log(content)
            const res = await importRewrite(content)
            // console.log(res);
            context.body = res;
        }


    })

}

// 静态服务器
module.exports = {
    moduleRewritePlugin
}