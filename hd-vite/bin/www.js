#! /usr/bin/env node
// 可以运行的脚本
// console.log('11111');
const createServer = require('../index')

createServer().listen(4000, () => {
    console.log('正在监听4000端口')
})