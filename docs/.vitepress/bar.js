const fs = require("fs");
const path = require("path");

const docDir = path.join(__dirname, "../").slice(0, -1);

function parseDirs(basePath) {
  const dirents = fs.readdirSync(basePath, {
    withFileTypes: true
  });
  const dirs = [];
  const files = [];
  let startPage = false;
  for (const dirent of dirents) {
    const {
      name
    } = dirent;
    if (name[0] === ".") continue;
    if (name === 'index.md') {
      startPage = true;
      continue;
    }
    if (dirent.isDirectory()) dirs.push(name);
    if (dirent.isFile()) files.push(name);
  }
  return {
    startPage,
    dirs,
    files,
  }
}

function formatFile(file) {
  return file.slice(0, -3);
}

function getNav(options = {}) {
  const {
    dirs,
  } = parseDirs(docDir);
  return dirs.map((dir) => {
    const {
      startPage
    } = parseDirs(`${docDir}/${dir}`);
    return {
      text: dir,
      link: startPage ? `/${dir}/` : undefined,
      activeMatch: `^/${dir}`,
    }
  })
}

function parseSidebar(basePath) {
  const {
    dirs,
    files,
  } = parseDirs(basePath);
  return dirs.map((dir) => {
    const {
      startPage
    } = parseDirs(`${basePath}/${dir}`);
    return {
      text: dir,
      link: startPage ? `${basePath.slice(docDir.length)}/${dir}/` : undefined,
      children: parseSidebar(`${basePath}/${dir}`),
    };
  }).concat(files.map((file) => {
    const fileName = formatFile(file);
    return {
      text: fileName,
      link: `${basePath.slice(docDir.length)}/${fileName}`,
    };
  }));
}

function getSidebar(options = {}) {
  const {
    dirs
  } = parseDirs(docDir);
  const sidebar = {};
  for (const dir of dirs) {
    sidebar[`/${dir}/`] = parseSidebar(`${docDir}/${dir}`);
  }
  return sidebar;
}

module.exports = {
  getNav,
  getSidebar,
};