import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { mdxDoc } from 'vite-plugin-mdx-pro';

// https://vitejs.dev/config/
export default defineConfig({
  // optimizeDeps: {
  //   include: ['@mdx-js/react'],
  // },
  plugins: [react(), mdxDoc()],
});
