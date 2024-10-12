import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    svelte(),
    viteStaticCopy({
      targets: [
        {
          src: 'src/lib/*',
          dest: 'lib'
        },
        {
          src: 'src/assets/*',
          dest: 'assets'
        }
      ]
    })
  ],
  resolve: {
    alias: {
      '$lib': resolve(__dirname, './src/lib'),
      '$assets': resolve(__dirname, './src/assets')
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/popup.html'),
        background: resolve(__dirname, 'src/background.js'),
        content: resolve(__dirname, 'src/content/content.js'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background') {
            return 'background.js';
          }
          if (chunkInfo.name === 'content') {
            return 'content/content.js';
          }
          return '[name]/[name].js';
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'popup.html') {
            return 'popup/popup.html';
          }
          if (assetInfo.name.endsWith('.png')) {
            return 'assets/[name][extname]';
          }
          if (assetInfo.name.endsWith('.css')) {
            return 'styles/[name][extname]';
          }
          return '[name][extname]';
        },
      },
    },
    target: 'esnext',
    minify: false,
  }
});