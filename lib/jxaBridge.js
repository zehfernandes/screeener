const exec = require('child_process').exec

function jxaBridge(templateData) {
  return new Promise((resolve) => {
    var cmd = `osascript -l JavaScript '${__dirname}/keynoteRobot.js' '${JSON.stringify(templateData)}'`

    exec(cmd, function(error) {
      if (error) {
        console.log(error)
      }

      resolve()
    })
  })
}

module.exports = {
  jxaBridge,
}
