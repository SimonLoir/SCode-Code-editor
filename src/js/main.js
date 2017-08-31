const app = require('electron').remote;
const remote = app;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;
const dialog = app.dialog;
const fs = require("fs");
const os = require('os');
const LintStream = require('jslint').LintStream;
const { ipcRenderer } = require('electron');

var tabs = {};
var id = 0;
var active_document = null;
var folder = null;
var settings = {
    always_show_workdir_and_opened_files: false
};
var project_settings = {};
var lintErrors = [];

String.prototype.insertAt = function (index, string) {
    return this.substr(0, index) + string + this.substr(index);
}

if (fs.existsSync(os.homedir() + "/.scode")) {
    if (fs.existsSync(os.homedir() + "/.scode/folder.json")) {
        folder = JSON.parse(fs.readFileSync(os.homedir() + "/.scode/folder.json", "utf-8"));

        $(document).ready(function () {
            createWorkingDir(folder[1], $('#working_dir'));
            load_projet_setting();
        });
    }
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

function load_projet_setting() {
    if (fs.existsSync(folder[0] + "/.scode.json")) {

        project_settings = JSON.parse(fs.readFileSync(folder[0] + "/.scode.json"), 'utf-8');
        if (project_settings.address != undefined) {
            alert('Rechargement automatique activé pour le projet. Pour le désactiver, modifiez .scode.json');
            ipcRenderer.send('render-project-reg', project_settings.address);
        }
    }
}
$(document).ready(function () {

    try {
        //newTab(__dirname + '/../node_modules/jslint/LICENSE');
    } catch (error) {
        alert('error')
    }

    $("#closethis").get(0).onclick = function () {
        var window = app.getCurrentWindow();
        window.close();
    }

    $('#minthis').click(function () {
        var window = app.getCurrentWindow();
        window.minimize();
    });

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