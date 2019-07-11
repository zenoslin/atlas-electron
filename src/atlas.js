const childProcess = require("child_process");
const path = require("path");
const fs = require("fs");
const Byte = require("./Byte");

function atlas(cmd) {
  return new Promise((resolve, reject) => {
    if (!cmd) {
      cmd =
        path.resolve(__dirname, "..") +
        "/lib/atlas-generator" +
        " --config " +
        path.resolve(__dirname, "..") +
        "/lib/atlasConfig";
    }
    childProcess.exec(
      cmd,
      {
        encoding: "binary",
        maxBuffer: 1024 * 1024 * 20
      },
      (err, stdOut, stdErr) => {
        if (err) reject(err, stdErr);
        resolve(stdOut);
      }
    );
  });
}

function editJson(path, key, value) {
  return new Promise((resolve, reject) => {
    let data = fs.readFileSync(path, { encoding: "utf8" });
    let configData = data.toString(); //将二进制的数据转换为字符串
    configData = JSON.parse(configData); //将字符串转换为json对象
    if (typeof value == "object") {
      configData[key] = value[0];
    } else {
      configData[key] = value;
    }
    let str = JSON.stringify(configData); //因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中
    fs.writeFileSync(path, str, { encoding: "binary" });
    resolve(`修改成功${str}`);
  });
}

function json2pd(path) {
  return new Promise((resolve, reject) => {
    let data = fs.readFileSync(path, { encoding: "utf8" });
    let configData = data.toString(); //将二进制的数据转换为字符串
    configData = JSON.parse(configData); //将字符串转换为json对象
    let count = 0;
    for (let s in configData.frames) {
      count++;
    }
    let totalData = new Byte();
    totalData.writeInt32(count);
    for (var k in configData.frames) {
      var p = configData.frames[k];
      totalData.writeUTFString(k);
      totalData.writeInt16(p.frame["x"]);
      totalData.writeInt16(p.frame["y"]);
      totalData.writeInt16(p.frame["w"]);
      totalData.writeInt16(p.frame["h"]);
    }
    let arr = new Uint8Array(totalData.buffer);
    let pdPath = path.replace(".atlas", ".pd");
    fs.writeFileSync(pdPath, arr, { encoding: "binary" });
    fs.unlink(path, err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

module.exports = {
  atlas,
  editJson,
  json2pd
};
