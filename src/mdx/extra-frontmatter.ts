import { execSync } from 'child_process';
import type { Plugin } from 'unified';

/**
 * Remark plugin to add extra frontmatter
 */
export const remarkExtraFrontmatter: Plugin = () => (tree: any, file) => {
  const commitTime = getFileCommitTime(file.path);

  if (!commitTime) {
    return;
  }

  const frontmatterNode = tree.children.find(
    (child: any) => ['yaml', 'toml'].includes(child.type) && child.value,
  );

  if (!frontmatterNode) {
    tree.children?.unshift({
      type: 'yaml',
      value: `commitTime: ${commitTime}`,
    });
    return;
  }

  const { type, value } = frontmatterNode;

  if (type === 'yaml' && !/^commitTime:/gm.test(value)) {
    frontmatterNode.value = `commitTime: ${commitTime}\n${frontmatterNode.value}`;
  }

  if (type === 'toml' && !/^commitTime\s*=/gm.test(value)) {
    frontmatterNode.value = `commitTime = ${commitTime}\n${frontmatterNode.value}`;
  }
};

const fileToCommitTimeMap: Record<string, string> = {};

function getFileCommitTime(filePath: string): string | undefined {
  if (fileToCommitTimeMap[filePath]) {
    return fileToCommitTimeMap[filePath];
  }

  try {
    const commitTime = execSync(
      `git log -n 1 --pretty=format:"%at" -- "${filePath}"`,
      { encoding: 'utf-8', stdio: 'pipe' },
    );
    return (fileToCommitTimeMap[filePath] = commitTime);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('You are not inside a Git repository.', error);
  }
}
