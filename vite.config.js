import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import svgrPlugin from 'vite-plugin-svgr'
import { createHtmlPlugin } from 'vite-plugin-html'
import EnvironmentPlugin from 'vite-plugin-environment'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import inject from '@rollup/plugin-inject'
import polyfillNode from 'rollup-plugin-polyfill-node'
import autoprefixer from 'autoprefixer'

import 'dotenv/config'

// https://vitejs.dev/config/
export default defineConfig({
  // source code location
  root: './src',
  // where env vars are stored
  envDir: '..',
  build: {
    // where build files should be stored
    outDir: '../build',
    // empty the build directory on each build
    emptyOutDir: true,
    // improve CPU usage
    sourcemap: false,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      // improve CPU usage
      cache: false,
      plugins: [
        // https://github.com/vitejs/vite/discussions/2785
        inject({
          modules: { Buffer: ['buffer', 'Buffer'] },
        }),
        // include polyfills
        polyfillNode(),
      ],
    },
  },
  // relative to the root
  publicDir: '../public',
  server: {
    // backend settings
    open: true,
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5001',
    },
  },
  resolve: {
    // polyfills
    alias: {
      events: 'events',
      stream: 'stream-browserify',
      zlib: 'browserify-zlib',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        // Node.js global to browser globalThis
        global: 'globalThis',
      },
      plugins: [
        // activate Buffer
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
  plugins: [
    // export SVGs as React components by default
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
          VITE_GA_ID: process.env.VITE_GA_ID,
          VITE_ZENDESK_KEY: process.env.VITE_ZENDESK_KEY,
        },
      },
    }),
    // use env vars
    EnvironmentPlugin('all'),
    // activate buffer and process
    NodeGlobalsPolyfillPlugin({
      buffer: true,
    }),
    // use TS paths
    viteTsconfigPaths(),
  ],
  css: {
    postcss: {
      plugins: [
        autoprefixer({}), // add options if needed
      ],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'setupTests.js',
  },
})
