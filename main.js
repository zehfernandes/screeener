const electron = require('electron')
const { BrowserWindow, ipcMain, dialog, shell } = require('electron')
const app = electron.app

const path = require('path')
const url = require('url')

const autoUpdater = require('./lib/autoUpdate.js')
const { userDataPath, getLoadTemplateObj } = require('./lib/getTemplates.js')
const { jxaBridge } = require('./lib/jxaBridge.js')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
// do this so that the window object doesn't get GC'd
let mainWindow

app.on('ready', function() {
  // Pass those values in to the BrowserWindow options
  mainWindow = new BrowserWindow({
    width: 950,
    height: 600,
    resizable: false,
    title: 'Select your theme',
    icon: path.join(__dirname, '/app/assets/ic.png.icns'),
    preloadWindow: true,
  })

  mainWindow.loadURL('file://' + path.join(__dirname, 'index.html'))
  // mainWindow.openDevTools()

  // Get the default mockups
  const templatesPath = path.join(__dirname, '/app/assets/templates.json')
  const defaultTemplates = require(templatesPath)
  defaultTemplates.defaults = defaultTemplates.defaults.map(obj => {
    obj.mockup.path = `${__dirname}/app/assets/${obj.mockup.path}`
    return obj
  })
  const loadTemplates = getLoadTemplateObj()

  const templates = Object.assign(defaultTemplates, loadTemplates)

  // Get files from application support
  ipcMain.on('load-templates', event => {
    console.log(templates)
    event.sender.send('template-list', templates)
  })

  ipcMain.on('run-keynote', (event, templateData) => {
    console.log('click')
    dialog.showOpenDialog(
      mainWindow,
      {
        title: 'Select the folder or the image files',
        properties: ['openFile', 'openDirectory', 'multiSelections'],
        filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }],
      },
      function(filesPath) {
        if (filesPath !== undefined) {
          jxaBridge(templateData, filesPath)
        }
      }
    )
  })

  ipcMain.on('open-docs', () => {
    shell.openExternal(
      'https://github.com/zehfernandes/screenstokeynote/blob/master/README.md'
    )
  })

  autoUpdater.init(mainWindow)
})

/*
// Quit when all windows are closed.
mb.window.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
*/
