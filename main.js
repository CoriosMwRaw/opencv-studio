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

// Función auxiliar: Extracción híbrida de PDF (Texto digital + OCR offline de respaldo con Tesseract.js)
async function extractPdfTextWithOcrFallback(filePath) {
  const { PDFParse } = require('pdf-parse');
  const buffer = fs.readFileSync(filePath);
  const parser = new PDFParse(new Uint8Array(buffer));
  const res = await parser.getText();
  let text = (res.text || res || '').trim();

  // Limpiar separadores de página residuales como "-- 1 of 3 --"
  const strippedText = text.replace(/--\s*\d+\s*of\s*\d+\s*--/gi, '').trim();

  // Si tiene texto digital real (al menos 30 caracteres válidos), retornamos directo al instante
  if (strippedText.length >= 30) {
    return { success: true, text: text, filePath, method: 'direct' };
  }

  // Si el texto digital está vacío o aplanado, activamos OCR inteligente
  console.log(`[OCR] PDF sin capa de texto digital (${strippedText.length} caracteres). Aplicando OCR con Tesseract.js...`);
  
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('pdf-extraction-status', {
      status: 'rendering',
      message: 'PDF aplanado o escaneado detectado. Renderizando páginas para OCR...'
    });
  }

  try {
    const screenshots = await parser.getScreenshot({ scale: 2.0 });
    if (!screenshots || !screenshots.pages || screenshots.pages.length === 0) {
      return { success: true, text: text, filePath, method: 'direct' };
    }

    const tesseract = require('tesseract.js');
    const tessdataPath = path.join(__dirname, 'assets', 'tessdata');

    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('pdf-extraction-status', {
        status: 'starting_ocr',
        totalPages: screenshots.pages.length,
        message: `Iniciando motor OCR offline en español para ${screenshots.pages.length} página(s)...`
      });
    }

    const worker = await tesseract.createWorker('spa', 1, {
      langPath: tessdataPath,
      gzip: false,
      logger: m => {
        if (m.status === 'recognizing text' && mainWindow && !mainWindow.isDestroyed()) {
          const pct = Math.round((m.progress || 0) * 100);
          mainWindow.webContents.send('pdf-extraction-status', {
            status: 'ocr_progress',
            progress: pct,
            message: `Escaneando texto óptico: ${pct}%...`
          });
        }
      }
    });

    let ocrResultText = '';
    for (let i = 0; i < screenshots.pages.length; i++) {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('pdf-extraction-status', {
          status: 'page',
          page: i + 1,
          totalPages: screenshots.pages.length,
          message: `Escaneando página ${i + 1} de ${screenshots.pages.length}...`
        });
      }
      const pageRes = await worker.recognize(screenshots.pages[i].data);
      ocrResultText += `\n--- PÁGINA ${i + 1} ---\n` + (pageRes.data.text || '');
    }

    await worker.terminate();

    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('pdf-extraction-status', {
        status: 'done',
        method: 'ocr',
        message: '¡Escaneo OCR completado con éxito!'
      });
    }

    return {
      success: true,
      text: ocrResultText.trim(),
      filePath,
      method: 'ocr'
    };
  } catch (ocrErr) {
    console.error('Error durante el OCR fallback:', ocrErr);
    return {
      success: true,
      text: text,
      filePath,
      method: 'direct',
      warning: 'OCR no completado: ' + ocrErr.message
    };
  }
}

// IPC: Extraer texto de un archivo PDF específico
ipcMain.handle('extract-pdf-text', async (event, filePath) => {
  try {
    return await extractPdfTextWithOcrFallback(filePath);
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

    return await extractPdfTextWithOcrFallback(filePaths[0]);
  } catch (err) {
    console.error('Error en select-and-extract-pdf:', err);
    return { success: false, error: err.message };
  }
});
