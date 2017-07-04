const exec = require('child_process').exec
const fs = require('fs')
const { dialog } = require('electron')

function jxaBridge(templateData, filesPath) {
  return new Promise(resolve => {
    let files = listPathFiles(filesPath)
    console.log(files)
    let cmd = `osascript -l JavaScript '${__dirname}/keynoteRobot.js' '${JSON.stringify(templateData)}' '${JSON.stringify(files)}'`
    console.log(cmd)

    exec(cmd, function(error) {
      if (error) {
        dialog.showErrorBox('Report this error', error)
        console.log(error)
      }

      resolve()
    })
  })
}

function listPathFiles(filesPath) {
  console.log('---------LIST PATH FILES')
  const newFiles = []
  for (var i = 0; i < filesPath.length; i++) {
    let filePath = filesPath[i]
    if (fs.lstatSync(filePath).isDirectory()) {
      let objFiles = fs
        .readdirSync(filePath)
        .filter(function(fileName) {
          return /\.(png|jpg|gif)/.test(fileName)
        })
        .map(fileName => `${filePath}/${fileName}`)

      objFiles.length > 0 ? newFiles.push(objFiles) : null
    } else {
      newFiles.push(filePath)
    }
  }

  return newFiles.reverse() // Fix order to preserve concatSlideImages. Messing by the for above.
}

module.exports = {
  jxaBridge,
}
