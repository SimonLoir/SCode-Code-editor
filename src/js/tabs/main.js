/**
 * Creates a new tab in the tab manager
 * @param {String} filename the filename
 */
exports.newTab = function (filename, full_md) {
    if (tabs[filename] != undefined) { $('#x' + tabs[filename].id).click(); return; }
    var x_filename = filename.replace(/\\/g, "/");
    var x_settings = os.homedir().replace(/\\/g, "/") + "/.scode/settings.json";
    var fs = require('fs');

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

        try {
            fs.writeFileSync(os.homedir() + "/.scode/files.json", JSON.stringify(tabs), "utf-8");
        } catch (error) {
            alert(error);
        }

        id++;


        var tab = $('.tabmanager').child('div').addClass('tab');
        tab.get(0).id = tabs[filename].id;

        var line_numbers = tab.child('textarea').addClass('line-numbers');

        var code_editor_colors = tab.child('div').addClass("code-editor-colors");

        var code_editor = tab.child('textarea').addClass("code-editor");
        code_editor.get(0).value = data;
        code_editor.get(0).setAttribute('contenteditable', "true");

        var last_fired;
        var cross;

        var watch = fs.watch(filename, function (e, ee) {
            var fired = new Date();
            setTimeout(function () {
                if (fired == last_fired) {
                    if (fs.readFileSync(filename) != code_editor.get(0).value) {
                        if (confirm("Une autre version de ce fichier existe sur votre disque dur. Charger la version du disque ?")) {
                            cross.click();
                            tabmanager.newTab(filename);
                        }
                    } else {
                        //console.log("ok")
                    }
                }
            }, 300);
            last_fired = fired;
        });

        var xfilename = filename.replace(/\\/g, "/");

        var filename_split = xfilename.split('/');

        var real_file_name = filename_split[filename_split.length - 1];

        var frn_split = real_file_name.split('.');

        var xtab = $('.header').child('span').html(real_file_name);
        xtab.addClass('xtab');
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
            try {
                $(document.querySelector('.active')).removeClass('active');
            } catch (error) {

            }
            $(this).addClass('active')
            $('#' + this.getAttribute("data-id")).get(0).style.display = "block";
            active_document = this.getAttribute('data-file');
        });

        xtab.click();

        cross = xtab.child('i').html("  ×");
        cross.get(0).setAttribute('data-id', tabs[filename].id);
        cross.get(0).setAttribute('data-file', filename);
        cross.addClass('cross');
        cross.click(function () {
            delete tabs[this.getAttribute('data-file')];
            $('#' + this.getAttribute("data-id")).remove();
            $('#x' + this.getAttribute("data-id")).remove();

            active_document = "~";
            try {
                watch.close();
                fs.writeFileSync(os.homedir() + "/.scode/files.json", JSON.stringify(tabs), "utf-8");
            } catch (error) {
                alert(error);
            }
        });

        if (frn_split[frn_split.length - 1] == "md" || x_filename == x_settings) {
            tab.addClass('md');
            var md_preview = tab.child('div').addClass('md-preview');
        }

        if (x_filename == x_settings) {
            md_preview.html('<h1>Paramètres SCode</h1>');

            var x_data = JSON.parse(data);
            var keys = Object.keys(x_data)

            for (var i = 0; i < keys.length; i++) {
                var e = keys[i];
                var c = md_preview.child("p").addClass('x_data');
                c.get(0).setAttribute('key', e);
                c.child('span').html(e + " : ")
                c.child('input').get(0).value = x_data[e];
            }

            md_preview.get(0).oninput = function () {
                var jarray = {};
                var all = document.querySelectorAll('.x_data');
                for (var i = 0; i < all.length; i++) {
                    var ell = all[i];
                    if (ell.querySelector('input').value != "true" && ell.querySelector('input').value != "false") {
                        x_val = ell.querySelector('input').value;
                    } else if (ell.querySelector('input').value == "true") {
                        x_val = true;
                    } else {
                        x_val = false;
                    }
                    jarray[ell.getAttribute('key')] = x_val;
                }
                //console.log(all)
                code_editor.get(0).value = JSON.stringify(jarray);
            }
            var btn = md_preview.child("button").html('Ne pas utiliser d\'interface grahique').click(function () {
                tab.removeClass('md');
                $(this).remove();
            });
            var style = btn.get(0).style;
            style.position = "absolute";
            style.transform = "translateX(0) translateY(0)";
            style.right = "15px";
            style.bottom = "15px"
            style.left = "auto"
        }

        if ((frn_split[frn_split.length - 1] == "md" && full_md == true) || x_filename == x_settings) {
            tab.addClass('md');
            tab.addClass('hide-all');
        }

        tabmanager.addFunc(code_editor.get(0), code_editor_colors.get(0), {
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
            var ext = frn_split[frn_split.length - 1];
            if (ext == "js" || ext == "json" || ext == "html" || ext == "svg" || ext == "css") {
                var menu = new Menu();
                if (file_buffer == "") {
                    var menu_item_1 = new MenuItem({
                        label: language.organizeTheCode,
                        click: () => {
                            file_buffer = this.value;

                            if (ext == "json" || ext == "js") {
                                this.value = beautify(this.value);
                            } else if (ext == "html" || ext == "svg") {
                                this.value = beautify_html(this.value);
                            } else if (ext == "css") {
                                this.value = beautify_css(this.value);
                            }

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

exports.addFunc = function (ce, cec, file, line_n) {
    var last = 0;
    ce.onkeyup = function (event) {
        if (event != undefined && event.keyCode == 13) {

            var text = this.value.insertAt(getCaretPos(this), "::scode~cursor-element");
            var line_to_update = text.split('::scode~cursor-element')[0].split(/\r?\n/).length - 1;

            var x_text = tabs[file.filename]["split"][line_to_update - 1];

            var number_of_spaces = x_text.indexOf(x_text.trim());
            if (x_text.trim().length == 0) {
                number_of_spaces = x_text.length;
            }
            var spaces = "";
            var i = 0;
            while (i < number_of_spaces) {
                i++;
                spaces += " ";
            }

            var v = this.value, s = this.selectionStart, e = this.selectionEnd;
            this.value = v.substring(0, s) + spaces + v.substring(e);
            this.selectionStart = this.selectionEnd = s + number_of_spaces;
            this.oninput();
        }

    }
    ce.oninput = function (event) {

        if (file.extension == "md") {
            ce.parentElement.querySelector('.md-preview').innerHTML = marked(ce.value) + "<br /><br /><br />";
        }
        tabmanager.codify(ce.value, file, this, cec);
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
            var end = false;
            var x_val = v.substring(0, s);
            var emmet_exp = "";
            var brackets = false;
            for (var i = x_val.length - 1; i >= 0; i--) {
                var element = x_val[i];
                if ((element == " " || element == "\n") && brackets != true) {
                    break;
                } else if (element == "{") {
                    if (brackets == true) {
                        brackets = false;
                    }
                } else if (element == "}") {
                    if (brackets != true) {
                        brackets = true;
                    }
                }
                emmet_exp = element + emmet_exp;
            }
            //console.log(emmet_exp);

            try {
                if (emmet_exp.trim() == "") {
                    throw "Error";
                }
                var ext_markup = ['html', "svg"];
                var ext_style = ["css", "scss", "sass"];
                if (ext_markup.indexOf(file.extension) >= 0) {
                    type = "html";
                } else if (ext_style.indexOf(file.extension) >= 0) {
                    type = "css";
                } else {
                    throw 'e';
                }
                var str = emmet.expandAbbreviation(emmet_exp, type).replace(/\t/g, "    ").replace(/\$\{([0-9]*)(\:*)/g, "").replace(/\}/g, "");
                s = s - emmet_exp.length;
                //console.log(s);
            } catch (error) {
                var str = "    ";
                console.log(error);
            }

            this.value = v.substring(0, s) + str + v.substring(e);
            this.selectionStart = this.selectionEnd = s + str.length;
            this.oninput();
            return false;
        }

    }
    ce.oninput();
}

exports.codify = function (text, file, el, cec) {

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
        if (line_to_update != 0) {
            previous = tabs[file.filename]["previous"][line_to_update - 1];
        } else {
            previous = {};
        }
        var x_result = tabmanager.codify_line(x___text, file, previous);
        tabs[file.filename]["previous"][line_to_update] = x_result[1];
        cec.querySelector("#e" + line_to_update).innerHTML = x_result[0];
    } else {

        text = text.replace(/ /g, " ");

        text = text.replace('::scode~cursor-element', '');
        tabs[file.filename]["split"] = text.split(/\r?\n/);

        tabs[file.filename]["previous"] = []

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
            var x_result = tabmanager.codify_line(line, file, previous);
            previous = x_result[1];
            previous.id = i;
            tabs[file.filename]["previous"].push(previous);
            cec.querySelector("#e" + i).innerHTML = x_result[0];
        }
    }
}


exports.codify_line = function (x___text, file, previous) {
    x___text = x___text.replace(/ /g, " ");
    x___text = x___text.replace('::scode~cursor-element', '');
    x___text = highlighting.chooseHighlighter(file.extension)(x___text, previous)
    return x___text;
}