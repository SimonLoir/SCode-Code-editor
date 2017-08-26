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
        }

    });
}

function addFunc(ce, cec, file, line_n) {
    var last = 0;
    ce.oninput = function () {
        cec.innerHTML = codify(ce.value, file, this);
        var number_of_lines = ce.value.split(/\r?\n/).length;
        $('#pos').html(getCaretPos(this) + '/' + ce.value.length + " -> " + number_of_lines);
        var i = 1;
        if(number_of_lines != last){
            line_n.get(0).value = "";
            while (i <= number_of_lines) {
                line_n.get(0).value += i + "\n";
                i++;
            }
        }
        last = number_of_lines;
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
    ce.onkeyup();
}

function codify(text, file, el) {

    text = text.replace(/ /g, " ");

    //text = text.insertAt(getCaretPos(el), "::scode~curor-element");

    if (file.extension == "css") {
        text = style_css_file(text);
    } else if (file.extension == "js") {

        var options = {
            "edition": "latest",
            "length": 100
        }

        l = new LintStream(options);
        l.write({ file: file.filename, body: text });
        l.on('data', function (chunk, encoding, callback) { console.log(chunk); });

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

    //text = text.replace('::scode~curor-element', '<span style="display:inline-block;content:\'\';border-left:1px solid gray;height:20px;width:0px;line-height:20px;margin:0 auto;padding:0;transform:translateY(3px);"></span>')

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