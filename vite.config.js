import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * GitHub Pages + custom domain at site root (e.g. easyebookgiveaways.com) → base must be `/`.
 * Project URL only (https://user.github.io/repo-name/) → set VITE_BASE_PATH=/repo-name/ when building.
 */
function normalizeBase(path) {
  const p = path.trim();
  if (p === '' || p === '/') {
    return '/';
  }
  const withLeading = p.startsWith('/') ? p : `/${p}`;
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
}

export default defineConfig(({ mode }) => {
  const envBase = process.env.VITE_BASE_PATH;
  const base =
    mode === 'production'
      ? envBase && envBase.trim() !== ''
        ? normalizeBase(envBase)
        : '/'
      : '/';

  return {
    plugins: [react()],
    base
  };
});
