const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1380,
    height: 880,
    minWidth: 1024,
    minHeight: 700,
    title: 'OpenCV Studio - Creador de CV Profesional y Libre',
    backgroundColor: '#0f172a',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      spellcheck: true
    }
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.loadFile('index.html');

  // Handler para open-external
  ipcMain.handle('open-external', async (event, url) => {
    shell.openExternal(url);
  });

  // Abrir enlaces externos en el navegador predeterminado
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC: Exportar a PDF nativo con Chromium printToPDF
ipcMain.handle('export-pdf', async (event, options = {}) => {
  try {
    const { filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Guardar CV en formato PDF',
      defaultPath: options.defaultName || 'Mi_Curriculum_Profesional.pdf',
      filters: [{ name: 'Documento PDF', extensions: ['pdf'] }]
    });

    if (!filePath) return { success: false, canceled: true };

    const pdfData = await mainWindow.webContents.printToPDF({
      pageSize: options.pageSize || 'Letter',
      printBackground: true,
      margins: {
        marginType: 'custom',
        top: 0.3,
        bottom: 0.3,
        left: 0.3,
        right: 0.3
      },
      preferCSSPageSize: true
    });

    fs.writeFileSync(filePath, pdfData);
    return { success: true, filePath };
  } catch (err) {
    console.error('Error al exportar PDF:', err);
    return { success: false, error: err.message };
  }
});

// IPC: Guardar archivo JSON de respaldo
ipcMain.handle('save-json-dialog', async (event, { data, defaultName }) => {
  try {
    const { filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Respaldar CV (Formato JSON)',
      defaultPath: defaultName || 'Respaldo_CV.json',
      filters: [{ name: 'Archivo JSON', extensions: ['json'] }]
    });

    if (!filePath) return { success: false, canceled: true };

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return { success: true, filePath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// IPC: Cargar archivo JSON
ipcMain.handle('load-json-dialog', async () => {
  try {
    const { filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: 'Cargar Respaldo de CV (JSON)',
      filters: [{ name: 'Archivo JSON', extensions: ['json'] }],
      properties: ['openFile']
    });

    if (!filePaths || filePaths.length === 0) return { success: false, canceled: true };

    const content = fs.readFileSync(filePaths[0], 'utf-8');
    const parsed = JSON.parse(content);
    return { success: true, data: parsed, filePath: filePaths[0] };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// IPC: Extraer texto de un archivo PDF específico
ipcMain.handle('extract-pdf-text', async (event, filePath) => {
  try {
    const { PDFParse } = require('pdf-parse');
    const buffer = fs.readFileSync(filePath);
    const parser = new PDFParse(new Uint8Array(buffer));
    const res = await parser.getText();
    return { success: true, text: res.text || res };
  } catch (err) {
    console.error('Error al extraer PDF:', err);
    return { success: false, error: err.message };
  }
});

// IPC: Abrir diálogo para seleccionar y extraer texto de un PDF
ipcMain.handle('select-and-extract-pdf', async () => {
  try {
    const { filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: 'Seleccionar Currículum en Formato PDF',
      filters: [{ name: 'Documento PDF', extensions: ['pdf'] }],
      properties: ['openFile']
    });

    if (!filePaths || filePaths.length === 0) return { success: false, canceled: true };

    const { PDFParse } = require('pdf-parse');
    const buffer = fs.readFileSync(filePaths[0]);
    const parser = new PDFParse(new Uint8Array(buffer));
    const res = await parser.getText();
    return { success: true, text: res.text || res, filePath: filePaths[0] };
  } catch (err) {
    console.error('Error en select-and-extract-pdf:', err);
    return { success: false, error: err.message };
  }
});
