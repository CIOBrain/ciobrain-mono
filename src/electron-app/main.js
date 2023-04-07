const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  })

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:3000')
  } else {
    win.loadFile(path.join(process.resourcesPath, 'build', 'index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})