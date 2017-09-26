const electron = require('electron')
const { BrowserWindow, ipcMain, dialog, shell, Menu } = require('electron')
const app = electron.app

const path = require('path')
const url = require('url')
const decache = require('decache');

// const autoUpdater = require('./lib/autoUpdate.js')
const autoUpdater = require('./lib/notifyUpdate.js')
const { userDataPath, getLoadTemplateObj } = require('./lib/getTemplates.js')
const { jxaBridge } = require('./lib/jxaBridge.js')
const { applicationMenu } = require('./lib/menu.js')
const { saveMockup, renderPNG, cleanTempFiles, copyMockupFile, deleteTempJson } = require('./lib/mockupData.js')

// Keep a global reference of the window object, if you don't, the window will
let mainWindow
let addWindow

app.on('ready', function () {
  // Pass those values in to the BrowserWindow options
  mainWindow = new BrowserWindow({
    width: 950,
    height: 610,
    resizable: false,
    title: 'Select your theme',
    icon: path.join(__dirname, '/app/assets/ic.png.icns'),
    preloadWindow: true,
  })

  mainWindow.loadURL('file://' + path.join(__dirname, 'index.html'))
  //mainWindow.openDevTools()

  // Get the default mockups
  const templatesPath = path.join(__dirname, '/app/assets/templates.json')
  const defaultTemplates = require(templatesPath)
  defaultTemplates.defaults = defaultTemplates.defaults.map(obj => {
    obj.mockup.path = `${__dirname}/app/assets/${obj.mockup.path}`
    return obj
  })

  /*
    Keynotes
  */
  ipcMain.on('load-templates', event => {
    console.log("Load Templates")
    getLoadTemplateObj().then((loadTemplates) => {
      const templates = Object.assign(defaultTemplates, loadTemplates)
      event.sender.send('template-list', templates)
    })
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
      function (filesPath) {
        if (filesPath !== undefined) {
          jxaBridge(templateData, filesPath)
        }
      }
    )
  })

  /*
    Save Mockups
  */
  ipcMain.on('add-mockup', (event, data) => {
    dialog.showOpenDialog(
      mainWindow,
      {
        title: 'Select your mockup image',
        properties: ['openFile'],
        filters: [{ name: 'Images', extensions: ['png'] }],
      },
      function (filesPath) {
        if (filesPath !== undefined) {
          copyMockupFile(filesPath[0]).then((newFilePath) => {
            renderPNG(newFilePath).then(() => event.sender.send('change-page'))
          })
        }
      }
    )
  })

  ipcMain.on('load-mockup', (event, data) => {
    const tempPath = path.join(`${userDataPath}/templates/`, data)
    decache(tempPath)
    const tempData = require(tempPath)
    event.sender.send('result-mockup', tempData)
  })

  ipcMain.on('save-mockup', (event, data) => {
    let fileName = data.name
    saveMockup(fileName, data)
    deleteTempJson()
  })

  ipcMain.on('clear-mockup', (event, data) => {
    cleanTempFiles(data)
  })


  /*
    Others
  */
  ipcMain.on('open-docs', () => {
    shell.openExternal(
      'https://github.com/zehfernandes/screeener#how-to-create-a-mockup'
    )
  })

  ipcMain.on('install-update', event => {
    shell.openExternal('https://github.com/zehfernandes/screeener/releases')
  })

  Menu.setApplicationMenu(applicationMenu)
  autoUpdater.init(mainWindow)


  mainWindow.on('window-all-closed', function () {
    cleanTempFiles('_temp.json')
  })
})



/*
app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
*/
