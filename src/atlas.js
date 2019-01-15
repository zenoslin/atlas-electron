const childProcess = require('child_process')
const path = require('path')
const fs = require('fs')

function atlas(cmd, callback) {
    if (!cmd) {
        cmd = path.resolve(__dirname, '..') + "/lib/atlas-generator" + " " + path.resolve(__dirname, '..') + "/lib/atlasConfig.json"
    }
    childProcess.exec(cmd, {
        encoding: "binary",
        maxBuffer: 1024 * 1024 * 20
    }, function (err, stdOut, stdErr) {
        console.log(err + stdErr)
        callback();
    })
}

function editJson(path, key, value) {
    fs.readFile(path, function (err, data) {
        if (err) {
            console.error(err)
        }
        let person = data.toString()
        person = JSON.parse(person)
        if (typeof value  == "object") {
            person[key] = value[0]
        } else {
            person[key] = value
        }
        let str = JSON.stringify(person)
        fs.writeFile(path, str, function (err) {
            if (err) {
                console.error(err)
            }
            console.log('修改成功')
            console.log(person)
        })
    })
}

module.exports = {
    atlas,
    editJson
}