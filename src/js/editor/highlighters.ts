export default class Highlighter{
    
    public static js(element:ExtJsObject, code:string){
        
        let keywords = ["abstract","arguments","await","boolean","break","byte","case","catch","char","class","const","continue","debugger","default","delete","do","double","else","enum","eval","export","extends","false","final","finally","float","for","function","goto","if","implements","import","in","instanceof","int","interface","let","long","native","new","null","package","private","protected","public","return","short","static","super","switch","synchronized","this","throw","throws","transient","true","try","typeof","var","void","volatile","while","with","yield"];
        
        let operators = [';', ',', '=', '!', '.', '{', '}', '[', ']', '(', ')', '>', '<', "+", "-", "*", "/", ":"];

        //The output code
        let c = "";
        //The buffer
        let buffer = "";
        //The type
        let type = "default";

        element.html('');
        
        function cleanBuffer(c, buffer, char){
            if(char == "("){
                c += "<span class=\"function\">" + buffer + "</span>";
            }else if(keywords.indexOf(buffer) >= 0){
                c += "<span class=\"keyword1\">" + buffer + "</span>";
            }else{
                c += buffer;
            }
            buffer = "";
            return {c, buffer};
        }

        for (let i = 0; i < code.length; i++) {
            const char = code[i];
            if(char == " "){
                
                let cb = cleanBuffer(c, buffer, char);c = cb.c;buffer = cb.buffer;
                
                c += " ";
                buffer = "";
            }else{
                if(operators.indexOf(char) >= 1){

                    let cb = cleanBuffer(c, buffer, char);c = cb.c;buffer = cb.buffer;

                    c += `<span style="color:white;">${char}</span>`
                }else{
                    buffer += char;
                }
            }
            if (i == code.length - 1){
                c += buffer;
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