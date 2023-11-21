import { contextBridge, ipcRenderer } from 'electron'
import { Source } from './Source'

contextBridge.exposeInMainWorld('bridge', {
  onSource (callback: (source: Source) => void) {
    ipcRenderer.once('source', (_, source) => callback(source))
  },
  onPlay (callback: () => void) {
    ipcRenderer.on('play', callback)
  },
  onStop (callback: () => void) {
    ipcRenderer.on('stop', callback)
  }
})