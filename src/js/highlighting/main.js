exports.init = function () {
    this.style_html_file = function (text, previous, isPHP) {
        text = text.replace(/\&/g, "```sodeelementandelementplaceholdertextxxxscodelibrary22```");

        var tag_buffer = '<span style="color:cornflowerblue;">';
        var tag = previous.tag;
        var attr = 0;
        var string = false;
        var buffer = "";
        var is_style = false, is_script = false;
        var style = "", script = "";

        for (var i = 0; i < text.length; i++) {
            var char = text[i];
            if (is_style) {
                style += char;
            } else if (char == "<") {
                if (tag == true) {
                    tag_buffer += char;
                } else {
                    tag_buffer = '<span style="color:cornflowerblue;">&lt;';
                    tag = true;
                }
            } else if (char == ">") {
                if (tag == true) {
                    var last_attr = tag_buffer.replace('<span style="color:cornflowerblue;">&lt;', "");
                    if (attr > 0) {
                        var xattr = "";
                        while (attr > 0) {
                            xattr += "</span>";
                            attr--;
                        }

                    } else {
                        var xattr = "";
                    }
                    tag_buffer += xattr + char + "</span>";

                    buffer += tag_buffer;
                    tag_buffer = "";
                    tag = false;
                    if (last_attr.indexOf("style") == 0) {
                        is_style = true;
                    }
                } else {
                    buffer += char;
                }
            } else if (char == '=') {
                if (tag == true) {
                    if (attr == true && string == false) {
                        var xattr = "";
                        while (attr > 0) {
                            xattr += "</span>";
                            attr--;
                        }
                    } else {
                        var xattr = "";
                    }
                    tag_buffer += xattr + char;
                } else {
                    buffer += char;
                }
            } else if (char == '"') {
                if (tag == true) {

                    if (string == false) {
                        tag_buffer += '<span style="color:coral;">' + char;
                        string = true;
                    } else {
                        tag_buffer += char + "</span>";
                        string = false;
                    }

                } else {
                    buffer += char;
                }
            } else if (char == ' ') {
                if (tag == true) {
                    if (string == true) {
                        tag_buffer += char;
                    } else {

                        tag_buffer += char + '<span style="color:lightblue;">';
                        attr++;
                    }
                } else {
                    buffer += char;
                }
            } else {
                if (tag == true) {
                    tag_buffer += char;
                } else {
                    buffer += char;
                }
            }
        }

        if (tag == true) {
            buffer += tag_buffer + "</span>";
        } else if (is_style == true) {
            var e = style
            buffer += e;
        }

        buffer = "<span class=\"default_color\">" + buffer + "</span>";
        buffer = buffer.replace(/```sodeelementscodesmallerthanelementplaceholdertextxxxscodelibrary22```/g, "&lt;");
        buffer = buffer.replace(/```sodeelementandelementplaceholdertextxxxscodelibrary22```/g, '<span>&</span>');


        return [buffer, { tag: tag }];
    }

    this.style_css_file = function(text, previous) {
        
            var x = previous;
        
            if(x.blevel == undefined){
                blevel = 0;
            }else{
                blevel = x.blevel;
            }
            if(x.colon == undefined){
                colon = false;
            }
        
            var buffer = "";
        
            for (var i = 0; i < text.length; i++) {
                var char = text[i];
                
                if(char == "{"){
                    blevel += 1;
                    buffer += '<span  class="default_color">{</span>'
                }else if(char == "}"){
                    if (colon == true){
                        colon = false;
                        buffer += colon_buffer+ "</span>";
                        colon_buffer = "";
                    }
                    blevel -= 1;
                    buffer += '<span  class="default_color">}</span>'            
                }else if(blevel  > 0){
                    if(char == ":"){
                        buffer += '<span  class="default_color">' + char + '</span>';
                        colon = true;
                        colon_buffer = '<span style="color:coral;">';
                    }else if(char == ";"){
                        buffer += colon_buffer+ "</span>";
                        buffer += '<span class="default_color">' + char + '</span>';
                        colon = false;
                    }else if(colon == true){
                        colon_buffer += char
                        
                    }else{
                        buffer += '<span style="color:cornflowerblue;">' + char + '</span>';
                    }
                }else{
                    buffer += char;
                }
        
            }
            
            if (colon == true){
                colon = false;
                buffer += colon_buffer+ "</span>";
            }
            colon_buffer = "";
            buffer = '<span style="color:orange">' + buffer + '</span>'
            return [buffer, {
                blevel: blevel,
                colon: colon
            }];
        }

    this.style_js_file = function (text, previous) {


        function is_system_key(x_buffer) {
            if (x_buffer == "const") {
                return true;
            } else if (x_buffer == "var") {
                return true;
            } else if (x_buffer == "let") {
                return true;
            } else if (x_buffer == "function") {
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
        if (comment == true) {
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
                    if (string == char) {
                        if (text[i - 1] != "\\") {
                            string = null;
                            buffer += '<span style="color:coral">' + string_buffer + '</span>';
                            string_buffer = "";
                        }
                    }
                } else {
                    if (comment != true) {
                        string = char;
                        string_buffer = char;
                    } else {
                        comment_buffer += char;
                    }
                }
            } else if (char == "/" && text[i + 1] == "/" && comment != true && text[i - 1] != "*" && string == null) {
                buffer += x_buffer;
                x_buffer = "";
                comment = true;
                comment_type = "//";
                comment_buffer = '<span style="color:black;">/';
            } else if (char == "/" && text[i + 1] == "*" && comment != true && string == null) {
                buffer += x_buffer;
                x_buffer = "";
                comment = true;
                comment_type = "/*";
                comment_buffer = '<span style="color:black;">/';
            } else if (char == "/" && text[i - 1] == "*" && comment == true) {
                comment = false;
                buffer += comment_buffer + '/</span>';
                comment_buffer = "";
            } else if (char == " " || char == " " || isOperator(char)) {
                if (string == null && comment == false) {
                    var system_key = is_system_key(x_buffer);


                    if (system_key) {
                        x_buffer = '<span style="color:orange">' + x_buffer + '</span>';
                    }

                    if (x_buffer == "true" || x_buffer == "false") {
                        x_buffer = '<span style="color:darkblue">' + x_buffer + '</span>';
                    }

                    if (["if", "else", "try", "catch", "return", "for", "while"].indexOf(x_buffer) >= 0) {
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
                if (string != null) {
                    string_buffer += char;
                } else if (comment == true) {
                    comment_buffer += char;
                } else {
                    x_buffer += char;
                }
            }

            if (i == text.length - 1) {
                if (string == null && comment == false) {
                    buffer += x_buffer;
                } else if (comment == true) {
                    buffer += comment_buffer + "</span>";
                    if (comment_type == "//") {
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
        buffer = buffer.replace(/```sodeelementandelementplaceholdertextxxxscodelibrary22```/g, '<span>&</span>');


        return [buffer, { comment: comment }];
    }

    this.style_py_file = function (text, previous) {

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

        var text_without_spaces = text.trim();

        var keywords = ["if", "else", "while", "for", "elif"];
        var error = false;
        for (var i = 0; i < keywords.length; i++) {
            var e = keywords[i];
            if (text_without_spaces.indexOf(e) == 0 && text_without_spaces[text_without_spaces.length - 1] != ":") {
                error = true;
            }
        }
        if (text_without_spaces[text_without_spaces.length - 1] == ";") {
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
        if (comment == true) {
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
                    if (string == char) {
                        if (text[i - 1] != "\\") {
                            string = null;
                            buffer += '<span style="color:coral">' + string_buffer + '</span>';
                            string_buffer = "";
                        }
                    }
                } else {
                    if (comment != true) {
                        string = char;
                        string_buffer = char;
                    } else {
                        comment_buffer += char;
                    }
                }
            } else if (char == "#" && string == null) {
                buffer += x_buffer;
                x_buffer = "";
                comment = true;
                comment_type = "#";
                comment_buffer = '<span style="color:black;">#';
            } else if (char == " " || char == " " || isPyOperator(char) || i == text.length - 1) {
                if (string == null && comment == false) {
                    var system_key = isPy_system_key(x_buffer);


                    if (system_key) {
                        x_buffer = '<span style="color:orange">' + x_buffer + '</span>';
                    }

                    if (x_buffer == "True" || x_buffer == "False" || x_buffer == "None") {
                        x_buffer = '<span style="color:darkblue">' + x_buffer + '</span>';
                    }

                    if (["class", "finally", "is", "return", "continue", "for", "lambda", "try", "def", "from", "nonlocal", "while", "and", "del", "global", "not", "with", "as", "elif", "if", "or", "yield", "assert", "else", "import", "pass", "break", "except", "in", "raise"].indexOf(x_buffer) >= 0) {
                        x_buffer = '<span style="color:DarkMagenta">' + x_buffer + '</span>';
                    }


                    if (char == "(") {
                        if (python_functions.indexOf(x_buffer) >= 0) {
                            x_buffer = '<span style="color:orange">' + x_buffer + '</span>';
                        }
                        x_buffer = '<span style="color:green">' + x_buffer + '</span>';
                    }

                    if (isPyOperator(char)) {
                        char = '<span class="default_color">' + char + '</span>';
                    }

                    if (python_functions.indexOf(x_buffer + char) >= 0 && (char != "(" || i == text.length - 1)) {
                        buffer += '<span style="border-bottom:1px dotted red;">' + x_buffer + char + '</span>';
                    } else {
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
                if (string != null) {
                    string_buffer += char;
                } else if (comment == true) {
                    comment_buffer += char;
                } else {
                    x_buffer += char;
                }
            }

            if (i == text.length - 1) {
                if (string == null && comment == false) {
                    buffer += x_buffer;
                } else if (comment == true) {
                    buffer += comment_buffer + "</span>";
                    if (comment_type == "#") {
                        comment = false;
                    }
                } else if (string != null) {
                    buffer += string_buffer;
                }
            }

        }


        buffer = buffer.replace(/\:\:scode\~quot/g, '"');

        buffer = "<span class=\"default_color\">" + buffer + "</span>";
        if (error == true) {
            buffer = "<span style=\"border-bottom:1px dotted red;\">" + buffer + "</span>";
        }
        buffer = buffer.replace(/```sodeelementscodesmallerthanelementplaceholdertextxxxscodelibrary22```/g, "&lt;");
        buffer = buffer.replace(/```sodeelementandelementplaceholdertextxxxscodelibrary22```/g, '<span>&</span>');


        return [buffer, { comment: comment }];
    }


    this.notype = function (text, previous) {
        return [text, previous];
    }


    this.highlighters = {
        "none": this.notype,
        "html": this.style_html_file,
        "html5": this.style_html_file,
        "htm": this.style_html_file,
        "svg": this.style_html_file,
        "xml": this.style_html_file,
        "md": this.style_html_file,
        "js": this.style_js_file,
        "json": this.style_js_file,
        "py": this.style_py_file,
        "css": this.style_css_file,
        "scss": this.style_css_file
    }

    this.chooseHighlighter = function (ext) {
        if (this.highlighters[ext] != undefined) {
            return this.highlighters[ext];
        } else {
            return this.highlighters["none"];
        }
    }

    return this;
}