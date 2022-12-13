import { defineConfig } from 'vite'
// import reactRefresh from '@vitejs/plugin-react-refresh'

import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import svgrPlugin from 'vite-plugin-svgr'
import { createHtmlPlugin } from 'vite-plugin-html'

// https://vitejs.dev/config/
export default defineConfig({
  root: 'src',
  build: {
    // relative to the root
    outDir: '../dist',
  },
  publicDir: '../public',
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
        },
      },
    }),
    viteTsconfigPaths(),
  ],
  server: {
    open: true,
    port: 3000,
  },
})
