
/**
 * Creates a new tab in the tab manager
 * @param {String} filename the filename
 */
function newTab(filename, full_md) {
    if (tabs[filename] != undefined) { return; }
    fs.readFile(filename, "utf-8", (err, data) => {

        if (err) {
            alert('Une erreur est survenue');
            return;
        }

        data = data.replace(/\t/g, "    ");

        tabs[filename] = {
            "title": filename,
            "id": "tab" + id
        }

        id++;


        var tab = $('.tabmanager').child('div').addClass('tab');
        tab.get(0).id = tabs[filename].id;

        var line_numbers = tab.child('textarea').addClass('line-numbers');

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

        if (frn_split[frn_split.length - 1] == "md") {
            tab.addClass('md');
            var md_preview = tab.child('div').addClass('md-preview');
        }

        if (frn_split[frn_split.length - 1] == "md" && full_md == true) {
            tab.addClass('md');
            tab.addClass('hide-all');
        }

        addFunc(code_editor.get(0), code_editor_colors.get(0), {
            extension: frn_split[frn_split.length - 1],
            filename: filename
        }, line_numbers);

        code_editor.get(0).onscroll = function () {
            if (code_editor_colors.get(0).scrollHeight >= this.scrollTop) {
                code_editor_colors.get(0).scrollTop = this.scrollTop;
                line_numbers.get(0).scrollTop = this.scrollTop;
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

            if (frn_split[frn_split.length - 1] == "md") {

                if (md_preview.get(0).scrollHeight >= this.scrollTop) {
                    md_preview.get(0).scrollTop = this.scrollTop;
                    line_numbers.get(0).scrollTop = this.scrollTop;
                } else {
                    this.scrollTop = md_preview.get(0).scrollTop;
                    return false;
                }
            }
        }
        var file_buffer = "";
        code_editor.get(0).addEventListener('contextmenu', function () {
            if (frn_split[frn_split.length - 1] == "js") {
                var menu = new Menu();
                if (file_buffer == "") {
                    var menu_item_1 = new MenuItem({
                        label: language.organizeTheCode,
                        click: () => {
                            file_buffer = this.value;
                            this.value = beautify(this.value);
                            this.oninput();
                        }
                    });
                } else {
                    var menu_item_1 = new MenuItem({
                        label: "Annuler organistion du code (restore à l'état d'avant la mise en forme)",
                        click: () => {
                            this.value = file_buffer;
                            this.oninput();
                            file_buffer = "";
                        }
                    });

                    var menu_item_2 = new MenuItem({
                        label: "Vider le buffer",
                        click: () => {
                            file_buffer = "";
                        }
                    });
                    menu.append(menu_item_2);

                }

                menu.append(menu_item_1);
                menu.popup(remote.getCurrentWindow());
            }
        });

    });
}

function addFunc(ce, cec, file, line_n) {
    var last = 0;
    ce.oninput = function () {
        if (file.extension == "md") {
            ce.parentElement.querySelector('.md-preview').innerHTML = marked(ce.value) + "<br /><br /><br />";
        }
        codify(ce.value, file, this, cec);
        var number_of_lines = ce.value.split(/\r?\n/).length;
        var i = 1;
        if (number_of_lines != last) {
            line_n.get(0).value = "";
            while (i <= number_of_lines) {
                line_n.get(0).value += i + "\n";
                i++;
            }
        }
        last = number_of_lines;
    }

    //ce.onkeyup = ce.oninput;
    ce.onkeydown = function (event) {
        if (event.keyCode === 9) {
            var v = this.value, s = this.selectionStart, e = this.selectionEnd;
            this.value = v.substring(0, s) + '    ' + v.substring(e);
            this.selectionStart = this.selectionEnd = s + 4;
            this.oninput();
            return false;
        }

    }
    ce.oninput();
}

function codify_line(x___text, file, previous) {
    x___text = x___text.replace(/ /g, " ");
    x___text = x___text.replace('::scode~cursor-element', '');

    if (file.extension == "css") {
        x___text = style_css_file(x___text, previous);
    } else if (file.extension == "js") {
        x___text = style_js_file(x___text, previous);
    } else if (file.extension == "html" || file.extension == "html5" || file.extension == "htm" || file.extension == "svg" || file.extension == "md") {
        x___text = style_html_file(x___text, previous);
    } else {
        x___text = [x___text, {}];
    }
    return x___text;
}

function codify(text, file, el, cec) {

    line_to_update = -1;
    text = text.insertAt(getCaretPos(el), "::scode~cursor-element");

    if (tabs[file.filename]["split"] != undefined) {
        var splt = text.split(/\r?\n/);
        if (tabs[file.filename]["split"].length == splt.length) {
            line_to_update = text.split('::scode~cursor-element')[0].split(/\r?\n/).length - 1;
        }

    }

    if (line_to_update != -1) {
        x___text = splt[line_to_update];
        if(line_to_update != 0){
            previous = tabs[file.filename]["previous"][line_to_update - 1];
        }else{
            previous = {};
        }
        var x_result = codify_line(x___text, file, previous);
        tabs[file.filename]["previous"][line_to_update] = x_result[1];
        cec.querySelector("#e" + line_to_update).innerHTML = x_result[0];
    } else {

        text = text.replace(/ /g, " ");

        text = text.replace('::scode~cursor-element', '');
        tabs[file.filename]["split"] = text.split(/\r?\n/);

        tabs[file.filename]["previous"] = {}

        var x_split = text.split(/\r?\n/);

        text = "";

        for (var i = 0; i < x_split.length; i++) {
            var e = x_split[i];
            text += '<span id="e' + i + '"></span><br />';
        }

        if (file.extension == "js") {
            text = "<span style=\"color:cornflowerblue;\">" + text + "</span>";
        }

        cec.innerHTML = text + '<br /><br /><br />';

        var previous = {};

        for (var i = 0; i < tabs[file.filename]["split"].length; i++) {
            var line = tabs[file.filename]["split"][i];
            var x_result = codify_line(line, file, previous);
            previous = x_result[1];
            tabs[file.filename]["previous"][i] = previous;
            cec.querySelector("#e" + i).innerHTML = x_result[0];
        }

        //console.log(tabs[file.filename]["previous"]);
    }
}
function style_html_file(text) {
    text = text.replace(/\</g, "::scode~lt");
    text = text.replace(/\&/g, "<span>&</span>");

    text = text.replace(/\:\:scode\~lt(.[^\<|\>]+)\>/g, function (m, $1) {
        return '&lt;<span style="color:cornflowerblue;">' + style_html_attributes($1) + '</span>>';
    });

    text = text.replace(/\:\:scode\~lt/g, "&lt;");

    return [text, {}];

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

    return [text, {}];
}

function style_js_file(text, previous) {
    text = text.replace(/\</g, "::scode~lt");
    //text = text.replace(/\&/g, "<span>&</span>");

    if (previous.comment != undefined) {
        var comment = previous.comment;
        var comment_type = "/*";
    } else {
        var comment = false;
        var comment_type = null;

    }

    var buffer = "";
    if(comment == true){
        buffer = '<span style="color:black;">';
    }
    var string = null;
    var comment_buffer = '';
    var string_buffer = "";
    var x_buffer = "";

    for (var i = 0; i < text.length; i++) {
        var char = text[i];
        if (char == "'" || char == '"') {
            if (string != null) {
                string_buffer += char;
                if(string == char){
                    if(text[ i - 1 ] != "\\"){
                        string = null;
                        buffer += '<span style="color:coral">' + string_buffer + '</span>';
                        string_buffer = "";
                    }
                }
            }else{
                if(comment != true){
                    string = char;
                    string_buffer = char;
                }else{
                    comment_buffer += char;
                }
            }
        } else if(char == "/" && text[i + 1] == "/" && comment != true && text[i - 1] != "*" && string == null){
            buffer += x_buffer;
            x_buffer = "";
            comment = true;
            comment_type = "//";
            comment_buffer = '<span style="color:black;">/';
        }else if(char == "/" && text[i + 1] == "*" && comment != true && string == null){
            buffer += x_buffer;
            x_buffer = "";
            comment = true;
            comment_type = "/*";
            comment_buffer = '<span style="color:black;">/';
        }else if(char == "/" && text[i - 1] == "*" && comment == true){
            comment = false;
            buffer += comment_buffer + '/</span>';
            comment_buffer = "";
        }else if (char == " " || char == " " || isOperator(char)) {
            if (string == null && comment == false) {
                var system_key = is_system_key(x_buffer);


                if (system_key) {
                    x_buffer = '<span style="color:orange">' + x_buffer + '</span>';
                }

                if (x_buffer == "true" || x_buffer == "false") {
                    x_buffer = '<span style="color:darkblue">' + x_buffer + '</span>';
                }

                if ([ "if", "else", "try", "catch", "return", "for", "while"].indexOf(x_buffer) >= 0) {
                    x_buffer = '<span style="color:DarkMagenta">' + x_buffer + '</span>';
                }

                if (char == "(") {
                    x_buffer = '<span style="color:green">' + x_buffer + '</span>';
                }

                if (isOperator(char)) {
                    char = '<span style="color:white;">' + char + '</span>';
                }

                buffer += x_buffer + char;
                x_buffer = "";
            } else if (comment == true) {
                comment_buffer += char;
            } else if (string != null) {
                string_buffer += char;
            }
        } else {
            if(string != null){
                string_buffer += char;
            }else if(comment == true){
                comment_buffer += char;
            }else{
                x_buffer += char;
            }
        }

        if (i == text.length - 1) {
            if (string == null && comment == false) {
                buffer += x_buffer;
            } else if (comment == true) {
                buffer += comment_buffer + "</span>";
                if(comment_type == "//"){
                    comment = false;
                }
            } else if (string != null) {
                buffer += string_buffer;
            }
        }

    }


    buffer = buffer.replace(/\:\:scode\~quot/g, '"');

    buffer = "<span style=\"color:cornflowerblue;\">" + buffer + "</span>";
    buffer = buffer.replace(/\:\:scode\~lt/g, "&lt;");

    return [buffer, { comment: comment }];
}

function is_system_key(x_buffer) {
    if (x_buffer == "const") {
        return true;
    } else if (x_buffer == "var") {
        return true;
    } else if (x_buffer == "let") {
        return true;
    }else if (x_buffer == "function") {
        return true;
    }

    return false;
}

function isOperator(char) {
    if ([';', ',', '=', '!', '.', '{', '}', '[', ']', '(', ')', '>', '<', "+", "-", "*", "/"].indexOf(char) >= 0) {
        return true;
    } else {
        return false;
    }
}