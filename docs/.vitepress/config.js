const {
  parseDir,
} = require('./util');

module.exports = {
  title: 'Docs',
  description: 'My Docs',
  base: '/',
  themeConfig: {
    repo: 'chenkai0520/docs',
    docsDir: 'docs',
    editLinks: true,
    editLinkText: 'Edit this page on GitHub',
    lastUpdated: 'Last Updated',
    ...parseDir(),
  }
};