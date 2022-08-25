/// <reference types="vite/client" />

declare module '*.mdx' {
  import { ComponentType } from 'react';
  const Markdown: ComponentType<any>;
  export default Markdown;
}
