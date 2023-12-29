import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {browserslistToTargets} from 'lightningcss';
import browserslist from 'browserslist';
import libCss from 'vite-plugin-libcss';

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  console.log('[vite mode]', mode)
  if(mode === 'production') {
    console.log('[vite build:production]')
    return {
      plugins: [
        vue(),
        libCss()
      ],
      css: {
        transformer: 'lightningcss',
        lightningcss: {
          targets: browserslistToTargets(browserslist('>= 0.25%'))
        },
      },
      build: {
        cssCodeSplit: true,
        cssMinify: 'lightningcss',
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
