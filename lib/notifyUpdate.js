const { ipcRenderer } = require('electron')
const fetch = require('electron-fetch')

function init(window) {
  checkForUpdates(window)
}

function checkForUpdates(window) {
  fetch(
    'https://api.github.com/repos/zehfernandes/screeener/releases/latest'
  )
    .then(res => res.json())
    .then(json => {
      let lastVersion = typeof json.tag_name != 'undefined' ? json.tag_name.slice(1) : '100.0.0'
      let version = require('../package').version
      if (parseInt(lastVersion) > parseInt(version)) {
        window.webContents.send('update-downloaded')
      }
    })
  /* request.get("https://api.github.com/repos/zehfernandes/screenstokeynote/releases/latest", function(error, response, body) {
    let lastest = JSON.parse(response)
    console.log(lastest)
    let lastVersion = JSON.parse(response).tag_name.slice(1)
    let version = require('../package').version
    if (lastVersion !== version) {
      ipcMain.send('update-downloaded')
    }
  })*/
}

exports.init = init
exports.checkForUpdates = checkForUpdates
