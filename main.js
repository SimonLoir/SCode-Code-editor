const { app, globalShortcut } = require('electron');
const electron = require('electron');
const bw = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const { ipcMain } = require('electron');

app.on("ready", function () {
    globalShortcut.register("CommandOrControl+L", () => {

        var license = new bw({ frame: true, icon: path.join(__dirname, "src/logo.png") });
        license.loadURL(url.format({
            pathname: path.join(__dirname, "src/license.html"),
            protocol: "file:",
            slashes: true
        }));

    });

    globalShortcut.register("CommandOrControl+E", () => {

        var window = new bw({ frame: true, icon: path.join(__dirname, "src/logo.png") });
        window.loadURL(url.format({
            pathname: path.join(__dirname, "src/extensions-store/index.html"),
            protocol: "file:",
            slashes: true
        }));

    });

    var main_window = new bw({ frame: false, icon: path.join(__dirname, "src/logo.png") });

    main_window.loadURL(url.format({
        pathname: path.join(__dirname, "src/index.html"),
        protocol: "file:",
        slashes: true
    }));

    main_window.on("closed", function () {
        main_window = null;
        app.exit();
    });

    app.on('window-all-closed', function () {
        app.quit();
    });

    main_window.maximize();

    var preview_window = new bw({ show: false });

    ipcMain.on('render-project-reg', (error, arg) => {
        try {
            preview_window.hide();
            preview_window.loadURL(arg);
            preview_window.show();
        } catch (error) {
            console.log(error);
        }
    });

    ipcMain.on('render-project', (error) => {
        try {
            preview_window.reload(true);
        } catch (error) {
            console.log(error);
        }
    });

    ipcMain.on('print-it', (error, event) => {
        //console.log(event)
        var window = new bw({show:false, title: "Scode - Print - Preview"});
        let fsystem = require('fs');
        fsystem.writeFileSync("print.html", "<style>body{color:black;font-family:sans-serif, arial;}.default_color{color:rgb(20,20,20)}</style>" + event.content.replace('color:white', "color:rgb(20,20,20)"));
        window.once('ready-to-show', function () {
            console.log('show')
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