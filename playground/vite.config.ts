import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { mdxPlus } from 'vite-plugin-mdx-plus';

// https://vitejs.dev/config/
export default defineConfig({
  // optimizeDeps: {
  //   include: ['@mdx-js/react'],
  // },
  plugins: [react(), mdxPlus()],
});
