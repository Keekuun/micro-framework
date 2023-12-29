import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// issue: https://github.com/vitejs/vite/issues/1579
import libCss from 'vite-plugin-libcss';

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  console.log('[vite mode]', mode)
  if(mode === 'production') {
    console.log('[vite build:production]')
    return {
      plugins: [
        react(),
        libCss()
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
