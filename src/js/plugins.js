var beautify = require('js-beautify').js_beautify;
var beautify_html = require('js-beautify').html;
var beautify_css= require('js-beautify').css;
var marked = require('marked');

$(document).ready(function ( ) {
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
    git.git_receiver = $('#git').child('div');
});

var git = {
    git_receiver : null,
    push : function () {
        require('simple-git')(folder[0]).push(function (error) {
            if(error != null){
                alert(language.cantPush + error);
            }else{
                alert(language.pushDone);
            }
        });
    },
    commit: function (text, callback, err) {
        require('simple-git')(folder[0]).add("./*").commit(text, function(error, infos) {
            if(error != null){
                alert('An error occured !');
                err();
            }else{
                callback();
            }
        });
    },
    status : function (callback) {
        require('simple-git')(folder[0]).add("./*").status(function (error, changes){
            if(error === null){
                callback(changes);
            }
        });
    },
    updateGitPanel : function (changes) {
       
        if(git.git_receiver == null){
            return;
        }

        var g = git.git_receiver;

        g.html("");

        var created_label = g.child('p').html( language.created + ' (' + changes.created.length + ')');
        var created_list = g.child('div');

        addClickOnDir(created_label, created_list);

        for (var i = 0; i < changes.created.length; i++) {
            var created = changes.created[i];
            created_list.child('span').html("> " + created);
            created_list.child('br');
        }

        var modified_label = g.child('p').html(language.modified + ' (' + changes.modified.length + ')');
        var modified_list = g.child('div');

        addClickOnDir(modified_label, modified_list);

        for (var i = 0; i < changes.modified.length; i++) {
            var modified = changes.modified[i];
            modified_list.child('span').html("> " + modified);
            modified_list.child('br');
        }

        var deleted_label = g.child('p').html(language.removed + ' (' + changes.deleted.length + ')');
        var deleted_list = g.child('div');

        addClickOnDir(deleted_label, deleted_list);

        for (var i = 0; i < changes.deleted.length; i++) {
            var deleted = changes.deleted[i];
            deleted_list.child('span').html("> " + deleted);
            deleted_list.child('br');
        }

        var renamed_label = g.child('p').html(language.renamed + ' (' + changes.renamed.length + ')');
        var renamed_list = g.child('div');

        addClickOnDir(renamed_label, renamed_list);

        for (var i = 0; i < changes.renamed.length; i++) {
            var renamed = changes.renamed[i];
            renamed_list.child('span').html("> " + renamed);
            renamed_list.child('br');
        }
        
    }
}


var commands = [
    ["Paramètres, settings", "settings", function () {
        newTab(os.homedir() + "/.scode/settings.json");
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
        newTab('src/res/readme.md', true);
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
        console.log(folder)
        let folder_json = JSON.stringify(folder);

        try {
            fs.writeFileSync(os.homedir() + "/.scode/folder.json", folder_json, "utf-8");
        } catch (error) {
            alert(error)
        }
        updateWorkingDir();
        load_projet_setting();
    }]
]

function rmdir(dir_path) {
    if (fs.existsSync(dir_path)) {
        fs.readdirSync(dir_path).forEach(function(entry) {
            var entry_path = path.join(dir_path, entry);
            if (fs.lstatSync(entry_path).isDirectory()) {
                rmdir(entry_path);
            } else {
                fs.unlinkSync(entry_path);
            }
        });
        fs.rmdirSync(dir_path);
    }
}

$(document).ready(function () {
    try {
        var fs = require("fs");
        
        // Here will come the extensions system. 
    
        if(fs.existsSync(os.homedir() + "/.scode/extensions") == false){
            fs.mkdirSync(os.homedir() + "/.scode/extensions/");
        }
    
        var extensions_file = os.homedir() + "/.scode/extensions/app.json";
        if(fs.existsSync(extensions_file) == false){
            fs.writeFileSync(extensions_file, "[]");
        }
    
        var exts = JSON.parse(fs.readFileSync(extensions_file));
        for (var i = 0; i < exts.length; i++) {
            var extension = exts[i];
            if(extension.isEnabled == true){
                var ext_main_file = os.homedir() + "/.scode/extensions/" + extension.mainFile;
                var x_path = require("path");
                var ext_main_folder = x_path.dirname(ext_main_file)
                var ext = require(ext_main_file);
                try {
                    ext.exec(ext_main_folder);
                } catch (error) {
                    alert('Extension (' + extension.ExtName + ') error : ' + error);
                }
            }
        }
    } catch (error) {
        
    }
});

function newTerminal(){
    var x_term = $(document.body).child("div");
    x_term.css('z-index', 100);
    x_term.css('position', "fixed");
    x_term.css('overflow', "hidden");
    x_term.css('bottom', "25px");
    x_term.css('height', "250px");
    x_term.css('max-height', "90%");
    x_term.css('left', "0");
    x_term.css('right', "0");
    x_term.css('background', "rgb(34,34,34)");
    x_term.css('padding', "5px");
    var x_x_term = x_term;
    var x_term_resizer = x_term.child("div");

    var m_pos;
    function resize(e) {
        var parent = resize_el.parentNode;
        var dx = m_pos - e.y;
        m_pos = e.y;
        parent.style.height = (parseInt(getComputedStyle(parent, '').height) + dx) + "px";
        term.fit();
    }

    var resize_el = x_term_resizer.get(0);
    resize_el.addEventListener("mousedown", function (e) {
        m_pos = e.y;
        document.addEventListener("mousemove", resize, false);
    }, false);
    document.addEventListener("mouseup", function () {
        document.removeEventListener("mousemove", resize, false);
    }, false);

    x_term_resizer.css('position', "absolute");
    x_term_resizer.css('top', "0px");
    x_term_resizer.css('left', "0");
    x_term_resizer.css('right', "0");
    x_term_resizer.css('background', "#ccc");
    x_term_resizer.css('height', "4px");
    x_term_resizer.css('cursor', "n-resize");

    var term = new Terminal();
    term.open(x_term.get(0));
    term.cursorBlink = true
    term.fit()
    var pty = require('node-pty');

    var shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

    var ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cwd: folder[0],
        env: process.env
    });

    ptyProcess.on('data', function (data) {
        term.write(data)
    });

    ptyProcess.on('close', function (data) {
        x_term.remove();
    });

    ptyProcess.on('exit', function (data) {
        x_term.remove();
    });

    term.textarea.onkeydown = function (e) {
        if (e.key == "Backspace") {
            ptyProcess.write("\b");
        } else if (e.key == "Enter") {
            ptyProcess.write("\r");
        }else if (e.key == "c" && e.ctrlKey == true) {
            ptyProcess.write("\x03");
        }else if (e.keyCode == 32) {
            ptyProcess.write(' ');
        }else if (e.keyCode == 9) {
            ptyProcess.write('\t');
        }else if (e.keyCode < 37) {
        }else if(e.keyCode == 37){
            ptyProcess.write("\u001b[D");
        }else if(e.keyCode == 38){
            ptyProcess.write("\u001b[A");
        }else if(e.keyCode == 39){
            ptyProcess.write("\u001b[C");
        }else if(e.keyCode == 40){
            ptyProcess.write("\u001b[B");
        } else {
            ptyProcess.write(e.key);
        }

        if(e.keyCode == 9){
            return false;
        }

    }

    term.attachCustomKeyEventHandler(function (e) {
        if (e.keyCode == 9) {
            // Do nothing
            return false;
        }
    });

}