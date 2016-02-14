'use strict';

const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
var config;
var items;
var request = require('request');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function () {
    var fs = require('fs');
    fs.readFile('./data/config.json', 'utf8', function (err, text) {
        config = JSON.parse(text);

        fs.readFile('./data/items.json', 'utf8', function (err, text) {
            items = JSON.parse(text);
            var Tray = require('tray');
            var Menu = require('menu');

            var appIcon = new Tray(__dirname + '/images/icon.png');

            var array = [];
            for (var i = 0; i < items.items.length; i++) {
                var item = {};
                var label = items.items[i];
                item["label"] = items.items[i];
                item["click"] = function () {
                    console.log("test");

                    var json = {};
                    json["user"] = config.user;
                    json["work"] = label;

                    var options = {
                        url: config.url,
                        headers: {'Content-Type': 'application/json'},
                        json: true,
                        body: json
                    };

                    request.post(options, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            console.log("success");
                        } else {
                            console.log('error: ' + response.statusCode);
                        }
                    });
                };
                array.push(item);
            }

            var item = {};
            item["type"] = "separator";
            array.push(item);

            item = {};
            item["label"] = "日報";
            item["click"] = function () {
                // Create the browser window.
                mainWindow = new BrowserWindow({width: 800, height: 600});

                // and load the index.html of the app.
                mainWindow.loadURL('file://' + __dirname + '/metrics.html');

                // Open the DevTools.
                //mainWindow.webContents.openDevTools();

                // Emitted when the window is closed.
                mainWindow.on('closed', function () {
                    // Dereference the window object, usually you would store windows
                    // in an array if your app supports multi windows, this is the time
                    // when you should delete the corresponding element.
                    mainWindow = null;
                });
            };
            array.push(item);
            item = {};
            item["type"] = "separator";
            array.push(item);

            item = {};
            item["label"] = "設定";
            item["click"] = function () {
                // Create the browser window.
                mainWindow = new BrowserWindow({width: 800, height: 600});

                // and load the index.html of the app.
                mainWindow.loadURL('file://' + __dirname + '/config.html');

                // Open the DevTools.
                //mainWindow.webContents.openDevTools();

                // Emitted when the window is closed.
                mainWindow.on('closed', function () {
                    // Dereference the window object, usually you would store windows
                    // in an array if your app supports multi windows, this is the time
                    // when you should delete the corresponding element.
                    mainWindow = null;
                });
            };
            array.push(item);
            item = {};
            item["type"] = "separator";
            array.push(item);

            item = {};
            item["label"] = "終了";
            item["click"] = function () {
                app.quit();
            };
            array.push(item);

            var contextMenu = Menu.buildFromTemplate(array);
            appIcon.setContextMenu(contextMenu);
            appIcon.setToolTip('Self Metrics');
        });

    });
});

