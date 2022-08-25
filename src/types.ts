import { Options as MdxOptions } from '@mdx-js/rollup';
import { Options as GfmOptions } from 'remark-gfm';
import { Options as frontmatterOptions } from 'remark-frontmatter';
import { Options as autolinkHeadingsOptions } from 'rehype-autolink-headings';
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
  frontmatter?: frontmatterOptions;
  /**
   * @see https://github.com/rehypejs/rehype-autolink-headings
   */
  autolinkHeadings?: autolinkHeadingsOptions;
  theme?: Theme | ShikiThemeObj;
  transformCodeDemo?: (code: string) => string;
}
