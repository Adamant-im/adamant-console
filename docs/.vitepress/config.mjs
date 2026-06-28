import { defineConfig } from 'vitepress';
import fs from 'node:fs';

const apiSidebarPath = new URL(
  '../reference/api/typedoc-sidebar.json',
  import.meta.url,
);
const apiSidebar = fs.existsSync(apiSidebarPath)
  ? JSON.parse(fs.readFileSync(apiSidebarPath, 'utf8'))
  : [{ text: 'Generated API', link: '/reference/api/' }];

export default defineConfig({
  title: 'ADAMANT Console',
  description: 'CLI and JSON-RPC docs for ADAMANT Console',
  lang: 'en-US',
  cleanUrls: true,
  metaChunk: true,
  sitemap: {
    hostname: 'https://console.docs.adamant.im',
  },
  head: [['meta', { name: 'theme-color', content: '#1f7a64' }]],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'ADAMANT Console',
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Reference', link: '/reference/cli' },
      { text: 'GitHub', link: 'https://github.com/Adamant-im/adamant-console' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Installation', link: '/guide/installation' },
          { text: 'Configuration', link: '/guide/configuration' },
          { text: 'Security', link: '/guide/security' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'CLI', link: '/reference/cli' },
          {
            text: 'Transactions Query Language',
            link: '/reference/transactions-query-language',
          },
          {
            text: 'JSON Answer Formats',
            link: '/reference/json-answer-formats',
          },
          { text: 'JSON-RPC', link: '/reference/json-rpc' },
          { text: 'JS Wrappers', link: '/reference/js-library' },
          ...apiSidebar,
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Adamant-im/adamant-console' },
    ],
    footer: {
      message: 'Released under the GPL-3.0 License.',
      copyright: 'Copyright (c) ADAMANT community developers',
    },
    search: {
      provider: 'local',
    },
  },
});
