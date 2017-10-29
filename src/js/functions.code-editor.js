var emmet = require('emmet');
console.log(emmet);
/**
 * Creates a new tab in the tab manager
 * @param {String} filename the filename
 */
function newTab(filename, full_md) {
    if (tabs[filename] != undefined) { $('#x' + tabs[filename].id).click();return; }
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
                if(fired == last_fired){
                    if (fs.readFileSync(filename) != code_editor.get(0).value){
                        if (confirm("Une autre version de ce fichier existe sur votre disque dur. Charger la version du disque ?")){
                            cross.click();
                            newTab(filename);
                        }
                    }else{
                        console.log("ok")
                    }
                }
            }, 2500);
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

        if (frn_split[frn_split.length - 1] == "md"  || x_filename == x_settings) {
            tab.addClass('md');
            var md_preview = tab.child('div').addClass('md-preview');
        }

        if(x_filename == x_settings){
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

            md_preview.get(0).oninput = function (){
                var jarray = {};
                var all = document.querySelectorAll('.x_data');
                for (var i = 0; i < all.length; i++) {
                    var ell = all[i];
                    if(ell.querySelector('input').value != "true" && ell.querySelector('input').value != "false"){
                        x_val = ell.querySelector('input').value;
                    }else if(ell.querySelector('input').value == "true"){
                        x_val = true;
                    }else{
                        x_val = false;
                    }
                    jarray[ell.getAttribute('key')] = x_val;
                }
                console.log(all)
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
            var ext = frn_split[frn_split.length - 1];
            if (ext == "js" || ext == "json" || ext == "html"|| ext == "svg" || ext == "css") {
                var menu = new Menu();
                if (file_buffer == "") {
                    var menu_item_1 = new MenuItem({
                        label: language.organizeTheCode,
                        click: () => {
                            file_buffer = this.value;
                            
                            if(ext == "json" || ext == "js"){
                                this.value = beautify(this.value);
                            }else if(ext == "html" || ext == "svg"){
                                this.value = beautify_html(this.value);
                            }else if(ext == "css"){
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

function addFunc(ce, cec, file, line_n) {
    var last = 0;
    ce.onkeyup = function (event){
        if(event != undefined && event.keyCode == 13){
            
            var text = this.value.insertAt(getCaretPos(this), "::scode~cursor-element");
            var line_to_update = text.split('::scode~cursor-element')[0].split(/\r?\n/).length - 1;

            var x_text = tabs[file.filename]["split"][line_to_update - 1];

            var number_of_spaces = x_text.indexOf(x_text.trim());
            if(x_text.trim().length == 0){
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
            var end = false;
            var x_val = v.substring(0, s);
            var emmet_exp = "";
            var brackets = false;
            for (var i = x_val.length - 1; i >= 0; i--) {
                var element = x_val[i];
                if((element == " "|| element == "\n") && brackets != true){
                    break;
                }else if (element == "{"){
                    if(brackets == true){
                        brackets = false;
                    }
                }else if (element == "}"){
                    if(brackets != true){
                        brackets = true;
                    }
                }
                emmet_exp = element + emmet_exp;
            }
            console.log(emmet_exp);

            try {
                if(emmet_exp.trim() == ""){
                    throw "Error";
                }
                var ext_markup = ['html', "svg"];
                var ext_style = ["css", "scss", "sass"];
                if(ext_markup.indexOf(file.extension)  >= 0 ){
                    type = "html";
                }else if(ext_style.indexOf(file.extension) >= 0 ) {
                    type = "css";
                }else{
                    throw 'e';
                }
                var str = emmet.expandAbbreviation(emmet_exp, type).replace(/\t/g, "    ").replace(/\$\{([0-9]*)(\:*)/g, "").replace(/\}/g, "");
                s = s - emmet_exp.length;
                console.log(s);
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

function codify_line(x___text, file, previous) {
    x___text = x___text.replace(/ /g, " ");
    x___text = x___text.replace('::scode~cursor-element', '');

    if (file.extension == "css") {
        x___text = style_css_file(x___text, previous);
    } else if (file.extension == "js" || file.extension == "json") {
        x___text = style_js_file(x___text, previous);
    } else if (file.extension == "html" || file.extension == "html5" || file.extension == "htm" || file.extension == "svg" || file.extension == "md") {
        x___text = style_html_file(x___text, previous);
    }else if (file.extension == "py") {
        x___text = style_py_file(x___text, previous);
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

function style_html_file(text, previous, isPHP) {
    text = text.replace(/\&/g, "```sodeelementandelementplaceholdertextxxxscodelibrary22```");

    var tag_buffer = '<span style="color:cornflowerblue;">' ;
    var tag = previous.tag;
    var attr = 0;
    var string = false;
    //console.log(tag)
    var buffer = "";
    var is_style = false, is_script = false;
    var style = "", script = "";

    for (var i = 0; i < text.length; i++) {
        var char = text[i];
        if(is_style){
            style += char;
        }else if(char == "<"){
            if(tag == true){
                tag_buffer += char;
            }else{
                tag_buffer = '<span style="color:cornflowerblue;">&lt;' ;
                tag = true;
            }
        }else if(char == ">"){
            if(tag == true){
                var last_attr = tag_buffer.replace( '<span style="color:cornflowerblue;">&lt;', "");
                if(attr > 0){
                    var xattr = "";
                    while (attr >0 ) {
                        xattr += "</span>";
                        attr --;
                    }
                    
                }else{
                    var xattr = "";
                }
                tag_buffer +=  xattr + char + "</span>";

                buffer += tag_buffer;
                tag_buffer = "";
                tag = false;
                if(last_attr.indexOf("style") == 0){
                    is_style = true;
                }
            }else{
                buffer += char;
            }
        }else if(char == '='){
            if(tag == true ){
                if(attr == true && string == false){
                    var xattr = "";
                    while (attr >0 ) {
                        xattr += "</span>";
                        attr --;
                    }
                }else{
                    var xattr = "";
                }
                tag_buffer +=  xattr + char;
            }else{
                buffer += char;
            }
        }else if(char == '"'){
            if(tag == true){

                if(string == false){
                    tag_buffer += '<span style="color:coral;">' + char;
                    string = true;
                }else{
                    tag_buffer += char + "</span>";
                    string = false;                    
                }

            }else{
                buffer += char;
            }
        }else if(char == ' '){
            if(tag == true){
                if(string == true){
                    tag_buffer += char;
                }else{
                    
                    tag_buffer += char + '<span style="color:lightblue;">';
                    attr ++;
                }
            }else{
                buffer += char;
            }
        }else{
            if(tag == true){
                tag_buffer += char;
            }else{
                buffer += char;
            }
        }
    }

    if(tag == true){
        buffer += tag_buffer + "</span>";
    }else if(is_style == true){
        var e = addStyleToHTML(style)
        console.log(e);
        buffer += e;
    }

    buffer = "<span class=\"default_color\">" + buffer + "</span>";
    buffer = buffer.replace(/```sodeelementscodesmallerthanelementplaceholdertextxxxscodelibrary22```/g, "&lt;");
    buffer = buffer.replace( /```sodeelementandelementplaceholdertextxxxscodelibrary22```/g, '<span>&</span>');
    

    return [buffer, { tag : tag }];
}

function addStyleToHTML(style){
    if(style.indexOf('</style') >= 0){
        var split = style.split('</style')[0]
        console.log(style.substring(split.length - 1, style.length -1), split)
        return style_css_file(split)[0] + style_html_file(style.replace(split, ''), {})[0];
    }else{
        return style_css_file(style)[0];
    }
}

function style_css_file(text, previous) {

    var buffer = "";

    for (var i = 0; i < text.length; i++) {
        var char = text[i];
        
    }
/*
    text = text.replace(/(.[^\n|\r|\{|\}|\.]+)\{/g, function (m, $1) {
        return '<span style="color:yellow">' + $1 + '</span>{';
    });

    text = text.replace(/(.[^\n|\r|;|\;]+)\:(.+)\;/g, function (m, $1, $2) {
        return '<b style="color:red">' + $1 + '</b>:<span>' + $2 + ';</span>';
    });
*/
    return [buffer, {}];
}

function style_js_file(text, previous) {
    text = text.replace(/\</g, "```sodeelementscodesmallerthanelementplaceholdertextxxxscodelibrary22```");
    text = text.replace(/\&/g, "```sodeelementandelementplaceholdertextxxxscodelibrary22```");
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
                    char = '<span class="default_color">' + char + '</span>';
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
    buffer = buffer.replace(/```sodeelementscodesmallerthanelementplaceholdertextxxxscodelibrary22```/g, "&lt;");
    buffer = buffer.replace( /```sodeelementandelementplaceholdertextxxxscodelibrary22```/g, '<span>&</span>');
    

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
    if ([';', ',', '=', '!', '.', '{', '}', '[', ']', '(', ')', '>', '<', "+", "-", "*", "/", ":"].indexOf(char) >= 0) {
        return true;
    } else {
        return false;
    }
}

function isPy_system_key(x_buffer) {
    return false;
}

function isPyOperator(char) {
    if ([';', ',', '=', '!', '.', '{', '}', '[', ']', '(', ')', '>', '<', "+", "-", "*", "/", ":"].indexOf(char) >= 0) {
        return true;
    } else {
        return false;
    }
}

function style_py_file(text, previous) {
    var text_without_spaces = text.trim();
    
    var keywords = ["if", "else", "while", "for", "elif"];
    var error = false;
    for (var i = 0; i < keywords.length; i++) {
        var e = keywords[i];
        if (text_without_spaces.indexOf(e) == 0 && text_without_spaces[text_without_spaces.length - 1] != ":"){
            error = true;
        }
    }
    if(text_without_spaces[text_without_spaces.length - 1] == ";"){
        error = true;
    }

    text = text.replace(/\</g, "```sodeelementscodesmallerthanelementplaceholdertextxxxscodelibrary22```");
    text = text.replace(/\&/g, "```sodeelementandelementplaceholdertextxxxscodelibrary22```");
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
        } else if(char == "#" && string == null){
            buffer += x_buffer;
            x_buffer = "";
            comment = true;
            comment_type = "#";
            comment_buffer = '<span style="color:black;">#';
        }else if (char == " " || char == " " || isPyOperator(char) || i == text.length - 1) {
            if (string == null && comment == false) {
                var system_key = isPy_system_key(x_buffer);


                if (system_key) {
                    x_buffer = '<span style="color:orange">' + x_buffer + '</span>';
                }

                if (x_buffer == "True" || x_buffer == "False" || x_buffer == "None") {
                    x_buffer = '<span style="color:darkblue">' + x_buffer + '</span>';
                }

                if (["class","finally","is","return","continue","for","lambda","try","def","from","nonlocal","while","and","del","global","not","with","as","elif","if","or","yield","assert","else","import","pass","break","except","in","raise"].indexOf(x_buffer) >= 0) {
                    x_buffer = '<span style="color:DarkMagenta">' + x_buffer + '</span>';
                }

                
                if (char == "(") {
                    if (python_functions.indexOf(x_buffer) >= 0) {
                        x_buffer = '<span style="color:orange">' + x_buffer + '</span>';
                    }
                    x_buffer = '<span style="color:green">' + x_buffer + '</span>';
                }
                
                if (isOperator(char)) {
                    char = '<span class="default_color">' + char + '</span>';
                }
                
                if (python_functions.indexOf(x_buffer + char) >= 0 && (char != "(" || i == text.length - 1)) {
                        buffer += '<span style="border-bottom:1px dotted red;">' + x_buffer + char + '</span>';
                }else{
                    if (python_functions.indexOf(x_buffer) >= 0 && char != "(") {
                        x_buffer = '<span style="border-bottom:1px dotted red;">' + x_buffer + '</span>';
                    }
                    buffer += x_buffer + char;
                }
                
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
                if(comment_type == "#"){
                    comment = false;
                }
            } else if (string != null) {
                buffer += string_buffer;
            }
        }

    }


    buffer = buffer.replace(/\:\:scode\~quot/g, '"');

    buffer = "<span style=\"color:cornflowerblue;\">" + buffer + "</span>";
    if (error == true){
        buffer = "<span style=\"border-bottom:1px dotted red;\">" + buffer + "</span>";
    }
    buffer = buffer.replace(/```sodeelementscodesmallerthanelementplaceholdertextxxxscodelibrary22```/g, "&lt;");
    buffer = buffer.replace( /```sodeelementandelementplaceholdertextxxxscodelibrary22```/g, '<span>&</span>');
    

    return [buffer, { comment: comment }];
}
