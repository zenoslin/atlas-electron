const childProcess = require('child_process')
const path = require('path')

function atlas(cmd) {
    if (!cmd) {
        cmd = path.resolve(__dirname, '..') + "/lib/atlas-generator" + " " + path.resolve(__dirname, '..') + "/lib/atlasConfig.json"
    }
    childProcess.exec(cmd, {
        encoding: "binary",
        maxBuffer: 1024 * 1024 * 20
    }, function(err, stdOut, stdErr)
    {
        console.log(err + stdErr)
    })
}

atlas();