const app = require('electron').remote;
const dialog = app.dialog;
const fs = require("fs");

var tabs = {};
var id = 0;
var active_document = null;
var folder = null;

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
                array.push(getDirArray(folder + "/" + e));
            } else {
                array.push(folder + "/" + e);
            }
        }
    }

    return [folder, array]
}

function newTab(filename) {
    if(tabs[filename] != undefined){ return; }
    fs.readFile(filename, "utf-8", (err, data) => {
        if (err) {
            console.log(err);
            return;
        }

        tabs[filename] = {
            "title": filename,
            "id": "tab" + id
        }

        id++;


        var tab = $('.tabmanager').child('div').addClass('tab');
        tab.get(0).id = tabs[filename].id;

        var code_editor_colors = tab.child('div').addClass("code-editor-colors");

        var code_editor = tab.child('textarea').addClass("code-editor");
        code_editor.get(0).value = data;
        code_editor.get(0).setAttribute('contenteditable', "true");

        var xfilename = filename.replace(/\\/g, "/");

        var filename_split = xfilename.split('/');

        var real_file_name = filename_split[filename_split.length - 1];

        var frn_split = real_file_name.split('.');

        var xtab = $('.header').child('span').html(real_file_name);
        xtab.get(0).setAttribute('data-file', filename);
        xtab.get(0).id = "x" + tabs[filename].id;
        xtab.get(0).setAttribute('data-id', tabs[filename].id);

        active_document = filename;

        xtab.click(function () {
            var all_tab = document.querySelectorAll('.tab');
            for (var i = 0; i < all_tab.length; i++) {
                var xxtab = all_tab[i];
                xxtab.style.display = "none";

            }
            $('#' + this.getAttribute("data-id")).get(0).style.display = "block";
            active_document = this.getAttribute('data-file');
        });

        var cross = xtab.child('i').html("  ×");
        cross.get(0).setAttribute('data-id', tabs[filename].id);
        cross.get(0).setAttribute('data-file', filename);
        cross.click(function () {
            delete tabs[this.getAttribute('data-file')];
            $('#' + this.getAttribute("data-id")).remove();
            $('#x' + this.getAttribute("data-id")).remove();
            active_document = "~";
        });

        addFunc(code_editor.get(0), code_editor_colors.get(0), {
            extension: frn_split[frn_split.length - 1]
        });

        code_editor.get(0).onscroll = function () {
            if (code_editor_colors.get(0).scrollHeight >= this.scrollTop) {
                code_editor_colors.get(0).scrollTop = this.scrollTop;
            } else {
                this.scrollTop = code_editor_colors.get(0).scrollTop;
                return false;
            }

            if (code_editor_colors.get(0).scrollWidth >= this.scrollLeft) {
                code_editor_colors.get(0).scrollLeft = this.scrollLeft;
            } else {
                this.scrollLeft = code_editor_colors.get(0).scrollLeft;
                return false;
            }
        }

    });
}

function addFunc(ce, cec, file) {

    ce.oninput = function () {
        cec.innerHTML = codify(ce.value, file);
        $('#pos').html(getCaretPos(this) + '/' + ce.value.length);
    }

    ce.onkeyup = ce.oninput;
    ce.onkeydown = function (event) {
        if (event.keyCode === 9) {
            var v = this.value, s = this.selectionStart, e = this.selectionEnd;
            this.value = v.substring(0, s) + '    ' + v.substring(e);
            this.selectionStart = this.selectionEnd = s + 4;
            return false;
        }

    }

    cec.innerHTML = codify(ce.value, file);
}

function codify(text, file) {

    text = text.replace(/ /g, " ");

    if (file.extension == "css") {
        text = style_css_file(text);
    } else if (file.extension == "js") {
        text = text.replace(/\</g, "::scode~lt");
        text = style_js_file(text);
        text = "<span style=\"color:cornflowerblue;\">" + text + "</span>";
        text = text.replace(/\:\:scode\~lt/g, "&lt;");

    } else if (file.extension == "html" || file.extension == "html5" || file.extension == "htm" || file.extension == "svg") {
        text = text.replace(/\</g, "::scode~lt");
        text = text.replace(/\&/g, "<span>&</span>");
        text = style_html_file(text);
        text = text.replace(/\:\:scode\~lt/g, "&lt;");
    }


    text = text.replace(/(\r\n)/g, "<br /><br /><span></span>");
    text = text.replace(/(\n|\r)/g, "<br /><span></span>");

    return text + '<br /><br /><br />';
}
function style_html_file(text) {

    text = text.replace(/\:\:scode\~lt(.[^\<|\>]+)\>/g, function (m, $1) {
        return '&lt;<span style="color:cornflowerblue;">' + style_html_attributes($1) + '</span>>';
    });

    return text;

}

function style_html_attributes(attributes) {


    attributes = attributes.replace(/\s(.[^\s|\=]+)\=/g, (m, $1) => {

        return ' <span style="color:green;">' + $1 + '</span>=';

    });

    att = attributes.split(/(\s| )/g);

    if (html_tags[att[0]] != undefined || html_tags[att[0].replace('/', "")] != undefined) {
        //the element is an existing html element
    } else {
        attributes = attributes.replace(att[0], '<span style="color:red;">' + att[0] + '</span>');
    }

    return attributes;

}


