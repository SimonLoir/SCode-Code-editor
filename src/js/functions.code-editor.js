
/**
 * Creates a new tab in the tab manager
 * @param {String} filename the filename
 */
function newTab(filename) {
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

        if(frn_split[frn_split.length - 1] == "md"){
            tab.addClass('md');
            var md_preview = tab.child('div').addClass('md-preview');
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

            if(frn_split[frn_split.length - 1] == "md"){

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
            if(frn_split[frn_split.length - 1] == "js"){
                var menu = new Menu();
                if(file_buffer == ""){
                    var menu_item_1 = new MenuItem({
                        label: "Organiser le code",
                        click: () => {
                            file_buffer = this.value;
                            this.value = beautify(this.value);
                            this.oninput();
                        }
                    });
                }else{
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
        if(file.extension == "md"){
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
            return false;
        }

    }
    ce.oninput();
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
        x___text = x___text.replace(/ /g, " ");
        x___text = x___text.replace('::scode~cursor-element', '');

        if (file.extension == "css") {
            x___text = style_css_file(x___text);
        } else if (file.extension == "js") {
            x___text = style_js_file(x___text);
        } else if (file.extension == "html" || file.extension == "html5" || file.extension == "htm" || file.extension == "svg") {
            x___text = style_html_file(x___text);
        }

        cec.querySelector("#e" + line_to_update).innerHTML = x___text;
    } else {

        text = text.replace(/ /g, " ");


        if (file.extension == "css") {
            text = style_css_file(text);
        } else if (file.extension == "js") {

            text = style_js_file(text);


        } else if (file.extension == "html" || file.extension == "html5" || file.extension == "htm" || file.extension == "svg" || file.extension == "md") {

            text = style_html_file(text);

        }

        //console.log("x:" + text)

        text = text.replace('::scode~cursor-element', '');
        tabs[file.filename]["split"] = text.split(/\r?\n/);

        //console.log(text);

        var x_split = text.split(/\r?\n/);

        //console.log(x_split);

        text = "";

        for (var i = 0; i < x_split.length; i++) {
            var e = x_split[i];
            text += '<span id="e' + i + '">' + e + '</span><br />';
        }

        if (file.extension == "js") {
            text = "<span style=\"color:cornflowerblue;\">" + text + "</span>";
        }

        cec.innerHTML = text + '<br /><br /><br />';
    }
}
function style_html_file(text) {
    text = text.replace(/\</g, "::scode~lt");
    text = text.replace(/\&/g, "<span>&</span>");

    text = text.replace(/\:\:scode\~lt(.[^\<|\>]+)\>/g, function (m, $1) {
        return '&lt;<span style="color:cornflowerblue;">' + style_html_attributes($1) + '</span>>';
    });

    text = text.replace(/\:\:scode\~lt/g, "&lt;");

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
    text = text.replace(/\</g, "::scode~lt");
    text = text.replace(/\&/g, "<span>&</span>");
    text = text.replace(/(\;|\=)/g, function (m, $1) {
        return '<span style=::scode~quotcolor:white;::scode~quot>' + $1 + '</span>';
    });
    text = text.replace(/(.[^\s|\.|;]+)\(/g, function (m, $1) {
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

    buffer = "<span style=\"color:cornflowerblue;\">" + buffer + "</span>";
    buffer = buffer.replace(/\:\:scode\~lt/g, "&lt;");
    buffer = buffer.replace(/\/\/(.[^\n]+)/g, (m, $1) => {
        var x = document.createElement('span');
        x.innerHTML = $1;
        return '<span style="color:white;background:rgba(0,0,0,0.25);">//' + $1 + '</span>';
    });

    return buffer;
}