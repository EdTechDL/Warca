import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Warca/',  // GitHub Pages deploys to https://username.github.io/Warca/
  build: {
    outDir: 'dist',
  },
});
