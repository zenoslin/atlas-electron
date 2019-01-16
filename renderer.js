const {
    ipcRenderer
} = require('electron')
const {
    editJson,
    atlas,
    json2pd
} = require('./src/atlas')

const inputBtn = document.getElementById('input-btn')
const outputBtn = document.getElementById('output-btn')
const inputPath = document.getElementById('input-path')
const outputPath = document.getElementById('output-path')
const tinyBtn = document.getElementById('tiny-btn')
const logSpan = document.getElementById('log-span')

let _inputPath = "/Users/linze/Documents/GitHub/atlas-electron/assets/comp"
let _outputPath = "/Users/linze/Documents/GitHub/atlas-electron/bin"
let jsonPath = __dirname + "/lib/atlasConfig"

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
})

ipcRenderer.on('output-path', (event, path) => {
    console.log(`收到完成信息 ${path}`)
    _outputPath = path
    outputPath.value = `${path}`
})

tinyBtn.addEventListener('click', (event) => {
    _inputPath = inputPath.value
    _outputPath = outputPath.value
    logSpan.innerHTML = "正在打包"
    editJson(jsonPath, "inputDir", _inputPath)
    editJson(jsonPath, "outputDir", _outputPath)
    editJson(jsonPath, "resDir", _outputPath + "/img")
    atlas(false, function () {
        logSpan.innerHTML = "打包完成"
        alert('打包完成')
        // let fileName = _inputPath.substr(_inputPath.lastIndexOf("/") + 1)
        // json2pd(_outputPath + "/" + fileName + ".atlas", () => {
        //     logSpan.innerHTML = "打包完成"
        //     alert('打包完成')
        // })
    })
})

//Js拖入文件
const holder = document.getElementById("holder")

holder.ondragenter = holder.ondragover = (event) => {
    event.preventDefault()
    holder.className = "jumbotron holder-ondrag"
}

holder.ondragleave = (event) => {
    event.preventDefault()
    holder.className = "jumbotron holder"
}

holder.ondrop = (event) => {
    // 调用 preventDefault() 来避免浏览器对数据的默认处理
    //（drop 事件的默认行为是以链接形式打开） 
    event.preventDefault()
    holder.className = "jumbotron holder"
    var file = event.dataTransfer.files[0]
    _inputPath = inputPath.value = file.path
    console.log(_inputPath)
}