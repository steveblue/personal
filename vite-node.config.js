import { VitePluginNode } from 'vite-plugin-node';

const config = {
  base: '/',
  build: {
    outDir: 'dist/server'
  },
  plugins: [
    ...VitePluginNode({
      server: 'express',
      appPath: './src/server/index.ts',
      port: 4444,
      tsCompiler: 'esbuild'
    })
  ]
};

export default config;
