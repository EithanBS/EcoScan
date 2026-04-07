import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.HELIXMIND_API_KEY': JSON.stringify(env.HELIXMIND_API_KEY),
      'process.env.HELIXMIND_BASE_URL': JSON.stringify(env.HELIXMIND_BASE_URL),
      'process.env.HELIXMIND_CHAT_URL': JSON.stringify(env.HELIXMIND_CHAT_URL),
      'process.env.HELIXMIND_MODEL': JSON.stringify(env.HELIXMIND_MODEL),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
