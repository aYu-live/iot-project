
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import path from 'node:path'

export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 8081,
        proxy: {
            '/api': {
                target: {
                    port: 3000
                }
            }
        }
    },
    plugins: [
        vue(),
        Components({
            resolvers: [AntDesignVueResolver({
                importStyle: false
            })]
        }),
    ],
    resolve: {
        alias: {
            "@api": path.resolve(__dirname, './src/utils/api.js'),
            '@': path.resolve(__dirname, './src')
        }
    },
    build: {
        manifest: true,
        emptyOutDir: true
    },
    css: {
        preprocessorOptions: {
            less: {
                additionalData: `@import "${path.resolve(__dirname, './src/assets/css/common.less')}";`
            }
        }
    }
})
