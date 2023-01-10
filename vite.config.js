import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import svgrPlugin from 'vite-plugin-svgr'
import { createHtmlPlugin } from 'vite-plugin-html'
import EnvironmentPlugin from 'vite-plugin-environment'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import inject from '@rollup/plugin-inject'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'

// https://vitejs.dev/config/
export default defineConfig({
  root: './src',
  envDir: '..',
  build: {
    outDir: '../build',
    emptyOutDir: true,
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      plugins: [
        // https://github.com/vitejs/vite/discussions/2785
        inject({
          modules: { Buffer: ['buffer', 'Buffer'] },
        }),
        rollupNodePolyFill(),
        viteCommonjs(),
      ],
    },
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
    // polyfills
    alias: {
      assert: 'rollup-plugin-node-polyfills/polyfills/assert',
      events: 'events',
      stream: 'stream-browserify',
      zlib: 'browserify-zlib',
      util: 'rollup-plugin-node-polyfills/polyfills/util',
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
      process: true,
    }),
    // use TS paths
    viteTsconfigPaths(),
  ],
  test: {
    globals: true,
    setupFiles: 'src/setupTests.js',
  },
})
