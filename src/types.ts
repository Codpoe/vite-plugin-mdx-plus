import type { Options as MdxOptions } from '@mdx-js/rollup';
import type { Options as GfmOptions } from 'remark-gfm';
import type { Options as FrontmatterOptions } from 'remark-frontmatter';
import type { RemarkMdxFrontmatterOptions } from 'remark-mdx-frontmatter';
import type { Options as AutolinkHeadingsOptions } from 'rehype-autolink-headings';
import { Theme } from 'shiki';

export interface ShikiThemeObj {
  light: Theme;
  dark: Theme;
}

export interface UserOptions extends MdxOptions {
  /**
   * @see https://github.com/remarkjs/remark-gfm
   */
  gfm?: GfmOptions;
  /**
   * @see https://github.com/remarkjs/remark-frontmatter
   */
  frontmatter?: FrontmatterOptions;
  /**
   * @see https://github.com/remcohaszing/remark-mdx-frontmatter
   */
  mdxFrontmatter?: RemarkMdxFrontmatterOptions;
  /**
   * @see https://github.com/rehypejs/rehype-autolink-headings
   */
  autolinkHeadings?: AutolinkHeadingsOptions;
  theme?: Theme | ShikiThemeObj;
  transformCodeDemo?: (code: string) => string;
}
