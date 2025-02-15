import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './src/server/db.ts',
      output: {
        entryFileNames: 'db.js',
      },
    },
  },
});
