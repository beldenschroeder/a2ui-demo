import { defineConfig } from 'vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'A2UIDemoCatalog',
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@a2ui/react',
        '@a2ui/react/v0_9',
        '@a2ui/web_core',
        '@a2ui/web_core/v0_9',
        '@a2ui-demo/button',
        '@a2ui-demo/card',
        '@a2ui-demo/text',
        '@a2ui-demo/text-input',
        'zod',
      ],
    },
    sourcemap: true,
  },
  test: { environment: 'happy-dom', globals: true },
});
