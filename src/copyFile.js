const fs = require("fs");
const path = require("path");

const copyFile = async function(src, dist) {
  let basePath = `${dist}/${path.basename(src)}`;
  try {
    fs.accessSync(basePath, fs.constants.F_OK);
  } catch (err) {
    fs.mkdirSync(basePath);
  }
  copyFileSync(src, basePath);
};

/**
 * @function 复制文件（同步）
 * 可以在.then做复制完成之后的操作
 * @example copyFileSync(src, dist).then(res=>{console.log('复制完成')})
 *
 * @param {string} src
 * @param {string} dist
 *
 * @return {Promise}
 */
const copyFileSync = async function(src, dist) {
  return new Promise(async (resolve, reject) => {
    let start = new Date().getTime();
    await checkDirectory(dist);
    await copySync(src, dist);
    let res = { src: src, time: new Date().getTime() - start };
    resolve(res);
  });
};

const checkDirectory = function(dist) {
  return new Promise((resolve, reject) => {
    fs.access(dist, fs.constants.F_OK, err => {
      if (err) {
        fs.mkdirSync(dist);
      }
      resolve();
    });
  });
};

const copySync = async function(src, dist) {
  let paths = fs.readdirSync(src);
  for (const path of paths) {
    let _src = src + "/" + path;
    let _dist = dist + "/" + path;
    let _stats = fs.statSync(_src);
    if (_stats.isFile()) {
      let readable = fs.createReadStream(_src);
      let writable = fs.createWriteStream(_dist);
      readable.pipe(writable);
    } else if (_stats.isDirectory()) {
      await checkDirectory(_dist);
      await copySync(_src, _dist);
    }
  }
};

/**
 * @function removeFileSync 同步删除（广度模式）
 * 
 * @param {string} $path 目标文件（文件夹）
 * 
 * @return {Promise}
 */
const removeFileSync = $path => {
  return new Promise((resolve, reject) => {
    let arr = [$path];
    let current = null;
    let index = 0;

    while ((current = arr[index++])) {
      let stat = fs.statSync(current);
      if (stat.isDirectory()) {
        let files = fs.readdirSync(current);
        arr = [...arr, ...files.map(file => path.join(current, file))];
      }
    }
    for (var i = arr.length - 1; i >= 0; i--) {
      let stat = fs.statSync(arr[i]);
      if (stat.isDirectory()) {
        fs.rmdirSync(arr[i]);
      } else {
        fs.unlinkSync(arr[i]);
      }
    }
    resolve($path);
  });
};

module.exports = {
  copyFile,
  checkDirectory,
  removeFileSync
};