function style_css_file(text) {

    text = text.replace(/(.[^\n|\r|\{|\}|\.]+)\{/g, function (m, $1) {
        return '<span style="color:yellow">' + $1 + '</span>{';
    });

    text = text.replace(/(.[^\n|\r|;|\;]+)\:(.+)\;/g, function (m, $1, $2) {
        return '<b style="color:red">' + $1 + '</b>:<span>' + $2 + ';</span>';
    });

    return text;
}

function style_js_file(text) {

    text = text.replace(/\&/g, "<span>&</span>");
    text = text.replace(/(\;|\=)/g, function (m, $1) {
        return '<span style=::scode~quotcolor:white;::scode~quot>' + $1 + '</span>';
    });
    text = text.replace(/(.[^\s|\.]+)\(/g, function (m, $1) {
        return '<span style=::scode~quotcolor:green;::scode~quot>' + $1 + '</span>(';
    });
    text = text.replace(/\(/g, '<span style=::scode~quotcolor:white;::scode~quot>(</span>');
    text = text.replace(/\)/g, '<span style=::scode~quotcolor:white;::scode~quot>)</span>');
    text = text.replace(/\{/g, '<span style=::scode~quotcolor:white;::scode~quot>{</span>');
    text = text.replace(/\}/g, '<span style=::scode~quotcolor:white;::scode~quot>}</span>');
    text = text.replace(/\./g, '<span style=::scode~quotcolor:white;::scode~quot>.</span>');
    text = text.replace(/const\s/g, '<span style=::scode~quotcolor:orange;::scode~quot>const </span>');
    text = text.replace(/var\s/g, '<span style=::scode~quotcolor:orange;::scode~quot>var </span>');
    text = text.replace(/let\s/g, '<span style=::scode~quotcolor:orange;::scode~quot>let </span>');
    text = text.replace(/async\s/g, '<span style=::scode~quotcolor:orange;::scode~quot>async </span>');
    text = text.replace(/await\s/g, '<span style=::scode~quotcolor:orange;::scode~quot>await </span>');

    var buffer = "";
    var opened = null;


    for (var i = 0; i < text.length; i++) {
        var btext = text[i];

        if (btext == '"' || btext == "'") {
            if (opened == null) {
                buffer += '<span style=::scode~quotcolor:crimson;::scode~quot class=::scode~quotstring::scode~quot>' + btext;
                opened = btext;
            } else {
                if (opened == btext) {
                    if (text[i - 1] == "\\") {
                        if (text[i - 2] == "\\") {
                            buffer += btext + "</span>";
                            opened = null;
                        } else {
                            buffer += btext;
                        }
                    } else {

                        buffer += btext + "</span>";
                        opened = null;
                    }
                } else {
                    buffer += btext;
                }
            }
        } else {
            buffer += btext;
        }

    }

    buffer = buffer.replace(/\:\:scode\~quot/g, '"');

    return buffer;
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

$(document).ready(function () {
    $("#closethis").get(0).onclick = function () {
        console.log('clicked')
        var window = app.getCurrentWindow();
        window.close();
    }

    document.body.onkeydown = function (e) {
        if (e.ctrlKey) {
            if (e.key == "o") {
                openFile();
            } else if (e.key == "s") {

                if (tabs[active_document] != undefined) {
                    var id = tabs[active_document].id;

                    fs.writeFile(active_document, $('#' + id + " textarea").get(0).value, (err) => {
                        if (err)
                            $('#status').html("error while saving");
                        else
                            $('#status').html("saved");

                        setTimeout(function () {
                            $('#status').html("~");
                        }, 500)
                    });
                }
            } else if (e.keyCode == 116) {
                var window = app.getCurrentWindow();
                window.reload();
            }
        } else {

        }
    }

    $('.tabmanager').click(function () {
        $('#opened_files').get(0).style.display = "none";
        $('#working_dir').get(0).style.display = "none";
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

    $('#show_working_dir').click(function () {
        if ($('#working_dir').get(0).style.display == "block") {
            $('#working_dir').get(0).style.display = "none";
        } else {
            $('#working_dir').get(0).style.display = "block";
            $('#working_dir').html('<b>Espace de travail :</b><br />');
            if (folder == null) {
                $('#working_dir').child('span').html("Vous n'avez pas encore ouvert un fichier de travail");
            } else {
                createWorkingDir(folder[1], $('#working_dir'));
            }
        }
    });
});

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
            var folder = folders[i];
            var folder_replace = folder[0].replace(/\\/g, "/");
            var folder_split_slash = folder_replace.split("/");
            var folder_real_name = folder_split_slash[folder_split_slash.length - 1];

            if (folder_real_name != ".git") {

                element.child('span').html("&#128449; " + folder_real_name);
                createWorkingDir(folder[1], element.child("div"));

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
            x.click(function (){
                newTab(this.getAttribute('data-file-path'));
            });
            
        }
    }
}

