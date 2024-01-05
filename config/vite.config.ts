import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  root: 'client/src/',
  publicDir: 'client/src/assets',
  build: {
    outDir: '../dist'
  }
})
