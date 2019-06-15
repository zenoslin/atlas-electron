const { ipcRenderer } = require("electron");
const { editJson, atlas, json2pd } = require("./src/atlas");
const os = require("os");

const inputBtn = document.getElementById("input-btn");
const outputBtn = document.getElementById("output-btn");
const inputPath = document.getElementById("input-path");
const outputPath = document.getElementById("output-path");
const tinyBtn = document.getElementById("tiny-btn");
const logSpan = document.getElementById("log-span");
const devBtn = document.getElementById("dev-btn");

let desktopPath = `${os.homedir()}/Desktop`;
let _inputPath = window.localStorage.inputPath
  ? window.localStorage.inputPath
  : desktopPath;
let _outputPath = window.localStorage.outputPath
  ? window.localStorage.outputPath
  : desktopPath;
let jsonPath = `${__dirname}/lib/atlasConfig`;

inputPath.value = _inputPath;
outputPath.value = _outputPath;

inputBtn.addEventListener("click", event => {
  ipcRenderer.send("open-file-dialog-input");
});

outputBtn.addEventListener("click", event => {
  ipcRenderer.send("open-file-dialog-output");
});

devBtn.addEventListener("click", event => {
  ipcRenderer.send("open-dev-tool");
});

ipcRenderer.on("input-path", (event, path) => {
  console.log(`收到完成信息 ${path}`);
  _inputPath = path;
  inputPath.value = `${path}`;
});

ipcRenderer.on("output-path", (event, path) => {
  console.log(`收到完成信息 ${path}`);
  _outputPath = path;
  outputPath.value = `${path}`;
});

tinyBtn.addEventListener("click", event => {
  _inputPath = inputPath.value;
  _outputPath = outputPath.value;
  if (hasChinese(_inputPath) || hasChinese(_outputPath)) {
    alert("不可有中文路径");
    return;
  }
  if (window.localStorage) {
    window.localStorage.inputPath = _inputPath;
    window.localStorage.outputPath = _outputPath;
  }
  logSpan.innerHTML = "正在打包";
  Promise.all([
    editJson(jsonPath, "inputDir", _inputPath),
    editJson(jsonPath, "outputDir", _outputPath),
    editJson(jsonPath, "resDir", _outputPath + "/img")
  ]).then(() => {
    atlas(false)
      .then(res => {
        console.log(res);
        let fileName = _inputPath.substr(_inputPath.lastIndexOf("/") + 1);
        json2pd(_outputPath + "/" + fileName + ".atlas")
          .then(() => {
            logSpan.innerHTML = "打包完成";
            alert("打包完成");
          })
          .catch(err => {
            alert(err);
          });
      })
      .catch(err => {
        alert(err);
      });
  });
});

//Js拖入文件
const holder = document.getElementById("holder");

holder.ondragenter = holder.ondragover = event => {
  event.preventDefault();
  holder.className = "jumbotron holder-ondrag";
};

holder.ondragleave = event => {
  event.preventDefault();
  holder.className = "jumbotron holder";
};

holder.ondrop = event => {
  // 调用 preventDefault() 来避免浏览器对数据的默认处理
  //（drop 事件的默认行为是以链接形式打开）
  event.preventDefault();
  holder.className = "jumbotron holder";
  let file = event.dataTransfer.files[0];
  _inputPath = inputPath.value = file.path;
};

function hasChinese(message) {
  let reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
  return reg.test(message);
}
