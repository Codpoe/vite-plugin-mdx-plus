import { Plugin } from 'vite';
import { defu } from 'defu';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import remarkDirective from 'remark-directive';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { UserOptions } from './types.js';
import {
  CODE_DEMO_MODULE_ID_PREFIX,
  DEMO_MODULE_ID_PREFIX,
} from './constants.js';
import { loadDemo, remarkMdxDemo } from './mdx/demo.js';
import { loadCodeDemo, remarkMdxCodeDemo } from './mdx/code.js';
import { remarkCallout } from './mdx/callout.js';
import { remarkMdxToc } from './mdx/toc.js';
import { rehypeHighlight } from './mdx/highlight.js';
import { remarkImg } from './mdx/img.js';

export function mdxPlus(userOptions: UserOptions = {}): Plugin[] {
  const options = defu<UserOptions, UserOptions[]>(userOptions, {
    mdxExtensions: ['.md', '.mdx'],
    format: 'mdx',
    providerImportSource: '@mdx-js/react',
    remarkPlugins: [
      [remarkGfm, userOptions.gfm],
      [remarkFrontmatter, userOptions.frontmatter],
      [remarkMdxFrontmatter, userOptions.mdxFrontmatter],
      remarkDirective,
      remarkMdxCodeDemo,
      remarkMdxDemo,
      remarkCallout,
      remarkMdxToc,
      remarkImg,
    ],
    rehypePlugins: [
      rehypeSlug,
      // [
      //   rehypeAutolinkHeadings,
      //   {
      //     properties: {
      //       class: 'header-anchor',
      //       ariaHidden: 'true',
      //       tabIndex: -1,
      //     },
      //     content: {
      //       type: 'text',
      //       value: '#',
      //     },
      //   },
      // ],
      [rehypeHighlight, { theme: userOptions.theme }],
    ],
  });

  if (options.autolinkHeadings) {
    options.rehypePlugins!.push([
      rehypeAutolinkHeadings,
      options.autolinkHeadings,
    ]);
  }

  return [
    { enforce: 'pre', ...mdx(options) },
    mdxDemo(options),
    mdxCodeDemo(options),
  ];
}

function mdxDemo(options: Pick<UserOptions, 'theme'>): Plugin {
  return {
    name: `mdx-plus:demo`,
    resolveId(source) {
      // resolve demo. fulfill demo file path
      if (source.startsWith(DEMO_MODULE_ID_PREFIX)) {
        return source;
      }
    },
    load(id) {
      if (id.startsWith(DEMO_MODULE_ID_PREFIX)) {
        id = id.split('?')[0];
        return loadDemo.call(this, id, options);
      }
    },
  };
}

function mdxCodeDemo(
  options: Pick<UserOptions, 'transformCodeDemo' | 'theme'>,
): Plugin {
  return {
    name: `mdx-plus:code-demo`,
    resolveId(source) {
      if (source.startsWith(CODE_DEMO_MODULE_ID_PREFIX)) {
        return source;
      }
    },
    load(id) {
      if (id.startsWith(CODE_DEMO_MODULE_ID_PREFIX)) {
        // clean query string
        id = id.split('?')[0];
        return loadCodeDemo(id, options);
      }
    },
  };
}
