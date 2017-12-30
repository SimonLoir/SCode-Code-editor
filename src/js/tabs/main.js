exports.keywords = {
    js: []
}
exports.keywords_base = {
    js: ["body", "close", "stop", "focus", "blur", "open", "alert", "confirm", "prompt", "print", "postMessage", "captureEvents", "releaseEvents", "getSelection", "getComputedStyle", "matchMedia", "moveTo", "moveBy", "resizeTo", "resizeBy", "scroll", "scrollTo", "scrollBy", "requestAnimationFrame", "cancelAnimationFrame", "getDefaultComputedStyle", "scrollByLines", "scrollByPages", "sizeToContent", "updateCommands", "find", "dump", "setResizable", "requestIdleCallback", "cancelIdleCallback", "btoa", "atob", "setTimeout", "clearTimeout", "setInterval", "clearInterval", "createImageBitmap", "fetch", "self", "name", "history", "locationbar", "menubar", "personalbar", "scrollbars", "statusbar", "toolbar", "status", "closed", "frames", "length", "opener", "parent", "frameElement", "navigator", "external", "applicationCache", "screen", "innerWidth", "innerHeight", "scrollX", "pageXOffset", "scrollY", "pageYOffset", "screenX", "screenY", "outerWidth", "outerHeight", "performance", "mozInnerScreenX", "mozInnerScreenY", "devicePixelRatio", "scrollMaxX", "scrollMaxY", "fullScreen", "mozPaintCount", "ondevicemotion", "ondeviceorientation", "onabsolutedeviceorientation", "ondeviceproximity", "onuserproximity", "ondevicelight", "sidebar", "onvrdisplayconnect", "onvrdisplaydisconnect", "onvrdisplayactivate", "onvrdisplaydeactivate", "onvrdisplaypresentchange", "crypto", "onabort", "onblur", "onfocus", "onauxclick", "oncanplay", "oncanplaythrough", "onchange", "onclick", "onclose", "oncontextmenu", "ondblclick", "ondrag", "ondragend", "ondragenter", "ondragexit", "ondragleave", "ondragover", "ondragstart", "ondrop", "ondurationchange", "onemptied", "onended", "oninput", "oninvalid", "onkeydown", "onkeypress", "onkeyup", "onload", "onloadeddata", "onloadedmetadata", "onloadend", "onloadstart", "onmousedown", "onmouseenter", "onmouseleave", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onwheel", "onpause", "onplay", "onplaying", "onprogress", "onratechange", "onreset", "onresize", "onscroll", "onseeked", "onseeking", "onselect", "onshow", "onstalled", "onsubmit", "onsuspend", "ontimeupdate", "onvolumechange", "onwaiting", "onselectstart", "ontoggle", "onmozfullscreenchange", "onmozfullscreenerror", "onanimationcancel", "onanimationend", "onanimationiteration", "onanimationstart", "ontransitioncancel", "ontransitionend", "ontransitionrun", "ontransitionstart", "onwebkitanimationend", "onwebkitanimationiteration", "onwebkitanimationstart", "onwebkittransitionend", "onerror", "speechSynthesis", "onafterprint", "onbeforeprint", "onbeforeunload", "onhashchange", "onlanguagechange", "onmessage", "onmessageerror", "onoffline", "ononline", "onpagehide", "onpageshow", "onpopstate", "onstorage", "onunload", "localStorage", "origin", "isSecureContext", "indexedDB", "caches", "sessionStorage", "window", "document", "location", "top"]
}
/**
 * Creates a new tab in the tab manager
 * @param {String} filename the filename
 */
exports.newTab = function (filename, full_md) {
    var fs = require('fs');
    if (tabs[filename] != undefined) { $('#x' + tabs[filename].id).click(); return; }
    if (path.extname(filename).toLowerCase() == ".pdf") {

        tabs[filename] = {
            "title": filename,
            "id": "tab" + id
        }

        try {
            editor.updateWorkingDirOpenedFiles();
            fs.writeFileSync(os.homedir() + "/.scode/files.json", JSON.stringify(tabs), "utf-8");
        } catch (error) {
            alert(error);
        }

        id++;

        var tab = $('.tabmanager').child('div').addClass('tab');
        tab.get(0).id = tabs[filename].id;

        var cross;

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
            editor.updateWorkingDirOpenedFiles();
            $('#' + this.getAttribute("data-id")).remove();
            $('#x' + this.getAttribute("data-id")).remove();

            active_document = "~";
            try {
                fs.writeFileSync(os.homedir() + "/.scode/files.json", JSON.stringify(tabs), "utf-8");
            } catch (error) {
                alert(error);
            }
        });

        var div = tab.child('div');
        div.css("width", "100%")
        div.css('height', "100%")
        div.addClass('pdfjs');

        //window.PDFJS.webViewerLoad();

        //PDFJS.webViewerLoad(filename);

        return;
    }
    var x_filename = filename.replace(/\\/g, "/");
    var x_settings = os.homedir().replace(/\\/g, "/") + "/.scode/settings.json";

    fs.readFile(filename, "utf-8", (err, data) => {

        if (err) {
            alert('Une erreur est survenue' + filename);
            return;
        }

        data = data.replace(/\t/g, "    ");

        tabs[filename] = {
            "title": filename,
            "id": "tab" + id
        }

        try {
            editor.updateWorkingDirOpenedFiles();
            fs.writeFileSync(os.homedir() + "/.scode/files.json", JSON.stringify(tabs), "utf-8");
        } catch (error) {
            alert(error);
        }

        id++;


        var tab = $('.tabmanager').child('div').addClass('tab');
        tab.get(0).id = tabs[filename].id;

        var line_numbers = tab.child('textarea').addClass('line-numbers');

        var code_editor_colors = tab.child('div').addClass("code-editor-colors");

        var code_editor_search = tab.child('div').addClass("code-editor-search");
        code_editor_search.get(0).value = data;

        var code_editor = tab.child('textarea').addClass("code-editor");
        code_editor.get(0).value = data;

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
            editor.updateWorkingDirOpenedFiles();
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

        var ext = frn_split[frn_split.length - 1];
        if (ext == "js" && window.esprima != undefined) {
            let array = esprima.tokenize(data);
            for (let i = 0; i < array.length; i++) {
                const token = array[i];
                if (token.type == "Identifier") {
                    //Getting tokens for autocomplete
                    if (this.keywords.js.indexOf(token.value) < 0) {
                        console.log(token.value);
                        this.keywords.js.push(token.value);
                    }
                }
            }
        }

        tabmanager.addFunc(code_editor.get(0), code_editor_colors.get(0), {
            extension: frn_split[frn_split.length - 1],
            filename: filename
        }, line_numbers, code_editor_search, tab);

        code_editor.get(0).onscroll = function () {
            $('.autocomplete').remove();
            if (code_editor_colors.get(0).scrollHeight >= this.scrollTop) {
                code_editor_colors.get(0).scrollTop = this.scrollTop;
                code_editor_search.get(0).scrollTop = this.scrollTop;
                line_numbers.get(0).scrollTop = this.scrollTop;
            } else {
                this.scrollTop = code_editor_colors.get(0).scrollTop;
                return false;
            }

            if (code_editor_colors.get(0).scrollWidth >= this.scrollLeft) {
                code_editor_colors.get(0).scrollLeft = this.scrollLeft;
                code_editor_search.get(0).scrollLeft = this.scrollLeft;
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

exports.addFunc = function (ce, cec, file, line_n, code_editor_search, tab) {
    var last = 0;
    ce.onkeyup = function (event) {
        if (document.querySelector('.autocomplete')) {
            var was_opened = true;
            if (event.keyCode == 13 || event.keyCode == 38 || event.keyCode == 40) {
                return;
            } else {
                $('.autocomplete').remove();
            }
        } else {
            var was_opened = false;
        }
        if (event != undefined && event.keyCode == 13 && was_opened == false) {

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
        } else {
            var caret = getCaretCoordinates(this, this.selectionEnd);
            if (tabmanager.keywords[file.extension] != undefined) {
                var v = this.value, s = this.selectionStart, e = this.selectionEnd;
                var end = false;
                var x_val = v.substring(0, s);
                var word = "";
                var brackets = false;
                var breakers = [';', ',', '=', '!', '.', '{', '}', '[', ']', '(', ')', '>', '<', "+", "-", "*", "/", ":", "&", " ", "\n"];
                for (var i = x_val.length - 1; i >= 0; i--) {
                    var element = x_val[i];

                    if (breakers.indexOf(element) >= 0) {
                        break;
                    }
                    word = element + word;
                }
                word = word.trim();
                if (word != "") {
                    let usables = [];
                    for (let i = 0; i < tabmanager.keywords[file.extension].length; i++) {
                        const e = tabmanager.keywords[file.extension][i];
                        if (e.indexOf(word) == 0 && e != word) {
                            usables.push(e);
                        }
                    }
                    for (let i = 0; i < tabmanager.keywords_base[file.extension].length; i++) {
                        const e = tabmanager.keywords_base[file.extension][i];
                        if (e.indexOf(word) == 0 && e != word) {
                            usables.push(e);
                        }
                    }
                    if (usables.length > 0 && breakers.indexOf(v[s]) >= 0) {
                        let position = tab.get(0).querySelector('#e' + x_val.split(/\r?\n/).length).offsetTop;
                        var ac = tab.child("div").addClass('autocomplete');
                        ac.html('');
                        console.log(position);
                        ac.css("top", (position - ce.scrollTop) + "px");
                        ac.css("left", (caret.left + 42 + 5) + "px");
                        for (let i = 0; i < usables.length; i++) {
                            let element = usables[i];
                            let end = element.replace(word, '');
                            element = element.replace(word, '<b class="word">' + word + '</b>');
                            var child = ac.child("span").html(element);
                            child.addClass('ac-internal')
                            child.get(0).setAttribute('word', end);
                            child.click(function () {
                                ce.value = v.substring(0, s) + this.getAttribute('word') + v.substring(e);
                                ce.selectionStart = ce.selectionEnd = s + this.getAttribute('word').length;
                                ce.oninput();
                                $('.autocomplete').remove();
                            });
                            if (i == 0) {
                                child.addClass('ac-selected');
                            }
                        }

                    }
                }

            }
        }

    }
    $(ce).click(ce.onkeyup)
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

            console.log(file.extension)
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
                var b = [';', ',', '=', '!', '.', '{', '}', '[', ']', '(', ')', '>', '<', "+", "-", "*", "/", ":", "&", " ", "\n"];
                var str = "    ";
                if (editor != undefined) {

                    let elexp = "";
                    for (let ixxxxxxx = x_val.length - 1; ixxxxxxx >= 0; ixxxxxxx--) {
                        let elllll = x_val[ixxxxxxx];
                        if (b.indexOf(elllll) >= 0) {
                            break;
                        }
                        elexp = elllll + elexp;
                    }
                    let elexps = undefined;

                    if (editor.snippets[file.extension] != undefined) {
                        elexps = editor.snippets[file.extension].find(e => e.trigger.toLowerCase() == elexp.toLowerCase());
                    }

                    if (elexps == undefined) {
                        elexps = editor.snippets["all"].find(e => e.trigger.toLowerCase() == elexp.toLowerCase());
                    }
                    
                    if (elexps != undefined) {
                        s = s - elexp.length;
                        var str = elexps.result;
                    }

                }
            }

            this.value = v.substring(0, s) + str + v.substring(e);
            this.selectionStart = this.selectionEnd = s + str.length;
            this.oninput();
            return false;
        } else if (event.key == "f" && event.ctrlKey) {
            let xe = this;
            let start_position = 0;
            $("#" + tabs[file.filename].id + " .search_tool").remove();
            let div = $("#" + tabs[file.filename].id).child("div")
            div.addClass('search_tool');
            div.html('')
            let input = div.child("input");
            let last = false;
            input.get(0).onkeyup = function (e) {
                if (e.key == "Escape") {
                    div.remove();
                    code_editor_search.html("");
                    return false;
                }
                if ((e == undefined && last != false) || e.key == "Enter") {
                    var match = xe.value.findStr(this.value, last[0] + last[2]);

                } else {
                    var match = xe.value.findStr(this.value);
                }
                last = match;

                if (match == false) {
                    code_editor_search.html("");
                    return false;
                }

                var color_start = '``--scode--match--search~~~~~~~scode-start``';
                var color_end = '``--scode--match--search~~~~~~~scode-end``';

                var val = xe.value.insertAt(match[0] + match[2], color_end).insertAt(match[0], color_start).replace(/\</g, "&lt;").replace(/\n/g, "<br>").replace(/\s/g, " ");

                val = val.replace(color_start, '<span style="background:cornflowerblue;color:white;">');
                val = val.replace(color_end, '</span>');


                code_editor_search.html(val);
                ce.scrollTop = code_editor_search.get(0).querySelector('span').offsetTop - 50;
            }
            input.get(0).focus()
        } else if (event.keyCode == 13 || event.keyCode == 38 || event.keyCode == 40) {
            if (document.querySelector('.autocomplete')) {
                var was_opened = true;
                let kk = event.keyCode;
                if (kk == 13) {
                    $('.ac-selected').click();
                } else {
                    let all_ac = document.querySelectorAll('.ac-internal');
                    let index = 0;
                    for (let i = 0; i < all_ac.length; i++) {
                        const e = all_ac[i];
                        if (e == document.querySelector('.ac-selected')) {
                            $(e).removeClass("ac-selected");
                            index = i;
                            break;
                        }
                    }
                    if (event.keyCode == 40) {
                        if (all_ac[index + 1] != undefined) {
                            $(all_ac[index + 1]).addClass('ac-selected');
                        } else {
                            index = 0;
                            $(all_ac[index]).addClass('ac-selected');
                        }
                    } else {
                        if (all_ac[index - 1] != undefined) {
                            $(all_ac[index - 1]).addClass('ac-selected');
                        } else {
                            index = all_ac.length - 1;
                            $(all_ac[index]).addClass('ac-selected');
                        }
                    }
                    function findPos(obj) {
                        var curtop = 0;
                        if (obj.offsetParent) {
                            do {
                                curtop += obj.offsetTop;
                            } while (obj = obj.offsetParent);
                            return [curtop];
                        }
                    }
                    document.querySelector('.autocomplete').scrollTop = $('.ac-selected').get(0).offsetTop;
                }
            } else {
                var was_opened = false;
            }
            return !was_opened;
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