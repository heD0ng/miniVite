import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    // 基础路径
    base: './',
    plugins: [
        vue(),
        // importToCDN({
        //     modules: [
        //         {
        //             name: "vue",
        //             var: "Vue",
        //             path: "https://unpkg.com/vue@next",
        //         },
        //         {
        //             name: "element-plus",
        //             var: "ElementPlus",
        //             path: `https://unpkg.com/element-plus`,
        //             css: "https://unpkg.com/element-plus/dist/index.css",
        //         },
        //     ],
        // }),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            '/assets': './src/assets'
        }
    },
    build: {
        minify: 'terser',
        // Esbuild: terserOptions不生效
        terserOptions: {
            compress: {
                // 生产环境移除console、debugger
                drop_console: true,
                drop_debugger: true,
            }
        }
    },
    server:{
        proxy:{
            '/ss':{
                target:'https://www.baidu.com',
                changeOrigin: true,
                rewrite:(p) => p.replace(/^\/ss/, '')
            }
        }
    }
})
