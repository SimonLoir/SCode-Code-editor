///<reference path="../../node_modules/electron/electron.d.ts"/>
import {app, globalShortcut, BrowserWindow, ipcMain} from "electron";
import * as path from "path";
import * as url from "url";

app.on("ready", function () {

    var main_window = new BrowserWindow({ frame: false, icon: path.join(__dirname, "src/logo.png"), transparent: true, show:false});

    main_window.loadURL(url.format({
        pathname: path.join(__dirname, "../windows/index.html"),
        protocol: "file:",
        slashes: true
    }));

    main_window.on("closed", function () {
        main_window = null;
        app.exit();
    });

    main_window.on('ready-to-show', function () {
        main_window.show();
    })

    app.on('window-all-closed', function () {
        app.quit();
    });

    main_window.maximize();

    var preview_window = new BrowserWindow({ show: false });

    ipcMain.on('render-project-reg', (error:any, arg:any) => {
        try {
            preview_window.hide();
            preview_window.loadURL(arg);
            preview_window.show();
        } catch (error) {
            //console.log(error);
        }
    });

    ipcMain.on('render-project', (error: any) => {
        try {
            preview_window.reload();
        } catch (error) {
            //console.log(error);
        }
    });

    ipcMain.on('print-it', (error:any, event:any) => {
        //console.log(event)
        var window = new BrowserWindow({show:false, title: "Scode - Print - Preview"});
        let fsystem = require('fs');
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