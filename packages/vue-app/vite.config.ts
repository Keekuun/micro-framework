import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  console.log('[vite mode]', mode)
  if(mode === 'production') {
    console.log('[vite build:production]')
    return {
      plugins: [
        vue()
      ],
      build: {
        lib: {
          entry: 'src/main.ts',
          name: 'vue-micro-app',
          fileName: 'index',
        },
        outDir: './dist',
        sourcemap: true
      }
    }
  }

  console.log('[vite build:development]')
  return {
    plugins: [vue()],
  }
})
