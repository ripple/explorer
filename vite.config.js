import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

// import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import svgrPlugin from 'vite-plugin-svgr'
import builtins from 'rollup-plugin-node-builtins'

const builtinsPlugin = {
  ...builtins({ crypto: true }),
  name: 'builtins',
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), viteTsconfigPaths(), svgrPlugin(), builtinsPlugin],
  server: {
    open: true,
    port: 3000,
  },
})
