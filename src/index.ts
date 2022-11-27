import { Plugin } from 'vite';
import { defu } from 'defu';
import mdx from '@mdx-js/rollup';
import { createFilter } from '@rollup/pluginutils';
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
  RESOLVED_CODE_DEMO_MODULE_ID_PREFIX,
  RESOLVED_DEMO_MODULE_ID_PREFIX,
} from './constants.js';
import { loadDemo, remarkMdxDemo } from './mdx/demo.js';
import { loadCodeDemo, remarkMdxCodeDemo } from './mdx/code.js';
import { remarkCallout } from './mdx/callout.js';
import { remarkMdxToc } from './mdx/toc.js';
import { rehypeHighlight } from './mdx/highlight.js';

export function mdxPlus(userOptions: UserOptions = {}): Plugin[] {
  const options = defu<UserOptions, UserOptions[]>(userOptions, {
    mdxExtensions: ['.md', '.mdx'],
    format: 'mdx',
    providerImportSource: '@mdx-js/react',
    remarkPlugins: [
      [remarkGfm, userOptions.gfm],
      [remarkFrontmatter, userOptions.frontmatter],
      [remarkMdxFrontmatter, { name: 'meta' }],
      remarkDirective,
      remarkMdxCodeDemo,
      remarkMdxDemo,
      remarkCallout,
      remarkMdxToc,
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
    mdx(options),
    mdxRefresh(options),
    mdxDemo(options),
    mdxCodeDemo(options),
  ];
}

function mdxRefresh({
  include,
  exclude,
}: Pick<UserOptions, 'include' | 'exclude'>): Plugin {
  const filter = createFilter(include, exclude);
  let viteReactPlugin: Plugin | undefined;

  return {
    name: 'mdx-plus:refresh',
    configResolved(config) {
      viteReactPlugin = config.plugins.find(p => p.name === 'vite:react-babel');
    },
    async transform(code, id, opts) {
      if (
        filter(id) &&
        /\.mdx?$/.test(id) &&
        typeof viteReactPlugin?.transform === 'function'
      ) {
        // use vite react plugin to inject react refresh code into markdown
        const result = await viteReactPlugin.transform.call(
          this,
          code,
          id + '?.jsx',
          opts
        );

        // handle markdown hmr
        if (typeof result === 'object' && result?.code) {
          result.code = ['meta', 'toc'].reduce(
            (code, field) => addHmrAccept(code, field),
            result.code
          );
        }

        return result;
      }
    },
  };
}

function mdxDemo(options: Pick<UserOptions, 'theme'>): Plugin {
  return {
    name: `mdx-plus:demo`,
    resolveId(source) {
      // resolve demo. fulfill demo file path
      if (source.startsWith(DEMO_MODULE_ID_PREFIX)) {
        return '\0' + source;
      }
    },
    load(id) {
      if (id.startsWith(RESOLVED_DEMO_MODULE_ID_PREFIX)) {
        id = id.slice('\0'.length).split('?')[0];
        return loadDemo.call(this, id, options);
      }
    },
  };
}

function mdxCodeDemo(
  options: Pick<UserOptions, 'transformCodeDemo' | 'theme'>
): Plugin {
  return {
    name: `mdx-plus:code-demo`,
    resolveId(source) {
      if (source.startsWith(CODE_DEMO_MODULE_ID_PREFIX)) {
        return '\0' + source;
      }
    },
    load(id) {
      if (id.startsWith(RESOLVED_CODE_DEMO_MODULE_ID_PREFIX)) {
        // clean query string
        id = id.slice('\0'.length).split('?')[0];
        return loadCodeDemo(id, options);
      }
    },
  };
}

function addHmrAccept(code: string, field: string) {
  if (
    !code.includes('import.meta.hot.accept()') &&
    (new RegExp(`export\\s+const\\s+${field}(\\s|=|:)`).test(code) ||
      new RegExp(`export\\s+(async\\s+)?function\\s+${field}(\\s|\\()`).test(
        code
      ))
  ) {
    return `${code}\n
if (import.meta.hot) {
  const prevField = import.meta.hot.data.${field} = import.meta.hot.data.${field} || ${field};

  import.meta.hot.accept(mod => {
    if (mod) {
      const field = mod.${field};
      if (field?.toString() !== prevField?.toString() || JSON.stringify(field) !== JSON.stringify(prevField)) {
        import.meta.hot.invalidate();
      }
    }
  });
}
`;
  }

  return code;
}
