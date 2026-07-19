import { defineConfig } from 'vite';

export default defineConfig({
  // Relative base so the build works at any path — e.g. GitHub Pages project
  // subpath https://shawnchee.github.io/hudsons-deli/ — as well as at root.
  base: './',
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    open: false,
  },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096,
  },
});
