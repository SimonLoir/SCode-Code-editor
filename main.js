const electron = require('electron');
const app = electron.app;
const bw = electron.BrowserWindow;
const path = require('path');
const url = require('url');

app.on("ready", function () {
    const screen = electron.screen;
    var main_window = new bw({frame:false});

    main_window.maximize();
    main_window.loadURL(url.format({
        pathname: path.join(__dirname, "src/index.html"),
        protocol: "file:",
        slashes: true
    }));
    
    main_window.on("closed", function () {
        main_window = null;
        app.exit();
    });

    app.on('window-all-closed', function() {
        if (process.platform != 'darwin')
          app.quit();
    });
});