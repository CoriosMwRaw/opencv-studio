const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  exportPdf: (options) => ipcRenderer.invoke('export-pdf', options),
  saveJsonDialog: (data, defaultName) => ipcRenderer.invoke('save-json-dialog', { data, defaultName }),
  loadJsonDialog: () => ipcRenderer.invoke('load-json-dialog'),
  openExternal: (url) => ipcRenderer.invoke('open-external', url)
});
