import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { prismjsPlugin } from 'vite-plugin-prismjs'

// const isProduction = process.env.NODE_ENV === 'production'

export default defineNuxtConfig({
  app: {
    head: {
      title: '沐毅代码世界',
      meta: [
        { name: 'keywords', content: '博客,沐毅,代码,code' },
        { name: 'description', content: '沐毅代码世界,博客' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'stylesheet',
          href: '//at.alicdn.com/t/c/font_3420979_f6dbhdrnbpu.css'
        }
      ]
      // script: [{ src: 'https://at.alicdn.com/t/font_3420979_o8r3ia8tx4c.js' }]
    }
  },
  modules: [
    '@element-plus/nuxt',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt'
  ],
  elementPlus: {
    directives: {
      InfiniteScroll: 'ElInfiniteScroll'
    }
  },
  build: {},
  //vite只能用 ant-design-vue/es 而非 ant-design-vue/lib
  css: [
    'ant-design-vue/es/message/style/css',
    '@/assets/less/style.less'
    // '@/assets/less/iconfont.less'
  ],
  postcss: {
    plugins: {
      autoprefixer: {}
    }
  },
  vite: {
    logLevel: 'info',
    optimizeDeps: {
      include: ['vue', 'pinia', 'ufo']
    },
    server: {
      hmr: true,
      watch: {
        usePolling: true //set here to enable hot reload
      }
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            'primary-color': '#0AA679'
          },
          javascriptEnabled: true
        }
      }
    },

    plugins: [
      Components({
        resolvers: [AntDesignVueResolver()]
      }),
      prismjsPlugin({
        languages: [
          'js',
          'javascript',
          'html',
          'xml',
          'css',
          'bash',
          'dart',
          'dockerfile',
          'go',
          'kotlin',
          'lua',
          'markdown',
          'nginx',
          'php',
          'python',
          'ruby',
          'shell',
          'sql',
          'swift',
          'vim',
          'yaml'
        ]
      })
    ],
    // @ts-expect-error: Missing ssr key
    ssr: {
      noExternal: ['compute-scroll-into-view', 'ant-design-vue']
    }
  },
  runtimeConfig: {
    public: {
      BASE_URL: process.env.BASE_URL + '/api',
      API_HOSTNAME: process.env.BASE_URL,
      API_PREFIX: '/api'
    }
  }
  // autoImports: {
  //   global: false //關掉的話更新跑的比較快
  // },
  // components: {
  //   global: false //關掉的話更新跑的比較快
  // }
})
