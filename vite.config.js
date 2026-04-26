import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev: open http://localhost:5173/ — Production (e.g. GitHub Pages): /easy-ebook-giveaways/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/easy-ebook-giveaways/' : '/'
}));