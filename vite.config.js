import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: './', // ⚠️ TOUJOURS './' pour Electron
  build: {
    outDir: 'dist', // répertoire que Electron va charger
    assetsDir: '',  // pour que CSS/JS soient à la racine de dist
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
