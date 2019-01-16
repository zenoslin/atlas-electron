const childProcess = require('child_process')
const path = require('path')
const fs = require('fs')
const Byte = require('./Byte')

function atlas(cmd, callback) {
    if (!cmd) {
        cmd = path.resolve(__dirname, '..') + "/lib/atlasGenerator" + " --config " + path.resolve(__dirname, '..') + "/lib/atlasConfig"
    }
    childProcess.exec(cmd, {
        encoding: "binary",
        maxBuffer: 1024 * 1024 * 20
    }, (err, stdOut, stdErr) => {
        console.log(err + stdErr)
        console.log(stdOut)
        callback()
    })
}

function editJson(path, key, value, callback) {
    fs.readFile(path, function (err, data) {
        if (err) {
            // console.error(err)
            alert(err)
        }
        let person = data.toString() //将二进制的数据转换为字符串
        person = JSON.parse(person) //将字符串转换为json对象
        if (typeof value == "object") {
            person[key] = value[0]
        } else {
            person[key] = value
        }
        let str = JSON.stringify(person) //因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中
        fs.writeFile(path, str, function (err) {
            if (err) {
                // console.error(err)
                alert(err)
            }
            console.log('修改成功')
            console.log(person)
        })
    })
    if (callback) {
        callback()
    }
}

function json2pd(path, callback) {
    fs.readFile(path, (err, data) => {
        if (err) {
            // console.error(err)
            alert(err)
        }
        let person = data.toString() //将二进制的数据转换为字符串
        person = JSON.parse(person) //将字符串转换为json对象
        let count = 0
        for (let s in person.frames) {
            count++
        }
        let totalData = new Byte()
        totalData.writeInt32(count)
        for (var k in Object.frames) {
            var p = obj.frames[k]
            totalData.writeUTFString(k)
            totalData.writeInt16(p.frames["x"])
            totalData.writeInt16(p.frames["y"])
            totalData.writeInt16(p.frames["w"])
            totalData.writeInt16(p.frames["h"])
        }
        let arr = new Uint8Array(totalData.buffer)
        console.log(arr)
        let pdPath = path.replace(".atlas", ".pd")
        fs.writeFile(pdPath, arr, {
            encoding: "binary"
        }, (err) => {
            if (err) {
                // console.error(err)
                alert(err)
            }
            console.log('生成' + pdPath)
            fs.unlink(path, (err) => {
                if (err) {
                    // console.error(err)
                    alert(err)
                }
                console.log('删除' + path)
            })
            callback()
        })

    })
}

module.exports = {
    atlas,
    editJson,
    json2pd
}

// //解析需要遍历的文件夹，我这以E盘根目录为例
// var filePath = path.resolve('/Users/linze/Documents/GitHub/atlas-electron/bin')

// //调用文件遍历方法
// // fileDisplay(filePath)

// function fileDisplay(filePath) {
//     //根据文件路径读取文件，返回文件列表
//     fs.readdir(filePath, function (err, files) {
//         if (err) {
//             console.warn(err)
//         } else {
//             //遍历读取到的文件列表
//             files.forEach(function (filename) {
//                 //获取当前文件的绝对路径
//                 var filedir = path.join(filePath, filename)
//                 //根据文件路径获取文件信息，返回一个fs.Stats对象
//                 fs.stat(filedir, function (eror, stats) {
//                     if (eror) {
//                         console.warn('获取文件stats失败')
//                     } else {
//                         var isFile = stats.isFile() //是文件
//                         var isDir = stats.isDirectory() //是文件夹
//                         if (isFile) {
//                             console.log(filedir)
//                         }
//                         if (isDir) {
//                             // fileDisplay(filedir) //递归，如果是文件夹，就继续遍历该文件夹下面的文件
//                         }
//                     }
//                 })
//             })
//         }
//     })
// }