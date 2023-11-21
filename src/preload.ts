import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('bridge', {
  play () {
    ipcRenderer.send('play')
  },
  stop () {
    ipcRenderer.send('stop')
  },
  quit () {
    ipcRenderer.send('quit')
  }
})