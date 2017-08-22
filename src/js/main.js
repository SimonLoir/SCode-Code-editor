const app = require('electron').remote;
const dialog = app.dialog;
const fs = require("fs");

var tabs = {};
var id = 0; 

function openFile(){
    dialog.showOpenDialog({defaultPath:__dirname, title: "Ouvrir un fichier dans SCode"}, (filenames) => {
        newTab(filenames[0]);
    });
}

function newTab (filename) {
    fs.readFile(filename, "utf-8", (err, data) => {
        if(err){
            console.log(err);
            return;
        }

        tabs[filename] = {
            "title" : filename,
            "id" : "tab" + id
        }

        id++;

        var tab = $('.tabmanager').child('div').addClass('tab');
        tab.get(0).id = tabs[filename].id;

        var code_editor_colors = tab.child('div').addClass("code-editor-colors");

        var code_editor = tab.child('textarea').addClass("code-editor");
        code_editor.get(0).value = data;
        code_editor.get(0).setAttribute('contenteditable', "true");

        filename = filename.replace('\', "/');

        var filename_split = filename.split('/');

        var real_file_name = filename_split[filename_split.length - 1];

        var frn_split = real_file_name.split('.');

        

        addFunc(code_editor.get(0), code_editor_colors.get(0), {
            extension: frn_split[frn_split.length - 1]
        });

        code_editor.get(0).onscroll = function () {
			if(code_editor_colors.get(0).scrollHeight >= this.scrollTop){
				code_editor_colors.get(0).scrollTop = this.scrollTop;
			}else{
				this.scrollTop = code_editor_colors.get(0).scrollTop ;
				return false;
			}

			if(code_editor_colors.get(0).scrollWidth >= this.scrollLeft){
				code_editor_colors.get(0).scrollLeft = this.scrollLeft;
			}else{
				this.scrollLeft = code_editor_colors.get(0).scrollLeft ;
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
    ce.onkeydown = function (event){
        if(event.which == 9){
            this.focus();
            return false;
        }
    }

    cec.innerHTML = codify(ce.value, file);    
}

function codify(text, file) {
	
	text = text.replace(/ /g, " ");

    if(file.extension == "css"){
        text = style_css_file(text);
    }
    
    text = text.replace(/(\n|\r)/g, "<br />");
    text = text.replace(/(\r\n)/g, "<br />");

    return text;
}

function insertTextAtCursor(text) {
    var sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode( document.createTextNode(text) );
        }
    } else if (document.selection && document.selection.createRange) {
        document.selection.createRange().text = text;
    }
}

function style_css_file(text) {

    text = text.replace(/(.[^\n|\r|\{|\}]+)\{/g, function (m, $1) {
        return '<span style="color:yellow">' + $1 + '</span>{';  
    });

    text = text.replace(/(.[^\n|\r]+)\:(.+)\;/g, function (m, $1, $2) {
      return '<span style="color:red">' + $1 + '</span>:<span>' + $2 + ';</span>';  
    });

    return text;
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
    $("#closethis").get(0).onclick = function (){
        console.log('clicked')
        var window = app.getCurrentWindow();
        window.close();
    }
});