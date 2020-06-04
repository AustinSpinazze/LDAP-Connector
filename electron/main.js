const { app, BrowserWindow, ipcMain } = require('electron');
const { channels } = require('../src/shared/constants');
const path = require('path');
const url = require('url');
const ActiveDirectory = require('activedirectory2');


let mainWindow;
function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  mainWindow.loadURL('http://localhost:3000');
  mainWindow.webContents.openDevTools();
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}
app.on('ready', createWindow);
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on(channels.APP_INFO, (event) => {
    event.sender.send(channels.APP_INFO, {
      appName: app.getName(),
      appVersion: app.getVersion(),
    });
  });

ipcMain.on(channels.AUTHENTICATE, (event, config) => {
    var ad = new ActiveDirectory(config);
    ad.authenticate(config.username, config.password, function(err, auth) {
        if (err) {
          console.log('ERROR: '+JSON.stringify(err));
          event.returnValue= false;
        }
       
        if (auth) {
          console.log('Authenticated!');
          event.returnValue = true;
        }
        else {
          console.log('Authentication failed!');
          event.returnValue = false;
        }
      });
});

ipcMain.on(channels.FIND_GROUPS, (event, config) => {
    console.log(config, config.query);
    var ad = new ActiveDirectory(config);
    ad.findGroups(config.query, function(err, groups) {
        if (err) {
          console.log('ERROR: '+JSON.stringify(err));
          return;
        }
       
        if ((! groups) || (groups.length === 0)) console.log('No groups found.');
        else {
          console.log(groups);
          console.log(groups[0].cn);
          var groupNames = [];
          var i;
          for(i = 0; i < groups.length; i++) {
            groupNames[i] = groups[i].cn;
          }
          console.log(groupNames);
          event.returnValue = groupNames;
        }
    });
});