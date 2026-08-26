import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// Backend server URL, used only to proxy /graphql and /api during local dev
// so the frontend can keep making same-origin requests (e.g. fetch('/graphql')).
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/graphql': {
          target: BACKEND_URL,
          changeOrigin: true,
        },
        '/api': {
          target: BACKEND_URL,
          changeOrigin: true,
        },
      },
    },
  };
});
