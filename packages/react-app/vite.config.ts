import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  console.log('[vite mode]', mode)
  if(mode === 'production') {
    console.log('[vite build:production]')
    return {
      plugins: [
        react(),
      ],
      build: {
        lib: {
          entry: 'src/main.tsx',
          name: 'react-micro-app',
          fileName: 'index',
        },
        outDir: './dist',
        sourcemap: true
      }
    }
  }

  console.log('[vite build:development]')
  return {
    plugins: [react()],
  }
})
