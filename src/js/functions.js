window.alert = function (text) {
    new Notification("SCode", {
        body: text
    });
}


function updateWorkingDir() {
    $('#working_dir').get(0).style.display = "block";
    $('#working_dir').html('<b>Espace de travail :</b><br />');
    if (folder == null) {
        $('#working_dir').child('span').html("Vous n'avez pas encore ouvert un fichier de travail");
    } else {

        createWorkingDir(folder[1], $('#working_dir'));
    }
}

function addClickOnDir(e, x){
    x.get(0).style.display = "none";
    e.click(function () {
        if(x.get(0).style.display == "block"){
            x.get(0).style.display = "none";
        }else{
            x.get(0).style.display = "block";
        }
    });
}


function createWorkingDir(dir, element) {
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
                
                let clicker = element.child('span').html("&#128449; " + folder_real_name);
                clicker.get(0).style.cursor = "pointer";
                let child = element.child("div");
                element.child('br');
                createWorkingDir(folder[1], child);
                addClickOnDir(clicker, child);

            }
        }
    }
    
    for (var i in files) {
        if (files.hasOwnProperty(i)) {
            var file = files[i];
            var file_replace = file.replace(/\\/g, "/");
            var file_split_slash = file_replace.split("/");
            var file_real_name = file_split_slash[file_split_slash.length - 1];
            var x = element.child('span').html("&#9165; " + file_real_name + "<br />");
            x.get(0).setAttribute('data-file-path', file);
            x.get(0).style.cursor = "pointer";
            x.click(function () {
                newTab(this.getAttribute('data-file-path'));
            });

        }
    }
}

function insertTextAtCursor(text) {
    var sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(text));
        }
    } else if (document.selection && document.selection.createRange) {
        document.selection.createRange().text = text;
    }
}


function getCaretPos(input) {
    // Internet Explorer Caret Position (TextArea)
    if (document.selection && document.selection.createRange) {
        var range = document.selection.createRange();
        var bookmark = range.getBookmark();
        var caret_pos = bookmark.charCodeAt(2) - 2;
    } else {
        // Firefox Caret Position (TextArea)
        if (input.setSelectionRange)
            var caret_pos = input.selectionStart;
    }

    return caret_pos;
}

function openFile() {
    dialog.showOpenDialog({ defaultPath: __dirname, title: "Ouvrir un fichier dans SCode", properties: ["multiSelections", "openFile"] }, (filenames) => {
        if (filenames == undefined) return;
        filenames.forEach(function (element) {
            newTab(element);
        }, this);
    });
}

function openFolder() {
    dialog.showOpenDialog({ defaultPath: __dirname, title: "Ouvrir un dossier dans SCode", properties: ["openDirectory"] }, (folders) => {

        if (folders != null) {
            folder = getDirArray(folders[0]);
            //folder = JSON.parse(fs.readFileSync(os.homedir() + "/.scode/folder.json", "utf-8"));
            let folder_json = JSON.stringify(folder);

            fs.writeFileSync(os.homedir() + "/.scode/folder.json", folder_json, "utf-8");
            updateWorkingDir();

        }

    });
}

function getDirArray(folder) {

    var array = [];

    var dir = fs.readdirSync(folder);

    if (dir != null) {
        for (var i = 0; i < dir.length; i++) {
            var e = dir[i];
            if (fs.statSync(folder + "/" + e).isDirectory()) {
                try {
                    array.push(getDirArray(folder + "/" + e));
                } catch (error) {

                }
            } else {
                array.push(folder + "/" + e);
            }
        }
    }

    return [folder, array]
}