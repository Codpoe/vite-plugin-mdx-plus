/**
 * Inspired by vite-plugin-react-pages
 */
import path from 'upath';
import fs from 'fs-extra';
import type { PluginContext } from 'rollup';
import type { Plugin } from 'unified';
import type { MdxJsxFlowElement } from 'mdast-util-mdx-jsx';
import type { MdxjsEsm } from 'mdast-util-mdxjs-esm';
import { visit } from 'unist-util-visit';
import { DEMO_MODULE_ID_PREFIX } from '../constants.js';
import { UserOptions } from '../types.js';
import { getHighlighter, Highlighter } from './highlight.js';

const extToLangMap: Record<string, string> = {
  '.js': 'javascript',
  '.ts': 'typescript',
  '.jsx': 'jsx',
  '.tsx': 'tsx',
};

export function getDemoModuleId(filePath: string) {
  return `${DEMO_MODULE_ID_PREFIX}${filePath}`;
}

export function extractDemoPath(id: string) {
  return path.join('/', id.slice(DEMO_MODULE_ID_PREFIX.length));
}

/**
 * Remark plugin to load demo.
 * Turn `<Demo src="./Button.tsx" />` to `<Demo code={code content}>code element</Demo>`
 */
export const remarkMdxDemo: Plugin = () => (tree, file: any) => {
  const imports: Omit<MdxjsEsm, 'value'>[] = [];
  const imported = new Map<string, string>();

  visit(tree, 'mdxJsxFlowElement', (node: MdxJsxFlowElement) => {
    if (node.name !== 'Demo') {
      return;
    }

    const srcIndex = node.attributes?.findIndex(
      attr =>
        attr.type === 'mdxJsxAttribute' &&
        attr.name === 'src' &&
        typeof attr.value === 'string',
    );

    let src = node.attributes[srcIndex]?.value as string | undefined;

    if (!src) {
      return;
    }

    // fulfill relative import
    if (/^\.{1,2}\//.test(src)) {
      src = path.join(file.dirname, src);
    }

    let name = imported.get(src);
    if (!name) {
      name = `__demo_${imported.size}`;
      imported.set(src, name);

      const sourceValue = getDemoModuleId(src);

      // push `import * as name from '/@pressify/demo/src'`
      imports.push({
        type: 'mdxjsEsm',
        data: {
          estree: {
            type: 'Program',
            sourceType: 'module',
            body: [
              {
                type: 'ImportDeclaration',
                specifiers: [
                  {
                    type: 'ImportNamespaceSpecifier',
                    local: {
                      type: 'Identifier',
                      name,
                    },
                  },
                ],
                source: {
                  type: 'Literal',
                  value: sourceValue,
                  raw: JSON.stringify(sourceValue),
                },
              },
            ],
          },
        },
      });
    }

    // remove src attribute
    // spread imported name
    // <Demo src="xx" /> -> <Demo {...name} />
    node.attributes.splice(srcIndex, 1, {
      type: 'mdxJsxExpressionAttribute',
      value: `...${name}`,
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'SpreadElement',
                    argument: {
                      type: 'Identifier',
                      name,
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    });

    /**
     * <Demo {...name} />
     * ↓↓↓
     * <Demo {...name}>
     *   <name.default />
     * </Demo>
     */
    node.children.push({
      type: 'mdxJsxFlowElement',
      name: `${name}.default`,
      attributes: [],
      children: [],
    });

    // return SKIP;
  });

  // add imports
  (tree as any).children.unshift(...imports);
};

let getHighlighterPromise: Promise<Highlighter> | null = null;

export async function loadDemo(
  this: PluginContext,
  id: string,
  options: Pick<UserOptions, 'theme'>,
): Promise<string> {
  if (!getHighlighterPromise) {
    getHighlighterPromise = getHighlighter(options.theme);
  }

  const { highlight, theme } = await getHighlighterPromise;

  const filePath = extractDemoPath(id);
  const resolvedId = await this.resolve(filePath);

  if (!resolvedId) {
    throw new Error(`Cannot resolve "${filePath}"`);
  }

  const code = (await fs.readFile(resolvedId.id, 'utf-8')).trim();
  const language: string | undefined = extToLangMap[path.extname(filePath)];

  let codeHtml: string;

  if (typeof theme === 'string') {
    codeHtml = highlight(code, language);
  } else {
    codeHtml =
      highlight(code, language, 'light') + highlight(code, language, 'dark');
  }

  return `
export * from '${filePath}';
export { default } from '${filePath}';

export const code = ${JSON.stringify(code)};
export const codeHtml = ${JSON.stringify(codeHtml)};
export const language = ${JSON.stringify(language)};
`;
}
