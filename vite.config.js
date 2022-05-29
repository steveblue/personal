import globalStyle from '@originjs/vite-plugin-global-style';

const config = {
  base: '/',
  build: {
    outDir: 'dist/client'
  },
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: ['src/client/style']
      }
    }
  },
  publicDir: 'public',
  server: {
    port: '4443'
  },
  plugins: [globalStyle({ sassEnabled: true })]
};

export default config;
