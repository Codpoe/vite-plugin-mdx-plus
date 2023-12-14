# vite-plugin-mdx-plus

A vite plugin to use mdx with more opinionated features. It's plus!

> I have only tested/used this plugin in vite v5, the compatibility with other versions of vite is unknown.

## Features

- GFM ([remark-gfm](https://github.com/remarkjs/remark-gfm))
- Code highlight ([shiki](https://github.com/shikijs/shiki))
- Export `fontmatter` ([remark-frontmatter](https://github.com/remarkjs/remark-frontmatter), [remark-mdx-frontmatter](https://github.com/remcohaszing/remark-mdx-frontmatter))
- Export content structure `toc` according to headings
- Callout block ([remark-directive](https://github.com/remarkjs/remark-directive))
- Transform code block to React component

## Install

```sh
npm install vite-plugin-mdx-plus
```

## Use

`vite.config.ts`

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { mdxPlus } from 'vite-plugin-mdx-plus';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    mdxPlus(),
    react({ include: /\.([tj]s|md)x?$/ }),
  ],
});
```
