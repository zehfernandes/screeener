const { autoUpdater, ipcMain } = require('electron')
const isDev = require('electron-is-dev')
const ms = require('ms')
// https://api.github.com/repos/sindresorhus/caprine/releases/latest
function createInterval() {
  return setInterval(() => {
    autoUpdater.checkForUpdates()
  }, ms('30m'))
}

let manualCheckTimeout

function init(window) {
  if (isDev) {
    return;
  }

  setTimeout(() => {
    autoUpdater.checkForUpdates()
  }, ms('5s')) // At this point the app is fully started and ready for everything

  let intervalId = createInterval()

  autoUpdater.on('update-available', () => {
    clearTimeout(manualCheckTimeout)
    clearInterval(intervalId)
    intervalId = undefined
  })

  autoUpdater.on('update-downloaded', () => {
    window.webContents.send('update-downloaded')
  })

  ipcMain.on('install-update', () => {
    console.log("update")
    autoUpdater.quitAndInstall()
  })

  autoUpdater.on('error', err => {
    if (intervalId === undefined) {
      // If the error occurred during the download
      intervalId = createInterval()
    }
  })
}

// The `callback` will be called if no update is available at the moment
function checkForUpdates(callback) {
  manualCheckTimeout = setTimeout(() => {
    callback()
  }, ms('10s'))
}

exports.init = init
exports.checkForUpdates = checkForUpdates
