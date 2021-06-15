const fs = require("fs");
const path = require("path");

const docDir = path.join(__dirname, "../");


function formatDirs(dirs) {
  if (!Array.isArray(dirs)) throw new Error("dirs is not array");
  return dirs.filter((val) => {
    return val !== "index.md" && val[0] !== ".";
  });
}


function titleCase(title) {
  title = title.trim();
  return `${title.charAt(0).toUpperCase()}${title.slice(1)}`;
}


function absDir2Rel(absDir) {
  const stat = fs.lstatSync(absDir);
  if (stat.isDirectory(absDir)) {
    const relPath = path.relative(docDir, absDir);
    return `${relPath}/`;
  }

  const { dir, name } = path.parse(absDir);
  const relPath = path.relative(docDir, dir);
  return `${relPath}/${name}`;
}


function parseAbsChildDir(childDir, options) {
  const isTitleCase = options.isTitleCase !== false;

  const childDirs = fs.readdirSync(childDir);
  const isHaveHome = childDirs.includes("index.md");
  const dirs = formatDirs(childDirs);

  const { name: childName } = path.parse(childDir);

  const sidebar = {
    text: isTitleCase ? titleCase(childName): childName,
    link: isHaveHome ? absDir2Rel(childDir) : undefined,
    children: [],
  };

  for (const dir of dirs) {
    const absChildDir = path.join(childDir, dir);
    const stat = fs.lstatSync(absChildDir);
    if (stat.isDirectory()) {
      sidebar.children.push(parseAbsChildDir(absChildDir));
    } else {
      const { name } = path.parse(absChildDir);
      sidebar.children.push({
        text: name,
        link: absDir2Rel(absChildDir),
      });
    }
  }
  return sidebar;
}


function parseRootDir(dir = "/", options) {
  const isTitleCase = options.isTitleCase !== false;

  const absRootDir = path.join(docDir, dir);
  const dirs = formatDirs(fs.readdirSync(absRootDir));

  const rootChildren = [];
  for (const dir of dirs) {
    const absChildDir = path.join(absRootDir, dir);

    const stat = fs.lstatSync(absChildDir);
    const { name } = path.parse(absChildDir);
    if (stat.isDirectory()) {
      rootChildren.push(parseAbsChildDir(absChildDir, options));
    } else {
      rootChildren.push({
        text: isTitleCase ? titleCase(name): name,
        link: absDir2Rel(absChildDir),
      });
    }
  }

  return rootChildren;
}


function parseDir(options = {}) {
  const isTitleCase = options.isTitleCase !== false;

  const dirs = formatDirs(fs.readdirSync(docDir));
  const res = {
    nav: [],
    sidebar: {},
  };

  for (const dir of dirs) {
    res.nav.push({
      text: isTitleCase ? titleCase(dir): dir,
      link: `/${dir}/`,
    });
    res.sidebar[`/${dir}/`] = parseRootDir(`/${dir}/`, options)
  }
  res.sidebar[`/`] = parseRootDir('/', options);
  return res;
}


module.exports = {
  parseDir,
};
