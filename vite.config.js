import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import svgrPlugin from 'vite-plugin-svgr'
import { createHtmlPlugin } from 'vite-plugin-html'
import EnvironmentPlugin from 'vite-plugin-environment'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

// https://vitejs.dev/config/
export default defineConfig({
  root: './src',
  envDir: '..',
  build: {
    // relative to the root
    outDir: '../build',
  },
  // relative to the root
  publicDir: '../public',
  server: {
    open: true,
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5001',
    },
  },
  define: { 'process.env': {} },
  resolve: {
    alias: {
      events: 'events',
      stream: 'stream-browserify',
      zlib: 'browserify-zlib',
      'util/': 'util',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        // Node.js global to browser globalThis
        global: 'globalThis',
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
  plugins: [
    svgrPlugin(),
    react({
      // Use React plugin in all *.jsx and *.tsx files
      include: '**/*.{jsx,tsx}',
    }),
    createHtmlPlugin({
      inject: {
        data: {
          REACT_APP_GA_ID: '',
          REACT_APP_ZENDESK_KEY: '',
        },
      },
    }),
    EnvironmentPlugin('all'),
    NodeGlobalsPolyfillPlugin({
      buffer: true,
      process: true,
    }),
    viteTsconfigPaths(),
  ],
  test: {
    globals: true,
    setupFiles: 'src/setupTests.js',
  },
})
