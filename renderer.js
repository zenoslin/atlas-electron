const {ipcRenderer} = require('electron')
const {editJson,atlas} = require('./src/atlas')

const inputBtn = document.getElementById('input-btn')
const outputBtn = document.getElementById('output-btn')
const inputPath = document.getElementById('input-path')
const outputPath = document.getElementById('output-path')
const tinyBtn = document.getElementById('tiny-btn')
const logSpan = document.getElementById('log-span')

let _inputPath = "/Users/zenoslin/Documents/GitHub/atlas-electron/assets"
let _outputPath = "/Users/zenoslin/Documents/GitHub/atlas-electron/bin"
let jsonPath = __dirname + "/lib/atlasConfig.json"

inputPath.value = _inputPath
outputPath.value = _outputPath

inputBtn.addEventListener('click', (event) => {
    console.log('点击输入按钮')
    ipcRenderer.send('open-file-dialog-input')
})

outputBtn.addEventListener('click', (event) => {
    console.log('点击输出按钮')
    ipcRenderer.send('open-file-dialog-output')
})

ipcRenderer.on('input-path', (event, path) => {
    console.log(`收到完成信息 ${path}`)
    _inputPath = path
    inputPath.value = `${path}`
    editJson(jsonPath, "inputDir", path)
})

ipcRenderer.on('output-path', (event, path) => {
    console.log(`收到完成信息 ${path}`)
    _outputPath = path
    outputPath.value = `${path}`
    editJson(jsonPath, "outputDir", path)
    editJson(jsonPath, "resDir", path + "/img")

})

tinyBtn.addEventListener('click', (event) => {
    _inputPath = inputPath.value
    _outputPath = outputPath.value
    logSpan.innerHTML = "正在打包"
    atlas(false, function() {
        logSpan.innerHTML = "打包完成"
    })
})