import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  optimizeDeps: {
    exclude: [
      "@jsquash/avif",
      "@jsquash/jpeg",
      "@jsquash/png",
      "@jsquash/webp",
    ]
  },
  plugins: [solidPlugin()],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
});
