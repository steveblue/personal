export default {
  plugins: [],
  esbuild: {
    format: 'esm',
    target: 'es2022',
  },
  rollupOptions: {
    output: {
      name: 'window',
      sourcemap: false,
      extend: true,
    },
  },
};
