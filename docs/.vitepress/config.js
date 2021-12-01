const package = require('../../package.json');
const { getNav, getSidebar } = require('./bar');

module.exports = {
  title: package.name,
  description: package.description,
  base: `/${package.name}/`,
  themeConfig: {
    repo: package.repository,
    docsDir: 'docs',
    docsBranch: 'main',
    editLinks: true,
    editLinkText: 'Edit this page on GitHub',
    lastUpdated: 'Last Updated',
    nav: getNav(),
    sidebar: getSidebar(),
  }
};