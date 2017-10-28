const app = require('electron').remote;
const remote = app;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;
const dialog = app.dialog;
const fs = require("fs");
const os = require('os');
const { spawn } = require('child_process');
const process = require('process');
//const LintStream = require('jslint').LintStream; //Not that useful now
const { ipcRenderer } = require('electron');
function encode_utf8(s) {
    return unescape(encodeURIComponent(s));
  }
  
  function decode_utf8(s) {
    return decodeURIComponent(escape(s));
  }
var tabs = {};
var folder_status = {};
var id = 0;
var active_document = null;
var folder = null;
/*
Settings can be modified in the file {user_dir}/.scode/settings.json
*/
var settings = {
    always_show_workdir_and_opened_files: true,
    language: "en.json",
    theme: "themes/scode-dark.css"
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
try {
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
            try {
                settings = JSON.parse(fs.readFileSync(os.homedir() + "/.scode/settings.json", "utf-8"));
            } catch (error) {
                alert(error);
                alert('SCode a rencontré une erreur : le fichier de préférences est corrompu.');
                if (confirm('Rétablir les paramètres par défaut ?')) {
                    if (fs.writeFileSync(os.homedir() + "/.scode/settings.json", JSON.stringify(settings), "utf-8") == null) {
                        alert('SCode est de nouveau fonctionnel !');
                    } else {
                        alert('Une erreur est survenue lors de la sauvegarde du fichier de configuration.')
                    }
                    alert('Redémarrage de SCode');
                    var xwindow = app.getCurrentWindow();
                    xwindow.reload();
                } else {
                    alert('Vous pouvez encore modifier le fichier de configuration en appuyant sur Ctrl+Maj+S')
                }

            }
        }

        /**
         * Folders that are opened
         */

        if (fs.existsSync(os.homedir() + "/.scode/folder_status.json")) {
            try {
                folder_status = JSON.parse(fs.readFileSync(os.homedir() + "/.scode/folder_status.json", "utf-8"));
            } catch (error) {
                alert(error);
                alert('SCode a rencontré une erreur : le fichier de préférences est corrompu.');
                if (confirm('Rétablir les paramètres par défaut ?')) {
                    if (fs.writeFileSync(os.homedir() + "/.scode/folder_status.json", JSON.stringify(folder_status), "utf-8") == null) {
                        alert('SCode est de nouveau fonctionnel !');
                    } else {
                        alert('Une erreur est survenue lors de la sauvegarde du fichier de configuration.')
                    }
                    alert('Redémarrage de SCode');
                    var xwindow = app.getCurrentWindow();
                    xwindow.reload();
                } else {
                    alert('Vous pouvez encore modifier le fichier de configuration en appuyant sur Ctrl+Maj+S')
                }

            }
        }

        /*
        We try to open the files that were opned the last time
        */

        if (fs.existsSync(os.homedir() + "/.scode/files.json")) {
            scode_last_files = JSON.parse(fs.readFileSync(os.homedir() + "/.scode/files.json", "utf-8"));
            $(document).ready(function () {
                for (var i = 0; i < Object.keys(scode_last_files).length; i++) {
                    var file = Object.keys(scode_last_files)[i];
                    try {
                        if (fs.existsSync(file)) {
                            newTab(file);
                        }
                    } catch (error) {
                        alert(error);
                    }
                }
            });
        }

        var first_use = false;
    } else {
        var first_use = true;
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
} catch (error) {

}


/**
 * Adding Theme
 */

if (settings.theme != undefined) {
    var css_file_url = settings.theme;
} else {
    var css_file_url = "style.css";
}

