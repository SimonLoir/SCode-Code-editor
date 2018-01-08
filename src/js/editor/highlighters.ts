export default class Highlighter{
    
    public static js(element:ExtJsObject, code:string){
        
        let keywords:Array<string> = ["abstract","arguments","await","boolean","break","byte","case","catch","char","class","const","continue","debugger","default","delete","do","double","else","enum","eval","export","extends","false","final","finally","float","for","function","goto","if","implements","import","in","instanceof","int","interface","let","long","native","new","null","package","private","protected","public","return","short","static","super","switch","synchronized","this","throw","throws","transient","true","try","typeof","var","void","volatile","while","with","yield"];
        
        let operators:Array<string> = [';', ',', '=', '!', '.', '{', '}', '[', ']', '(', ')', '>', '<', "+", "-", "*", "/", ":"];

        let string_start:Array<string> = ['"', "'", "`"];

        //The output code
        let c:string = "";
        //The buffer
        let buffer:string = "";
        //The type
        let type:String = "default";

        let string_type:string;

        let comment_type:string;

        let comment_start;

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
        
        element.html(c);
        element.addClass('default2');
        element.addClass('object');
        return true;
    }

    public static chooseHighlighter(type:string){
        if(["js", "json", "ts"].indexOf(type) >= 0){
            return this.js;
        }else{
            alert('Pas de système de coloration syntaxique pour l\'extension .' + type)
        }
    }
}