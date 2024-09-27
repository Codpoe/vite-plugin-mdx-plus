import { PluginOption } from 'vite';
import { defu } from 'defu';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import remarkDirective from 'remark-directive';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeShiki, { RehypeShikiOptions } from '@shikijs/rehype';
import {
  transformerNotationDiff,
  transformerMetaHighlight,
  transformerNotationHighlight,
  transformerNotationFocus,
} from '@shikijs/transformers';
import { UserOptions } from './types.js';
import { remarkCallout } from './mdx/callout.js';
import { remarkMdxToc } from './mdx/toc.js';
import { remarkImg } from './mdx/img.js';
import { remarkExtraFrontmatter } from './mdx/extra-frontmatter.js';

export function mdxPlus(userOptions: UserOptions = {}): PluginOption {
  const shikiOptions = defu<RehypeShikiOptions, RehypeShikiOptions[]>(
    userOptions.shiki,
    {
      themes: { light: 'min-light', dark: 'plastic' },
      transformers: [
        transformerNotationDiff(),
        transformerNotationHighlight(),
        transformerMetaHighlight(),
        transformerNotationFocus(),
      ],
    },
  );

  const options = defu<UserOptions, UserOptions[]>(userOptions, {
    mdxExtensions: ['.md', '.mdx'],
    format: 'mdx',
    providerImportSource: '@mdx-js/react',
    remarkPlugins: [
      [remarkGfm, userOptions.gfm],
      [remarkFrontmatter, userOptions.frontmatter],
      // `extraFrontmatter` needs to be placed between `frontmatter` and `mdxFrontmatter`
      remarkExtraFrontmatter,
      [remarkMdxFrontmatter, userOptions.mdxFrontmatter],
      remarkDirective,
      remarkCallout,
      remarkMdxToc,
      remarkImg,
    ],
    rehypePlugins: [rehypeSlug, [rehypeShiki, shikiOptions]],
  });

  if (options.autolinkHeadings) {
    options.rehypePlugins!.push([
      rehypeAutolinkHeadings,
      options.autolinkHeadings,
    ]);
  }

  const mdxPlugin = mdx(options);

  return [
    {
      ...mdxPlugin,
      enforce: 'pre',
      transform: {
        order: 'pre',
        handler(code, id) {
          const [path] = id.split('?');

          if (path.endsWith('.md') || path.endsWith('.mdx')) {
            return mdxPlugin.transform.call(this, code, path);
          }
        },
      },
    },
  ];
}
