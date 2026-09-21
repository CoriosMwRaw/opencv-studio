const { app, BrowserWindow, ipcMain, dialog, shell, Menu, MenuItem } = require('electron');
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
    icon: path.join(__dirname, 'assets', 'icon.png'),
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      spellcheck: true
    }
  });

  // Configurar idiomas del corrector ortográfico (Español e Inglés)
  try {
    mainWindow.webContents.session.setSpellCheckerLanguages(['es-ES', 'es', 'en-US']);
  } catch (err) {
    console.warn('Could not set spellchecker languages:', err);
  }

  // Menú contextual nativo con clic derecho: Sugerencias ortográficas y edición
  mainWindow.webContents.on('context-menu', (event, params) => {
    const menu = new Menu();

    // 1. Sugerencias del corrector ortográfico si la palabra tiene error
    if (params.dictionarySuggestions && params.dictionarySuggestions.length > 0) {
      for (const suggestion of params.dictionarySuggestions) {
        menu.append(new MenuItem({
          label: suggestion,
          click: () => mainWindow.webContents.replaceMisspelling(suggestion)
        }));
      }
      menu.append(new MenuItem({ type: 'separator' }));
    }

    // 2. Opción de agregar al diccionario personalizado
    if (params.misspelledWord) {
      if (!params.dictionarySuggestions || params.dictionarySuggestions.length === 0) {
        menu.append(new MenuItem({
          label: '(Sin sugerencias ortográficas)',
          enabled: false
        }));
      }
      menu.append(new MenuItem({
        label: `Agregar "${params.misspelledWord}" al diccionario`,
        click: () => mainWindow.webContents.session.addWordToSpellCheckerDictionary(params.misspelledWord)
      }));
      menu.append(new MenuItem({ type: 'separator' }));
    }

    // 3. Acciones de edición si es un campo editable (inputs, textareas)
    if (params.isEditable) {
      menu.append(new MenuItem({ role: 'undo', label: 'Deshacer (Undo)' }));
      menu.append(new MenuItem({ role: 'redo', label: 'Rehacer (Redo)' }));
      menu.append(new MenuItem({ type: 'separator' }));
      menu.append(new MenuItem({ role: 'cut', label: 'Cortar (Cut)' }));
      menu.append(new MenuItem({ role: 'copy', label: 'Copiar (Copy)' }));
      menu.append(new MenuItem({ role: 'paste', label: 'Pegar (Paste)' }));
      menu.append(new MenuItem({ type: 'separator' }));
      menu.append(new MenuItem({ role: 'selectAll', label: 'Seleccionar todo (Select All)' }));
    } else if (params.selectionText && params.selectionText.trim().length > 0) {
      menu.append(new MenuItem({ role: 'copy', label: 'Copiar (Copy)' }));
    }

    if (menu.items.length > 0) {
      menu.popup();
    }
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize();
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.loadFile('index.html');

  // Atajo de teclado F11 para alternar modo pantalla completa total
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F11' && input.type === 'keyDown') {
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
      event.preventDefault();
    }
  });

  // Notificar al frontend cambios de estado de pantalla completa
  mainWindow.on('enter-full-screen', () => {
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send('fullscreen-state-changed', true);
    }
  });

  mainWindow.on('leave-full-screen', () => {
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send('fullscreen-state-changed', false);
    }
  });

  // Handler para open-external
  ipcMain.handle('open-external', async (event, url) => {
    shell.openExternal(url);
  });

  // Handler para alternar pantalla completa desde la UI
  ipcMain.handle('toggle-fullscreen', () => {
    if (mainWindow) {
      const isFull = !mainWindow.isFullScreen();
      mainWindow.setFullScreen(isFull);
      return isFull;
    }
    return false;
  });

  ipcMain.handle('is-fullscreen', () => {
    return mainWindow ? mainWindow.isFullScreen() : false;
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
      filters: [{ name: 'Currículums (PDF, Word, Texto)', extensions: ['pdf', 'docx', 'txt', 'md'] }]
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

// Función auxiliar: Extracción nativa de texto de documentos Word (.docx)
function extractDocxTextInternal(filePath) {
  const yauzl = require('yauzl');
  return new Promise((resolve) => {
    yauzl.open(filePath, { lazyEntries: true }, (err, zipfile) => {
      if (err) return resolve({ success: false, error: 'No se pudo abrir el archivo Word: ' + err.message });
      let found = false;
      zipfile.readEntry();
      zipfile.on('entry', (entry) => {
        if (entry.fileName === 'word/document.xml') {
          found = true;
          zipfile.openReadStream(entry, (err, stream) => {
            if (err) return resolve({ success: false, error: err.message });
            const chunks = [];
            stream.on('data', c => chunks.push(c));
            stream.on('end', () => {
              const xml = Buffer.concat(chunks).toString('utf8');
              const text = xml
                .replace(/<w:tab[^>]*\/>/g, '\t')
                .replace(/<w:br[^>]*\/>/g, '\n')
                .replace(/<\/w:p>/g, '\n')
                .replace(/<[^>]+>/g, '')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&')
                .replace(/&quot;/g, '"')
                .replace(/&apos;/g, "'")
                .trim();
              resolve({ success: true, text, filePath, method: 'docx' });
            });
          });
        } else {
          zipfile.readEntry();
        }
      });
      zipfile.on('end', () => {
        if (!found) resolve({ success: false, error: 'No se encontró contenido de texto en el archivo Word' });
      });
      zipfile.on('error', (zErr) => resolve({ success: false, error: zErr.message }));
    });
  });
}

// IPC: Extraer texto de un archivo DOCX (.docx de Microsoft Word)
ipcMain.handle('extract-docx-text', async (event, filePath) => {
  try {
    return await extractDocxTextInternal(filePath);
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// IPC: Abrir diálogo para seleccionar y extraer texto de un archivo (PDF, Word, Texto)
ipcMain.handle('select-and-extract-pdf', async () => {
  try {
    const { filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: 'Seleccionar Currículum en Formato PDF, Word o Texto',
      filters: [{ name: 'Currículums (PDF, Word, Texto)', extensions: ['pdf', 'docx', 'txt', 'md'] }],
      properties: ['openFile']
    });

    if (!filePaths || filePaths.length === 0) return { success: false, canceled: true };
    const p = filePaths[0];
    const ext = path.extname(p).toLowerCase();

    if (ext === '.docx') {
      return await extractDocxTextInternal(p);
    } else if (ext === '.txt' || ext === '.md') {
      const text = fs.readFileSync(p, 'utf8');
      return { success: true, text, filePath: p, method: 'direct' };
    } else {
      return await extractPdfTextWithOcrFallback(p);
    }
  } catch (err) {
    console.error('Error en select-and-extract-pdf:', err);
    return { success: false, error: err.message };
  }
});
