export default class Highlighter{
    
    public static hl;

    public static js(element:ExtJsObject, code:string, isInputEvent?:boolean){

        if(isInputEvent == undefined){
            isInputEvent = true;
        }

        let element_before:HTMLElement = element.get(0).previousSibling;
        
        let keywords:Array<string> = ["abstract","arguments","await","boolean","break","byte","case","catch","char","class","const","continue","debugger","default","delete","do","double","else","enum","eval","export","extends","false","final","finally","float","for","function","goto","if","implements","import","in","instanceof","int","interface","let","long","native","new","null","package","private","protected","public","return","short","static","super","switch","synchronized","this","throw","throws","transient","true","try","typeof","var","void","volatile","while","with","yield"];
        
        let operators:Array<string> = [';', ',', '=', '!', '.', '{', '}', '[', ']', '(', ')', '>', '<', "+", "-", "*", "/", ":"];

        let string_start:Array<string> = ['"', "'", "`"];

        let c:string = "";

        let buffer:string = "";

        let type:String = "default";

        let string_type:string;

        let comment_type:string;

        let comment_start;

        let comment_state_now = element.get(0).dataset['comment'];

        if(element_before != undefined){
            let before = element_before.dataset['comment'];
            if(before == "*"){
                comment_type = "*";
                type = "comment"
            }
        }

        element.html('');
        
        function cleanBuffer(c, buffer, char, type){
            if(type == "default"){
                if(char == "("){
                    c += `<span class="function">${buffer}</span>`;
                }else if(keywords.indexOf(buffer) >= 0){
                    c += `<span class="keyword1">${buffer}</span>`;
                }else{
                    c += buffer;
                }
            }else if(type == "string"){
                c += `<span class="string">${buffer}</span>`;
            }else if(type == "comment"){
                c += `<span class="comment">${buffer}</span>`;
            }
            buffer = "";
            return {c, buffer};
        }

        for (let i = 0; i < code.length; i++) {
            let char = code[i];
            if(char == " "){
                
                ({c, buffer}= cleanBuffer(c, buffer, char, type));
                
                c += " ";
                buffer = "";
            }else{
                if(char == "&")
                    char = "&amp;";

                if(type == "default" && char == "/" && (code[i+1] == "/" || code [i+1] == "*")){
                    ({c, buffer}= cleanBuffer(c, buffer, char, type));
                    type = "comment";
                    buffer += char;
                    comment_type = code[i+1];
                    comment_start = i;

                } else if( type == "comment" && char == "/" && code[i - 1] == "*" && i-2 != comment_start){
                    buffer += char;
                    ({c, buffer}= cleanBuffer(c, buffer, char, type));
                    type = "default";
                    comment_type = "";
                }else if(operators.indexOf(char) >= 0 && type == "default"){

                    ({c, buffer}= cleanBuffer(c, buffer, char, type));

                    c += `<span class="operator">${char}</span>`
                }else if(type == "string" && char == string_type && code[i-1] != "\\"){
                    buffer += char;
                    ({c, buffer}= cleanBuffer(c, buffer, char, type));
                    type = "default";
                }else if(type == "default" && string_start.indexOf(char) >= 0){
                    type = "string";
                    buffer += char;
                    string_type = char;
                }else{
                    buffer += char;
                }
            }
            if (i == code.length - 1){
                ({c, buffer} = cleanBuffer(c, buffer, char, type));                
            }
        }

        if(type == "comment" && comment_type != ""){
            element.get(0).dataset["comment"] = comment_type;
        }else{
            element.get(0).dataset["comment"] = "";
        }

        element.html(c);
        element.addClass('default2');
        element.addClass('object');

        if(isInputEvent == true && comment_type != comment_state_now){
            let editor = this;
            async function wait(e) {
                if(e.get(0).nextSibling != undefined){
                    editor.hl(e.nextSibling(), e.nextSibling().text());
                }
            }
            wait(element);
        }

        return true;
    }

    public static xml(element:ExtJsObject, code:string, isInputEvent?:boolean) {
        
    }

    public static chooseHighlighter(type:string){
        if(["js", "json", "ts"].indexOf(type) >= 0){
            return this.js;
        }else if(["htm", "html5", "html", "xml"].indexOf(type) >= 0){
            return this.xml;
        }else{
            alert('Pas de système de coloration syntaxique pour l\'extension .' + type)
        }
    }
}