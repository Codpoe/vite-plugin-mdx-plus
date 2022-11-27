// mdx demo
export const MDX_DEMO_RE = /<Demo\s+src=["'](.*?)["']/;
export const DEMO_MODULE_ID_PREFIX = 'virtual:mdx-plus/demo/';
export const RESOLVED_DEMO_MODULE_ID_PREFIX = '\0' + DEMO_MODULE_ID_PREFIX;

// mdx code demo
export const CODE_DEMO_MODULE_ID_PREFIX = 'virtual:mdx-plus/code-demo/';
export const RESOLVED_CODE_DEMO_MODULE_ID_PREFIX =
  '\0' + CODE_DEMO_MODULE_ID_PREFIX;

// mdx tsInfo
export const MDX_TS_INFO_RE =
  /<TsInfo\s+src=["'](.*?)["']\s+name=["'](.*?)["']/;
export const TS_INFO_MODULE_ID_PREFIX = 'virtual:mdx-plus/ts-info/';
export const RESOLVED_TS_INFO_MODULE_ID_PREFIX =
  '\0' + TS_INFO_MODULE_ID_PREFIX;
