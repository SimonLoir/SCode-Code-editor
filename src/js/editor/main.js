/**
 * Creates a new scode instance
 */
exports.init = function () {
    /**
     * We define the default settings for scode. 
     */
    this.base_settings = {
        always_show_workdir_and_opened_files: true,
        language: "en.json",
        theme: "themes/scode-dark.css"
    }

    /**
     * It searches for the .scode folder 
     */
    this.verifyInstallation = function () {
        if (fs.existsSync(os.homedir() + "/.scode")) {
            //we could see if there is any issue with the files
            return false;
        } else {
            var error = false;
            try {
                fs.mkdirSync(os.homedir() + "/.scode")
            } catch (error) {
                alert(error)
                error = true;
            }

            if (error == false) {
                fs.writeFileSync(os.homedir() + "/.scode/settings.json", JSON.stringify(this.base_settings), "utf-8");
            }
            return true;
        }
    }

    /**
     * This function loads something. 
     * Possible values for toLoad : 
     * "settings" : loads scode settings
     * "tabs" : loads tabs that were opened last time
     * "folders" : folders that where opened in scode
     * "working_dir" : the working directory that was opened in scode
     */
    this.load = function (toLoad) {
        if (toLoad == "settings") {
            if (fs.existsSync(os.homedir() + "/.scode/settings.json")) {
                try {
                    return JSON.parse(fs.readFileSync(os.homedir() + "/.scode/settings.json", "utf-8"));
                } catch (error) {
                    alert('SCode a rencontré une erreur : le fichier de préférences est corrompu.');
                    if (confirm('Rétablir les paramètres par défaut ?')) {
                        if (fs.writeFileSync(os.homedir() + "/.scode/settings.json", JSON.stringify(this.base_settings), "utf-8") == null) {
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
            } else {
                return this.base_settings;
            }
        } else if (toLoad == "folders") {
            if (fs.existsSync(os.homedir() + "/.scode/folder_status.json")) {
                try {
                    return JSON.parse(fs.readFileSync(os.homedir() + "/.scode/folder_status.json", "utf-8"));
                } catch (error) {
                    return {};
                }
            } else {
                return {};
            }
        } else if (toLoad == "working_dir") {
            if (fs.existsSync(os.homedir() + "/.scode/folder.json")) {
                return JSON.parse(fs.readFileSync(os.homedir() + "/.scode/folder.json", "utf-8"));
            } else {
                return null;
            }
        } else if (toLoad == "tabs") {
            var ed = this;
            if (fs.existsSync(os.homedir() + "/.scode/files.json")) {
                scode_last_files = JSON.parse(fs.readFileSync(os.homedir() + "/.scode/files.json", "utf-8"));
                for (var i = 0; i < Object.keys(scode_last_files).length; i++) {
                    var file = Object.keys(scode_last_files)[i];
                    try {
                        if (fs.existsSync(file)) {
                            ed.newTab(file);
                        }
                    } catch (error) {
                        alert(error);
                    }
                }
            }
        } else if (toLoad == "translations") {
            if (fs.existsSync(__dirname + "/../../translations/" + settings.language)) {
                return JSON.parse(fs.readFileSync(__dirname + "/../../translations/" + settings.language, "utf-8"));
            } else {
                return JSON.parse(fs.readFileSync(__dirname + "/../../translations/en.json", "utf-8"));
            }
        }

    }

    /**
     * Sets the style of the editor
     */
    this.setStyle = function () {
        if (settings.theme != undefined) {
            var css_file_url = settings.theme;
        } else {
            var css_file_url = "style.css";
        }
        var link = document.body.appendChild(document.createElement('link'));
        link.href = css_file_url;
        link.rel = "stylesheet";
    }

    /**
     * Add functionalities
     */
    this.addFunctionalities = function () {
        var ed = this;
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
        $('#togglefullscreen').click(function () {
            var window = app.getCurrentWindow()
            if(window.isFullScreen() == true){
                window.setFullScreen(false);
                $('#togglefullscreen i').removeClass('icon-resize-small');                
                $('#togglefullscreen i').addClass('icon-resize-full');

            } else {
                window.setFullScreen(true);
                $('#togglefullscreen i').removeClass('icon-resize-full');                                
                $('#togglefullscreen i').addClass('icon-resize-small');
            }
        });
        /* --- [end] Window options [end] --- */

        /* --- Keyboard shortcuts --- */
        document.body.onkeydown = function (e) {
            if (e.ctrlKey) {
                if (e.shiftKey) {
                    if (e.key.toLowerCase() == "s") {
                        ed.newTab(os.homedir() + "/.scode/settings.json");
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
                    newTerminal();
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
            }else{
                if(e.keyCode == 122){
                    console.log(e)
                    $('#togglefullscreen').click();
                    return false;
                }else{
                    console.log(e.key)
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
                    $('#opened_files').child("span").html(file).click(function (){
                        editor.newTab(this.innerText)
                    });
                    $('#opened_files').child('br');
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
                    //console.log(settings["always_show_workdir_and_opened_files"]);
                }
            } else {
                ed.updateWorkingDir();
            }
        });
        if (first_use) {
            ed.newTab(__dirname + "/res/readme.md", true);
        }
        if (settings["always_show_workdir_and_opened_files"] == true) {
            $('.tabmanager').get(0).style.left = "300px";
            $('#working_dir').get(0).style.top = "31px";
            $('#working_dir').get(0).style.left = "0";
            $('#working_dir').get(0).style.width = "250px";
            $('#working_dir').get(0).style.background = "transparent";
            $('#working_dir').get(0).style.boxShadow = "0px 0px 0px transparent";
            $('#show_working_dir').click();
            var wd_resizer = $('#working_dir').child("div");
            
                var m_pos;
                function resize(e) {
                    var parent = resize_el.parentNode;
                    var dx = m_pos - e.x;
                    m_pos = e.x;
                    var w = (parseInt(getComputedStyle(parent, '').width) - dx);
                    parent.style.width =  w + "px";
                    $('.tabmanager').get(0).style.left = (w + 50) + "px";
            
                }
            
                var resize_el = wd_resizer.get(0);
                resize_el.addEventListener("mousedown", function (e) {
                    m_pos = e.x;
                    document.addEventListener("mousemove", resize, false);
                }, false);
                document.addEventListener("mouseup", function () {
                    document.removeEventListener("mousemove", resize, false);
                }, false);
            
                wd_resizer.css('position', "absolute");
                wd_resizer.css('top', "0px");
                wd_resizer.css('right', "0");
                wd_resizer.css('bottom', "0");
                wd_resizer.css('width', "10px");
                wd_resizer.css('padding', "0");
                wd_resizer.css('margin', "0");
                wd_resizer.css('cursor', "w-resize");
        }

        $('#git').html('<b>Git</b><br /><br />');
        $('#git').child("button").html('push').click(function () {
            git.push();
            $('#git_status').click();
        });
        var form = $('#git').child('div').child('form');
        var commit_message = form.child('textarea');
        commit_message.get(0).placeholder = "Message (Enter to commit)";

        commit_message.get(0).onkeydown = function (event) {
            if (event.keyCode === 13) {
                commit_message.get(0).style.display = "none";
                git.commit(commit_message.get(0).value, function () {
                    commit_message.get(0).style.display = "block";
                    alert(language.commitDoneSuccesfully);
                    git.status(git.updateGitPanel);
                }, function () {
                    commit_message.get(0).style.display = "block";
                })
                commit_message.get(0).value = "";

                return false;
            }

        }
        git.git_receiver = $('#git').child('div').html("<br />Aucun dépôt git n'est initialisé. Utilisez la commande git init dans le terminal ou utilisez la commande git clone pour cloner un dépôt git distant.<br />");

    }

    /**
    * Updates the working directory panel
    */
    this.updateWorkingDir = function (e) {
        if (e == true) {
            folder_status = {};
        }
        $('#working_dir').get(0).style.display = "block";
        $('#working_dir').html('<b>' + language.workingDir + ' :</b><br />');
        if (folder == null) {
            $('#working_dir').child('span').html(language.requireToOpenAWDir);
        } else {
            folder = this.getDirArray(folder[0]);
            this.createWorkingDir([folder], $('#working_dir'), e);
        }
    }

    /**
    * Shows the directory content when clicking on the directory item
    * @param {Object} e The ExtJs object on which we want to add the event 
    * @param {Object} x The ExtJs object that we want to diplay
     */
    this.addClickOnDir = function (e, x, folder) {
        if (folder != undefined) {
        } else {
            folder = "::undefined"
        }
        x.get(0).style.display = "none";
        e.get(0).onclick = function () {
            if (x.get(0).style.display == "block") {
                folder_status[folder] = false;
                x.get(0).style.display = "none";
            } else {
                folder_status[folder] = true;
                x.get(0).style.display = "block";
            }
            try {
                var fs = require('fs');
                fs.writeFileSync(os.homedir() + "/.scode/folder_status.json", JSON.stringify(folder_status), "utf-8");
            } catch (error) {
                //console.log("error : " + error);
            }
            //console.log(folder_status, JSON.stringify(folder_status))
        };
        if (folder_status[folder] == true) {
            x.get(0).style.display = "block";
        } else {
            x.get(0).style.display = "none";
        }
    }

    /**
    * Creates the working directory element 
    * @param {Array} dir the directory has an array 
    * @param {Object} element the extjs object on which we want to create the directory
    */
    this.createWorkingDir = function (dir, element, first) {
        load_projet_setting();
        var ed = this;
        var files = [];
        var folders = [];
        for (var i = 0; i < dir.length; i++) {
            var e = dir[i];
            if (typeof e == 'string') {
                files.push(e);
            } else {
                folders.push(e);
            }
        }

        for (var i in folders) {
            if (folders.hasOwnProperty(i)) {
                let folder = folders[i];
                let folder_replace = folder[0].replace(/\\/g, "/");
                let folder_split_slash = folder_replace.split("/");
                let folder_real_name = folder_split_slash[folder_split_slash.length - 1];
                if (folder_real_name != ".git") {

                    let clicker = element.child('span').html('<i class="icon-folder"></i> ' + folder_real_name);
                    clicker.get(0).style.cursor = "pointer";
                    clicker.get(0).setAttribute("data-path", folder[0])
                    clicker.get(0).setAttribute("data-name", folder_real_name)
                    clicker.get(0).addEventListener('contextmenu', function () {
                        var menu = new Menu();
                        var menu_item_1 = new MenuItem({
                            label: language.newFile,
                            click: () => {
                                var fa = new scode_fast_action();
                                var file = this.getAttribute('data-path');
                                if (tabs[file] == undefined) {
                                    var x_path = require('path');
                                    var fs = require('fs');

                                    fa.show((new_name, element) => {
                                        if (fs.existsSync(file + "/" + new_name)) {
                                            element.get(0).style.background = "crimson";
                                            return false;
                                        } else {
                                            fs.writeFileSync(file + "/" + new_name, "");
                                            ed.updateWorkingDir();
                                            return true;
                                        }
                                    }, language.newFile);
                                }
                            }
                        });

                        var menu_item_2 = new MenuItem({
                            label: language.newFolder,
                            click: () => {
                                var fa = new scode_fast_action();
                                var file = this.getAttribute('data-path');
                                if (tabs[file] == undefined) {
                                    var x_path = require('path');
                                    var fs = require('fs');

                                    fa.show((new_name, element) => {
                                        if (fs.existsSync(file + "/" + new_name)) {
                                            element.get(0).style.background = "crimson";
                                            return false;
                                        } else {
                                            fs.mkdirSync(file + "/" + new_name);
                                            ed.updateWorkingDir();
                                            return true;
                                        }
                                    }, language.newFolder);
                                }
                            }
                        });

                        var menu_item_3 = new MenuItem({
                            label: "Renommer",
                            click: () => {
                                var fa = new scode_fast_action();
                                var file = this.getAttribute('data-path');
                                if (tabs[file] == undefined) {
                                    var x_path = require('path');
                                    var fs = require('fs');

                                    fa.show((new_name, element) => {
                                        if (fs.existsSync(x_path.dirname(file) + "/" + new_name)) {
                                            element.get(0).style.background = "crimson";
                                            return false;
                                        } else {
                                            //console.log(file, x_path.dirname(file) + "/" + new_name + "/");
                                            fs.rena
                                            fs.renameSync(file, x_path.dirname(file) + "/" + new_name + "/");
                                            ed.updateWorkingDir();
                                            return true;
                                        }
                                    }, this.getAttribute('data-name'));
                                } else {
                                    alert('Please close the tab before renaming the file.');
                                }
                            }
                        });

                        menu.append(menu_item_1);
                        menu.append(menu_item_2);
                        menu.append(menu_item_3);
                        menu.popup(remote.getCurrentWindow());

                    });
                    let child = element.child("div");
                    element.child('br');
                    ed.createWorkingDir(folder[1], child);
                    ed.addClickOnDir(clicker, child, folder[0]);
                    if (first == true) {
                        clicker.click();
                    }

                } else {
                    //console.log(first, folder_real_name)
                }
            }
        }

        for (var i in files) {
            if (files.hasOwnProperty(i)) {
                var file = files[i];
                var file_replace = file.replace(/\\/g, "/");
                var file_split_slash = file_replace.split("/");
                var file_real_name = file_split_slash[file_split_slash.length - 1];
                var x = element.child('span').html('<i class="icon-file"></i> ' + file_real_name + "<br />");
                x.get(0).setAttribute('data-file-path', file);
                x.get(0).setAttribute('filename', file_real_name);
                x.get(0).style.cursor = "pointer";
                x.click(function () {
                    ed.newTab(this.getAttribute('data-file-path'));
                });

                x.get(0).addEventListener('contextmenu', function () {
                    var menu = new Menu();
                    var menu_item_1 = new MenuItem({
                        label: "Ouvrir le fichier",
                        click: () => {
                            ed.newTab(this.getAttribute('data-file-path'));
                        }
                    });

                    var menu_item_2 = new MenuItem({
                        label: "Supprimer",
                        click: () => {
                            fs.unlinkSync(this.getAttribute('data-file-path'));
                            alert('Fichier supprimé');
                            ed.updateWorkingDir();
                        }
                    });

                    var menu_item_3 = new MenuItem({
                        label: "Renommer",
                        click: () => {
                            var fa = new scode_fast_action();
                            var file = this.getAttribute('data-file-path');
                            if (tabs[file] == undefined) {
                                var x_path = require('path');
                                var fs = require('fs');

                                fa.show((new_name, element) => {
                                    if (fs.existsSync(x_path.dirname(file) + "/" + new_name)) {
                                        element.get(0).style.background = "crimson";
                                        return false;
                                    } else {
                                        fs.renameSync(file, x_path.dirname(file) + "/" + new_name);
                                        ed.updateWorkingDir();
                                        return true;
                                    }
                                }, this.getAttribute('filename'));
                            } else {
                                alert('Please close the tab before renaming the file.');
                            }
                        }
                    });

                    menu.append(menu_item_1);
                    menu.append(menu_item_2);
                    menu.append(menu_item_3);
                    menu.popup(remote.getCurrentWindow());
                });

            }
        }
    }

    /**
    * Shows an openfile dialog
    */
    this.openFile = function () {
        ed = this;
        dialog.showOpenDialog({ defaultPath: __dirname, title: "Ouvrir un fichier dans SCode", properties: ["multiSelections", "openFile"] }, (filenames) => {
            if (filenames == undefined) return;
            filenames.forEach(function (element) {
                ed.newTab(element);
            }, this);
        });
    }

    /**
    * Shows an open directory dialog
    */
    this.openFolder = function () {
        var ed = this;
        dialog.showOpenDialog({ defaultPath: __dirname, title: "Ouvrir un dossier dans SCode", properties: ["openDirectory"] }, (folders) => {

            if (folders != null) {
                folder = ed.getDirArray(folders[0]);
                //folder = JSON.parse(fs.readFileSync(os.homedir() + "/.scode/folder.json", "utf-8"));
                let folder_json = JSON.stringify(folder);

                try {
                    fs.writeFileSync(os.homedir() + "/.scode/folder.json", folder_json, "utf-8");
                } catch (error) {
                    alert(error)
                }
                ed.updateWorkingDir(true);
                load_projet_setting();
            }

        });
    }

    /**
    * Gets an array of all the files and directories in a directory
    * @param {String} folder The directory
    */
    this.getDirArray = function (folder) {

        var array = [];

        var dir = fs.readdirSync(folder);

        if (dir != null) {
            for (var i = 0; i < dir.length; i++) {
                var e = dir[i];
                if (fs.statSync(folder + "/" + e).isDirectory()) {
                    try {
                        array.push(this.getDirArray(folder + "/" + e));
                    } catch (error) {

                    }
                } else {
                    array.push(folder + "/" + e);
                }
            }
        }

        return [folder, array]
    }

    this.newTab = function (a, b) {
        tabmanager.newTab(a, b)
    }

    return this;
}