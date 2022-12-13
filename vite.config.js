import { defineConfig } from 'vite'
// import reactRefresh from '@vitejs/plugin-react-refresh'

import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import svgrPlugin from 'vite-plugin-svgr'
import { createHtmlPlugin } from 'vite-plugin-html'
// import replace from '@rollup/plugin-replace'

// https://vitejs.dev/config/
export default defineConfig({
  root: 'src',
  build: {
    // relative to the root
    outDir: '../dist',
  },
  publicDir: '../public',
  define: { 'process.env.NODE_DEBUG': '"false"' },
  resolve: {
    alias: {
      process: 'process/browser',
      stream: 'stream-browserify',
      zlib: 'browserify-zlib',
      util: 'util',
    },
  },
  plugins: [
    svgrPlugin({
      exportAsDefault: true,
    }),
    react({
      // Use React plugin in all *.jsx and *.tsx files
      include: '**/*.{jsx,tsx}',
    }),
    createHtmlPlugin({
      inject: {
        data: {
          REACT_APP_GA_ID: import.meta.env.REACT_APP_GA_ID,
          REACT_APP_ZENDESK_KEY: import.meta.env.REACT_APP_ZENDESK_KEY,
          process: import.meta,
        },
      },
    }),
    viteTsconfigPaths(),
    // replace({
    //   'process.env': 'import.meta.env',
    // }),
  ],
  server: {
    open: true,
    port: 3000,
  },
})
