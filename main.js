const {app, globalShortcut} = require('electron');
const electron = require('electron');
const bw = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const {ipcMain} = require('electron');

app.on("ready", function () {

    globalShortcut.register("CommandOrControl+L", () => {

        var license = new bw({ frame: false, icon: path.join(__dirname, "src/logo.png") });    
        license.loadURL(url.format({
            pathname: path.join(__dirname, "src/license.html"),
            protocol: "file:",
            slashes: true
        }));

    });

    const screen = electron.screen;

    var welcome = new bw({ frame: false, icon: path.join(__dirname, "src/logo.png") });

    welcome.loadURL(url.format({
        pathname: path.join(__dirname, "src/launch.html"),
        protocol: "file:",
        slashes: true
    }));

    var main_window = new bw({ frame: false, show: false, icon: path.join(__dirname, "src/logo.png") });

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

    setTimeout(function () {
        main_window.maximize();
        main_window.show();
        welcome.close();
    }, 1500);
    
    var preview_window = new bw({show:false});

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
});