$(document).ready(() => {
    var link = document.body.appendChild(document.createElement('link'));
    link.href = css_file_url;
    link.rel = "stylesheet";
});

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

    /**
     * Tanslations
     */

    $('#e_open').html(language.openAFile);
    $('#show_working_dir').html(language.workingDir);
    $('#show_opened_files').html(language.openedFiles)

    /* ---       Window options      ---  */
    $("#closethis").get(0).onclick = function () {
        /* --- Here, we save the opened files --- */
        try {
            fs.writeFileSync(os.homedir() + "/.scode/files.json", JSON.stringify(tabs), "utf-8");
        } catch (error) {
            alert(error);
        }
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
            if (e.shiftKey) {
                if (e.key.toLowerCase() == "s") {
                    newTab(os.homedir() + "/.scode/settings.json");
                } else if (e.key.toLowerCase() == "p") {
                    var command_prompt = scode_fast_action();
                    command_prompt.show((response, element) => {
                        for (var i = 0; i < commands.length; i++) {
                            var c = commands[i];
                            if (c[1] == response) {
                                return c[2]();
                            }
                        }
                        return false;
                    }, "", commands);
                }
            } else if (e.key == "o") {
                openFile();
            } else if (e.keyCode == 192) {
                var term = $(document.body).child("div");
                term.css('z-index', 100);
                term.css('position', "fixed");
                term.css('overflow', "hidden");
                term.css('bottom', "25px");
                term.css('height', "250px");
                term.css('left', "0");
                term.css('right', "0");
                term.css('background', "rgb(34,34,34)");
                var x_term = term;
                var term_resizer = term.child("div");

                var m_pos;
                function resize(e){
                    var parent = resize_el.parentNode;
                    var dx = m_pos - e.y;
                    m_pos = e.y;
                    parent.style.height = (parseInt(getComputedStyle(parent, '').height) + dx) + "px";
                }
                
                var resize_el = term_resizer.get(0);
                resize_el.addEventListener("mousedown", function(e){
                    m_pos = e.y;
                    document.addEventListener("mousemove", resize, false);
                }, false);
                document.addEventListener("mouseup", function(){
                    document.removeEventListener("mousemove", resize, false);
                }, false);

                term_resizer.css('position', "absolute");
                term_resizer.css('top', "0px");
                term_resizer.css('left', "0");
                term_resizer.css('right', "0");
                term_resizer.css('background', "#ccc");
                term_resizer.css('height', "4px");
                term_resizer.css('cursor', "n-resize");

                term = term.child('textarea');
                term.css("color", "white");
                term.css('background', "transparent");
                term.css('height', "calc(100% - 4px)");
                term.css('width', "100%");
                term.css('position', "absolute");
                term.css('bottom', "0");
                term.css('top', "4px");
                term.css('left', "0");
                term.css('right', "0");

                var command_prompt = spawn(process.env.ComSpec, [], {cwd:folder[0]})
                command_prompt.stdout.setEncoding('utf8')
                var last_text = "";
                term.get(0).value = last_text
                term.get(0).focus();
                term.get(0).selectionStart = term.get(0).selectionEnd = term.get(0).value.length;
                term.get(0).focus();
                command_prompt.stdout.on('data', (data) => {
                    data = data.replace(/�/g, "");
                    console.log("> " + data)
                    last_text = last_text + data;
                    console.log(">>" + last_text);
                    term.get(0).value = last_text
                    term.get(0).focus();
                    term.get(0).selectionStart = term.get(0).selectionEnd = term.get(0).value.length;
                    term.get(0).focus();
                    last_text = term.get(0).value;
                });

                command_prompt.stderr.on('data', (data) => {
                    console.log(`stderr: ${data}`);
                });

                command_prompt.on('close', (code) => {
                    console.log(`child process exited with code ${code}`);
                    x_term.remove();
                });
                term.get(0).onkeydown = function (event) {

                    if (event.keyCode == 13) {
                        var command = this.value.replace(last_text, "");
                        command_prompt.stdin.write(command + "\n");
                        return false;
                    }
                }
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
            } else if (e.key == "p") {
                var window = app.getCurrentWindow();
                var id = tabs[active_document].id;
                ipcRenderer.send('print-it', { content: $('#' + id + " .code-editor-colors").html() });
                //window.webContents.print();
            } else if (e.keyCode == 116) {
                var window = app.getCurrentWindow();
                window.reload();
            } else if (e.key == "g") {
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
            $('#opened_files').html('<b>' + language.filesOpenedInScode + '</b><br />');
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
    if (first_use) {
        newTab(__dirname + "/res/readme.md", true);
    }
    if (settings["always_show_workdir_and_opened_files"] == true) {
        $('.tabmanager').get(0).style.left = "300px";
        $('#working_dir').get(0).style.top = "29px";
        $('#working_dir').get(0).style.left = "0";
        $('#working_dir').get(0).style.width = "250px";
        $('#working_dir').get(0).style.maxWidth = "250px";
        $('#working_dir').get(0).style.background = "transparent";
        $('#working_dir').get(0).style.boxShadow = "0px 0px 0px transparent";
        $('#show_working_dir').click()
    }
});