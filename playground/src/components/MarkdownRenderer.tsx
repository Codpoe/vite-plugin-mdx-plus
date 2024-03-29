import { MDXProvider } from '@mdx-js/react';
import { Callout } from './Callout';
import { Demo } from './Demo';

export function MarkdownRenderer({ children }: { children: React.ReactNode }) {
  return (
    <MDXProvider components={{ Callout, Demo }}>
      <div className="prose prose-pre:bg-gray-50">{children}</div>
    </MDXProvider>
  );
}
