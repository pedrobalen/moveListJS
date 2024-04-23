const { app, BrowserWindow, ipcMain, dialog } = require('electron');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  mainWindow.loadFile('src/index.html');

  ipcMain.on('open-file-dialog', (event) => {
    dialog.showOpenDialog({
      properties: ['openDirectory']
    }).then(result => {
      if (!result.canceled) {
        mainWindow.webContents.send('selected-directory', result.filePaths);
      }
    }).catch(err => {
      console.log(err);
    });
  });
}

app.whenReady().then(createWindow);
