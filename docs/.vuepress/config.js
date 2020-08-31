const nav = require('./nav');
const sidebar = require('./sidebar');


module.exports = {
    title: '工欲善其事 必先利其器',
    base:"/blog/",

    description: 'Just playing around',
    themeConfig: {
        sidebarDepth:2,
        nav,
        sidebar,
        lastUpdated:"最后更新时间",
        docsDir:'docs',
        repo:"https://miguoer.github.io/blog"
      },
      extraWatchFiles:[
          "./nav.js",
          "./sidebar.js"

      ],
      markdown: {
        lineNumbers: true
      }
  }