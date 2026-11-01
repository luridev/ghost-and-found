import { fileURLToPath } from 'node:url';
import { getBrowserTargets } from '@protoapps/browser-targets';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/ghost-and-found/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: getBrowserTargets(),
  },
});
