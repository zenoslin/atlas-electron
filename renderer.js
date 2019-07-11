const { ipcRenderer } = require("electron");
const { atlas } = require("./src/atlas");
const {
  copyFile,
  checkDirectory,
  removeFileSync
} = require("./src/copyFile.js");
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

tinyBtn.addEventListener("click", async event => {
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
  let tempFolder = `${__dirname}/temp`;
  let cmd = `"${__dirname}/lib/atlas-generator" -S 2048 -s 512 ${__dirname}/temp -o ${_outputPath} --dataFormat json --scale 1 --force`;
  await checkDirectory(tempFolder);
  copyFile(_inputPath, tempFolder).then(() => {
    atlas(cmd)
      .then(res => {
        removeFileSync(tempFolder);
        console.log(res);
        alert("打包完成");
        logSpan.innerHTML = "点击开始";
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
