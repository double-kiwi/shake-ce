import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { viteMockServe } from 'vite-plugin-mock'
import dts from 'vite-plugin-dts'

const entry = fileURLToPath(new URL('./src/main.ts', import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const isLib = mode === 'lib'

  return {
    plugins: [
      vue({ customElement: true }),
      vueJsx(),
      ...(isLib
        ? [
            dts({
              tsconfigPath: './tsconfig.app.json',
              rollupTypes: false,
            }),
          ]
        : []),
      ...(command === 'serve'
        ? [
            vueDevTools(),
            viteMockServe({
              mockPath: 'mock',
              enable: true,
              watchFiles: true,
              logger: true,
            }),
          ]
        : []),
    ],
    define: {
      'process.env.NODE_ENV': JSON.stringify(command === 'build' ? 'production' : mode),
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: isLib
      ? {
          outDir: 'dist/lib',
          emptyOutDir: true,
          cssCodeSplit: false,
          copyPublicDir: false,
          lib: {
            entry,
            formats: ['es'],
            fileName: 'main',
          },
          rollupOptions: {
            external: ['vue', 'pinia', 'mitt'],
          },
        }
      : {
          outDir: 'dist',
          emptyOutDir: true,
          cssCodeSplit: false,
          copyPublicDir: true,
          lib: {
            entry,
            name: 'Shake',
            formats: ['iife'],
            fileName: () => 'shake.js',
          },
        },
  }
})
