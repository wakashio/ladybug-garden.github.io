import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  base: process.env.VITE_BASE_DIR,
  build: {
    outDir: 'dist', // 出力ディレクトリを明示的に 'dist' に設定
  },
})
