const app = require('electron').remote;
const remote = app;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;
const dialog = app.dialog;
const fs = require("fs");
const os = require('os');
//const LintStream = require('jslint').LintStream; //Not that useful now
const { ipcRenderer } = require('electron');

var tabs = {};
var id = 0;
var active_document = null;
var folder = null;
/*
Settings can be modified in the file {user_dir}/.scode/settings.json
*/
var settings = {
    always_show_workdir_and_opened_files: false, 
    language: "en.json"
};
/*
Project settings are defined inside the .scode.json file that must be created at the root of the working dir
*/
var project_settings = {};
//var lintErrors = [];//This will be used to store lint errors

/*
This method is used to specify the cursor position inside the text but could be used for other things.
*/
String.prototype.insertAt = function (index, string) {
    return this.substr(0, index) + string + this.substr(index);
}

/*
We try to set the working directory and the settings. If scode folder doesn't exist, we create it.
*/
if (fs.existsSync(os.homedir() + "/.scode")) {
    /*
    We try to find the working directory 
    */
    if (fs.existsSync(os.homedir() + "/.scode/folder.json")) {
        folder = JSON.parse(fs.readFileSync(os.homedir() + "/.scode/folder.json", "utf-8"));

        $(document).ready(function () {
            createWorkingDir(folder[1], $('#working_dir'));
            load_projet_setting();
        });
    }
    /*
    We try to import the settings from the settings file
    */
    if (fs.existsSync(os.homedir() + "/.scode/settings.json")) {
        settings = JSON.parse(fs.readFileSync(os.homedir() + "/.scode/settings.json", "utf-8"));
    }
} else {
    var error = false;
    try {
        fs.mkdirSync(os.homedir() + "/.scode")
    } catch (error) {
        console.log(error);
        error = true;
    }

    if (error == false) {
        fs.writeFileSync(os.homedir() + "/.scode/settings.json", JSON.stringify(settings), "utf-8");
    }
}

var language = JSON.parse(fs.readFileSync(__dirname + "/translations/" + settings.language, "utf-8"));

/*
We try to load the settings of the current project
*/
function load_projet_setting() {
    if (fs.existsSync(folder[0] + "/.scode.json")) {

        project_settings = JSON.parse(fs.readFileSync(folder[0] + "/.scode.json"), 'utf-8');
        if (project_settings.address != undefined) {
            alert(language.liveReloadEnabled);
            ipcRenderer.send('render-project-reg', project_settings.address);
        }
    }
}

/*
When the document is loaded completely
*/
$(document).ready(function () {

    /* ---       Window options      ---  */
    $("#closethis").get(0).onclick = function () {
        var window = app.getCurrentWindow();
        window.close();
    }
    $('#minthis').click(function () {
        var window = app.getCurrentWindow();
        window.minimize();
    });
    /* --- [end] Window options [end] --- */
    
    /* --- Keyboard shortcuts --- */
    document.body.onkeydown = function (e) {
        if (e.ctrlKey) {
            if (e.key == "o") {
                openFile();
            } else if (e.key == "s") {

                if (tabs[active_document] != undefined) {
                    var id = tabs[active_document].id;

                    fs.writeFile(active_document, $('#' + id + " .code-editor").get(0).value, "utf-8", (err) => {
                        if (err)
                            $('#status').html("error while saving");
                        else
                            $('#status').html("saved");

                        setTimeout(function () {
                            $('#status').html("~");
                        }, 500);

                        git.status(git.updateGitPanel);
                    });
                }

                if (project_settings.address != undefined) {
                    ipcRenderer.send('render-project');
                }
            } else if (e.keyCode == 116) {
                var window = app.getCurrentWindow();
                window.reload();
            }else if(e.key == "g"){
                $('#git_status').click();
                $('#git textarea').get(0).focus();
            }
        } 
    }
    /* --- [end] Keyboard Shortcuts [end] --- */

    $('.tabmanager').click(function () {
        if (settings["always_show_workdir_and_opened_files"] == false || settings["always_show_workdir_and_opened_files"] == undefined) {
            $('#opened_files').get(0).style.display = "none";
            $('#working_dir').get(0).style.display = "none";
            $('#git').get(0).style.display = "none";            
        }
    });

    $('#show_opened_files').click(function () {
        if ($('#opened_files').get(0).style.display == "block") {
            $('#opened_files').get(0).style.display = "none";
        } else {
            $('#opened_files').get(0).style.display = "block";
            $('#opened_files').html('<b>Fichiers ouverts dans SCode</b><br />');
            var files = Object.keys(tabs);
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $('#opened_files').child("span").html(file + '<br />');
            }
        }
    });

    $('#git_status').click(function () {
        if ($('#git').get(0).style.display == "block") {
            $('#git').get(0).style.display = "none";
        } else {
            git.status(git.updateGitPanel);            
            $('#git').get(0).style.display = "block";
        }
    });

    $('#show_working_dir').click(function () {
        if ($('#working_dir').get(0).style.display == "block") {
            if (settings["always_show_workdir_and_opened_files"] == false || settings["always_show_workdir_and_opened_files"] == undefined) {
                $('#working_dir').get(0).style.display = "none";
            } else {
                console.log(settings["always_show_workdir_and_opened_files"]);
            }
        } else {
            updateWorkingDir();
        }
    });
    newTab(__dirname + "/res/readme.md", true);
    if (settings["always_show_workdir_and_opened_files"] == true) {
        $('.tabmanager').get(0).style.left = "300px";
        $('#working_dir').get(0).style.top = "29px";
        $('#working_dir').get(0).style.left = "0";
        $('#working_dir').get(0).style.width = "250px";
        $('#working_dir').get(0).style.maxWidth = "250px";
        $('#working_dir').get(0).style.background = "transparent";
        $('#working_dir').get(0).style.borderRight = "1px solid rgb(24,24,24)";
        $('#working_dir').get(0).style.boxShadow = "0px 0px 0px transparent";
        $('#show_working_dir').click()
    }
});