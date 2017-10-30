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

/**
 * SCode init
 */
var tabs = {};
var folder_status = {};
var id = 0;
var active_document = null;
var folder = null;
var settings = editor.load('settings');
