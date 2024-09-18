import { MDXProvider } from '@mdx-js/react';
import { Callout } from './Callout';
import 'vite-plugin-mdx-plus/style.css';

export function MarkdownRenderer({ children }: { children: React.ReactNode }) {
  return (
    <MDXProvider components={{ Callout }}>
      <div className="prose dark:prose-invert">{children}</div>
    </MDXProvider>
  );
}
