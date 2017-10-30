/**
 * External modules + node modules
 */
const app = require('electron').remote;
const remote = app;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;
const dialog = app.dialog;
const fs = require("fs");
const os = require('os');
const { spawn } = require('child_process');
const process = require('process');
const { ipcRenderer } = require('electron');

/**
 * SCode internal modules
 */
var editor = require(__dirname + "/js/editor").init();
var terminal = require(__dirname + "/js/terminal");
var tabmanager = require(__dirname + "/js/tabs");


/**
 * SCode init
 */
var tabs = {}, id = 0, active_document = null, settings, folder, folder_status, language, first_use;

$(document).ready(function () {
    first_use = editor.verifyInstallation()
    settings = editor.load('settings');
    folder = editor.load('working_dir');
    folder_status = editor.load('folders');
    editor.load("tabs");
    editor.setStyle();
    language = editor.load("translations")
    editor.addFunctionalities();
});