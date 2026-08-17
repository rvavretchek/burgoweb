import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  cacheDir: process.env.BURGOWEB_VITE_CACHE_DIR,
  server: {
    proxy: {
      '/api/v1': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: false,
      },
    },
  },
  resolve: { tsconfigPaths: true },
  plugins: [
    tanstackStart({
      importProtection: { behavior: 'error' },
    }),
    viteReact(),
  ],
});
