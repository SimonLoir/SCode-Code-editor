"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
electron_1.app.on("ready", function () {
    var main_window = new electron_1.BrowserWindow({ frame: false, icon: path.join(__dirname, "src/logo.png"), show: false });
    main_window.loadURL(url.format({
        pathname: path.join(__dirname, "../windows/index.html"),
        protocol: "file:",
        slashes: true
    }));
    main_window.on("closed", function () {
        main_window = null;
        electron_1.app.exit();
    });
    main_window.on('ready-to-show', function () {
        main_window.show();
    });
    electron_1.app.on('window-all-closed', function () {
        electron_1.app.quit();
    });
    main_window.maximize();
    var preview_window = new electron_1.BrowserWindow({ show: false });
    electron_1.ipcMain.on('render-project-reg', function (error, arg) {
        try {
            preview_window.hide();
            preview_window.loadURL(arg);
            preview_window.show();
        }
        catch (error) {
            //console.log(error);
        }
    });
    electron_1.ipcMain.on('render-project', function (error) {
        try {
            preview_window.reload();
        }
        catch (error) {
            //console.log(error);
        }
    });
    electron_1.ipcMain.on('print-it', function (error, event) {
        //console.log(event)
        var window = new electron_1.BrowserWindow({ show: false, title: "Scode - Print - Preview" });
        var fsystem = require('fs');
        fsystem.writeFileSync(__dirname + "/print.html", "<style>body{color:black;font-family:sans-serif, arial;}.default_color{color:rgb(20,20,20)}</style>" + event.content.replace('color:white', "color:rgb(20,20,20)"));
        window.once('ready-to-show', function () {
            //console.log('show')
            window.show();
            window.webContents.print();
        });
        window.loadURL(url.format({
            pathname: path.join(__dirname, "print.html"),
            protocol: "file:",
            slashes: true
        }));
    });
});
