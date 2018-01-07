export default class Highlighter{
    
    public static js(element:ExtJsObject, code:string){
        let c = "";
        let buffer = "";
        for (let i = 0; i < code.length; i++) {
            const char = code[i];
            if(char == " "){
                
                if(buffer == "const"){
                    c += "<span style=\"color:yellow\">" + buffer + "</span>";
                }else{
                    c += buffer;
                }

                c += "<span>&nbsp;</span>";
                buffer = "";
            }else{
                buffer += char;
            }
            if (i == code.length - 1){
                c += buffer;
            }
        }

        element.html(c);
        element.css('color', "cornflowerblue");
        element.addClass('object');
        
    }

    public static chooseHighlighter(type:string){
        if(["js", "json", "ts"].indexOf(type) >= 0){
            return this.js;
        }else{
            alert('Pas de système de coloration syntaxique pour l\'extension .' + type)
        }
    }
}