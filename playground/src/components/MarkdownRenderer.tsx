import { MDXProvider } from '@mdx-js/react';
import { Callout } from './Callout';

export function MarkdownRenderer({ children }: { children: React.ReactNode }) {
  return (
    <MDXProvider components={{ Callout }}>
      <div className="prose">{children}</div>
    </MDXProvider>
  );
}
