const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  exportPdf: (options) => ipcRenderer.invoke('export-pdf', options),
  saveJsonDialog: (data, defaultName) => ipcRenderer.invoke('save-json-dialog', { data, defaultName }),
  loadJsonDialog: () => ipcRenderer.invoke('load-json-dialog'),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  extractPdfText: (filePath) => ipcRenderer.invoke('extract-pdf-text', filePath),
  selectAndExtractPdf: () => ipcRenderer.invoke('select-and-extract-pdf'),
  onPdfExtractionStatus: (callback) => {
    const listener = (_event, data) => callback(data);
    ipcRenderer.on('pdf-extraction-status', listener);
    return () => ipcRenderer.removeListener('pdf-extraction-status', listener);
  },
  toggleFullScreen: () => ipcRenderer.invoke('toggle-fullscreen'),
  isFullScreen: () => ipcRenderer.invoke('is-fullscreen'),
  onFullScreenChanged: (callback) => {
    const listener = (_event, isFull) => callback(isFull);
    ipcRenderer.on('fullscreen-state-changed', listener);
    return () => ipcRenderer.removeListener('fullscreen-state-changed', listener);
  }
});
