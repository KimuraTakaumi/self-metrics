'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
var Tray = require('tray');
var Menu = require('menu');
var config;
var items;
var mainWindow = null;
const storage = require('electron-json-storage');
var appIcon = null;
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
const clipboard = require('electron').clipboard;
var http = require('http');
http.post = require('http-post');

if (process.platform == 'darwin') {
    app.dock.hide();
}

app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

var showWindow = function (url) {
    if (mainWindow == null) {
        mainWindow = new BrowserWindow({width: 800, height: 600});
    }
    mainWindow.loadURL(url);
    //mainWindow.webContents.openDevTools();
    mainWindow.on('closed', function () {
        mainWindow = null
    });
    mainWindow.show();
};

var load_config = function (next) {
    storage.get('config', function (error, data) {
        if (error) throw error;

        if (Object.keys(data).length === 0) {
            var json = {
                user: 'hoge',
                url: "localhost:3000",
                name: "hoge太郎",
                from: "abcdefg@mail.com",
                to: "hijklmn@mail.com"
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
        var time = new Date();
        var json = {};
        json["user"] = config.user;
        json["work"] = label;
        json["date"] = time.getTime();

        var url = config.url.split(":");
        var options = {
            hostname: url[0],
            port: url[1],
            path: '/metrics',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': json.length
            }
        };
        http.post(options, json, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log(chunk);
            });
        });


    };
    return item;
};

app.on('ready', function () {
    init(function () {
        appIcon = new Tray(__dirname + '/images/icon.png');
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
        item["label"] = "項目設定";
        item["click"] = function () {
            showWindow('file://' + __dirname + '/items.html');
        };
        array.push(item);

        item = {};
        item["type"] = "separator";
        array.push(item);

        item = {};
        item["label"] = "終了";
        item["click"] = function () {
            mainWindow = null;
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

exports.getItemsData = function () {
    return items;
};

exports.setItemsData = function (json) {
    storage.set('items', json, function (error) {
        if (error) throw error;
        items = json;
    });
};

exports.sendMail = function (subject, to, from, text) {
    console.log(subject);
    console.log(to);
    console.log(from);
    console.log(text);

    var smtpTransport = nodemailer.createTransport(smtpTransport({
        host: "xxxxxxx",
        port: 0,
        secure: true,
        auth: {
            user: "xxxxxxx",
            pass: "xxxxxxx"
        }
    }));

    var mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: text
    };

    //smtpTransport.sendMail(mailOptions, function(error, response){
    //    if(error){
    //        console.log(error);
    //    }else{
    //        console.log("Message sent: " + response.message);
    //    }
    //
    //    smtpTransport.close();
    //});
};

exports.writeClipboard = function (text) {
    clipboard.writeText(text);
};
