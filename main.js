const {app, BrowserWindow, Menu} = require('electron');


app.name = "TEXEL";

const menuTemplate = [{
    label: 'TEXEL',
    submenu: [
        {label: 'Open'},
        {label: 'Import'}
    ]
}];



function createWindow() {

    const window = new BrowserWindow({
        width: 800,
        height:600,
        webPreferences: {
            nodeIntegration: true
        }
    }
    );
    
    window.loadFile('index.html');
    window.webContents.openDevTools();
}

function setMainMenu() {
    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
}

app.on('ready', () => {
    createWindow();
    setMainMenu();
  });

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  });
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  });