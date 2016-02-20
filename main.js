'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
var config;
var items;
var request = require('request');
var mainWindow = null;
const storage = require('electron-json-storage');

app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

var showWindow = function (url) {
    mainWindow = new BrowserWindow({width: 800, height: 600});
    mainWindow.loadURL(url);
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
};

var load_config = function (next) {
    storage.get('config', function (error, data) {
        if (error) throw error;

        if (Object.keys(data).length === 0) {
            var json = {
                user: 'hoge',
                url: "http://localhost:3000/metrics",
                name: "hoge太郎"
            };
            storage.set('config', json, function (error) {
                if (error) throw error;
                config = json;
                next();
            });
        } else {
            config = data;
            next();
        }
    });
};

var load_items = function (next) {
    storage.get('items', function (error, data) {
        if (error) throw error;

        if (Object.keys(data).length === 0) {
            var json = {
                "items": [
                    "AAA/設計",
                    "AAA/実装",
                    "AAA/テスト",
                    "BBB/設計",
                    "BBB/実装",
                    "BBB/テスト"
                ]
            };
            storage.set('items', json, function (error) {
                if (error) throw error;
                items = json;
                next();
            });
        } else {
            items = data;
            next();
        }
    });
};

var init = function (next) {
    load_config(function () {
        load_items(function () {
            next();
        })
    })
};

var createItem = function (label) {
    var item = {};
    item["label"] = label;
    item["click"] = function () {
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
    return item;
};

app.on('ready', function () {
    init(function () {
        var Tray = require('tray');
        var Menu = require('menu');

        var appIcon = new Tray(__dirname + '/images/icon.png');

        var array = [];
        for (var i = 0; i < items.items.length; i++) {
            var item = createItem(items.items[i]);
            array.push(item);
        }

        var item = {};
        item["type"] = "separator";
        array.push(item);

        item = {};
        item["label"] = "日報";
        item["click"] = function () {
            showWindow('file://' + __dirname + '/metrics.html');
        };
        array.push(item);
        item = {};
        item["type"] = "separator";
        array.push(item);

        item = {};
        item["label"] = "設定";
        item["click"] = function () {
            showWindow('file://' + __dirname + '/config.html');
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

exports.getConfigData = function () {
    return config;
};

exports.setConfigData = function (json) {
    storage.set('config', json, function (error) {
        if (error) throw error;
        config = json;
    });

};