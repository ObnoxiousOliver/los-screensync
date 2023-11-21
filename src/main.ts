import { app, BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
import { Source } from './Source'
import { config } from './config'
app.commandLine.appendSwitch('high-dpi-support', '1')
app.commandLine.appendSwitch('force-device-scale-factor', '1')

const videoWindows: BrowserWindow[] = []


function createVideoWindow(source: Source) {
  // Create the browser window.
  const win = new BrowserWindow({
    x: source.x,
    y: source.y,
    height: source.height,
    width: source.width,
    transparent: true,
    frame: false,
    backgroundColor: '#000000',
    alwaysOnTop: true,
    resizable: false,
    movable: false,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, 'videoPreload.js')
    }
  })

  win.loadFile(path.join(__dirname, '../video.html'))

  win.webContents.on('did-finish-load', () => {
    win.webContents.send('source', source)
  })

  videoWindows.push(win)
}

function createWindow () {
  const win = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })


  win.menuBarVisible = false

  win.webContents.on('did-finish-load', () => {
    win.webContents.zoomFactor = 2
  })
  win.loadFile(path.join(__dirname, '../index.html'))

  win.on('closed', () => {
    app.quit()
  })
}

app.whenReady().then(() => {
  createWindow()

  const minDelayBelowZero = Math.min(...config.map(source => source.delay).filter(x => x < 0), 0)
  const sources = config.map(source => ({
    ...source,
    delay: source.delay - minDelayBelowZero
  }))

  sources.forEach(source => createVideoWindow(source))

  ipcMain.on('play', () => {
    videoWindows.forEach((win, i) => {
      setTimeout(() => {
        win.webContents.send('play')
      }, sources[i].delay * 1000)
    })
  })

  ipcMain.on('stop', () => {
    videoWindows.forEach((win, i) => {
      setTimeout(() => {
        win.webContents.send('stop')
      }, sources[i].delay * 1000)
    })
  })

  ipcMain.on('quit', () => {
    app.quit()
  })
})

app.on('window-all-closed', () => {
  app.quit()
})

