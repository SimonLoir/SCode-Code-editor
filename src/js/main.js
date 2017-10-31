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
const beautify = require('js-beautify').js_beautify;
const beautify_html = require('js-beautify').html;
const beautify_css= require('js-beautify').css;
const marked = require('marked');
const path = require('path');
const emmet = require('emmet');

/**
 * SCode internal modules
 */
var editor = require(__dirname + "/js/editor").init();
var {newTerminal, updateTerms, createTerminalsList} = require(__dirname + "/js/terminal");
var tabmanager = require(__dirname + "/js/tabs");
var build_tools = require(__dirname + "/js/build-tools").init();
var highlighting = require(__dirname + "/js/highlighting").init();
var git = require(__dirname + "/js/git").init();

/**
 * SCode init
 */
var tabs = {}, id = 0, project_settings, active_document = null, settings, folder, folder_status, language, first_use,terminal_last_id = 0,terms = {};

$(document).ready(function () {
    first_use = editor.verifyInstallation()
    settings = editor.load('settings');
    folder = editor.load('working_dir');
    folder_status = editor.load('folders');
    editor.load("tabs");
    editor.setStyle();
    language = editor.load("translations")
    editor.addFunctionalities();
    load_projet_setting();
    updateTerms();
});

/**
 * These commands can be called from the command palette. 
 */
var commands = [
    ["Paramètres, settings", "settings", function () {
        editor.newTab(os.homedir() + "/.scode/settings.json");
    }],
    ["Scode reload", "reload", function () {
        var window = app.getCurrentWindow();
        window.reload();
    }],
    ['Toggle git panel', 'git', function() {
        $('#git_status').click();
        $('#git textarea').get(0).focus();
    }],
    ['Show help', 'help', function() {
        editor.newTab('src/res/readme.md', true);
    }],
    ['New Terminal', 'scode-new-terminal', function() {
        newTerminal();
    }],
    ["Restore SCode", "scode-restore", function (){
        
            var xfs = require("fs");
            rmdir(os.homedir() + "/.scode/");
            alert("--- 100% ---")
            var window = app.getCurrentWindow();
            window.reload();

    }],
    ["Extensions - Dev", "scode-extension-dev", function () {
        folder = getDirArray(os.homedir() + "/.scode");
        //console.log(folder)
        let folder_json = JSON.stringify(folder);

        try {
            fs.writeFileSync(os.homedir() + "/.scode/folder.json", folder_json, "utf-8");
        } catch (error) {
            alert(error)
        }
        editor.updateWorkingDir();
        load_projet_setting();
    }]
]