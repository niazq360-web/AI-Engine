import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, '.', '');
  // Default to '/AI-Engine/' for GitHub Pages production builds, or '/' during local development
  const isDev = command === 'serve';
  const basePath = process.env.VITE_BASE_PATH ?? (isDev ? '/' : '/AI-Engine/');

  return {
    base: basePath,
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
