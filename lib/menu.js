const { app, Menu, shell } = require('electron')

const applicationMenu = [
  {
    label: app.getName(),
    submenu: [
      {
        role: 'about',
      },
      {
        role: 'quit',
      },
    ],
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click(item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.reload()
          }
        },
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin'
          ? 'Alt+Command+I'
          : 'Ctrl+Shift+I',
        click(item, focusedWindow) {
          if (focusedWindow) {
            if (focusedWindow.isDevToolsOpened()) {
              focusedWindow.closeDevTools()
            } else {
              focusedWindow.openDevTools({ mode: 'detach' })
            }
          }
        },
      },
    ],
  }, // cut
  {
    role: 'help',
    submenu: [
      {
        label: 'Screeener Website',
        click: () =>
          shell.openExternal('https://github.com/zehfernandes/screeeener'),
      },
      {
        label: 'Screeener repository',
        click: () =>
          shell.openExternal('https://github.com/zehfernandes/screeeener'),
      },
    ],
  },
]

exports.applicationMenu = Menu.buildFromTemplate(applicationMenu)
