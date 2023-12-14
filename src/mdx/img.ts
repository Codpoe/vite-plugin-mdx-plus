import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import type { MdxjsEsm } from 'mdast-util-mdxjs-esm';
import type { MdxJsxAttribute, MdxJsxFlowElement } from 'mdast-util-mdx-jsx';

function isRelativeUrl(url: string) {
  return typeof url === 'string' && /^\.\.?\//.test(url);
}

/**
 * Remark plugin to support relative img
 */
export const remarkImg: Plugin = () => (tree: any) => {
  const imports: Omit<MdxjsEsm, 'value'>[] = [];

  visit(tree, (node, index, parent) => {
    // Only handle image
    if (
      node.type !== 'image' &&
      node.type !== 'mdxJsxFlowElement' &&
      node.name !== 'img'
    ) {
      return;
    }

    const src: string =
      node.url ||
      node.attributes?.find((attr: any) => attr.name === 'src')?.value;

    // Only handle relative image url
    if (!isRelativeUrl(src)) {
      return;
    }

    const importedName = `__relative_img_${imports.length}`;

    // push `import __relative_img_x from '../relative-to-img'`
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
                  type: 'ImportDefaultSpecifier',
                  local: {
                    type: 'Identifier',
                    name: importedName,
                  },
                },
              ],
              source: {
                type: 'Literal',
                value: src,
                raw: JSON.stringify(src),
              },
            },
          ],
        },
      },
    });

    const srcAttr: MdxJsxAttribute = {
      type: 'mdxJsxAttribute',
      name: 'src',
      value: {
        type: 'mdxJsxAttributeValueExpression',
        value: importedName,
        data: {
          estree: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'Identifier',
                  name: importedName,
                },
              },
            ],
            sourceType: 'module',
          },
        },
      },
    };

    // jsx syntax: <img src="./xxx" />
    if (node.type === 'mdxJsxFlowElement') {
      node.attributes = [
        srcAttr,
        ...node.attributes.filter((attr: any) => attr.name !== 'src'),
      ];
      return;
    }

    // markdown syntax: ![](./xxx)
    // replace with jsx img element
    const imgAttrs: MdxJsxAttribute[] = [srcAttr];

    if (node.alt) {
      imgAttrs.push({
        type: 'mdxJsxAttribute',
        name: 'alt',
        value: node.alt,
      });
    }

    if (node.title) {
      imgAttrs.push({
        type: 'mdxJsxAttribute',
        name: 'title',
        value: node.title,
      });
    }

    const imgNode: MdxJsxFlowElement = {
      type: 'mdxJsxFlowElement',
      name: 'img',
      attributes: imgAttrs,
      children: [],
    };

    parent.children[index!] = imgNode;
  });

  tree.children?.unshift(...imports);
};
