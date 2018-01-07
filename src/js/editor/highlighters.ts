export default class Highlighter{
    
    public static js(element:ExtJsObject, code:string){
        let c = "";
        let buffer = "";
        element.html('');
        for (let i = 0; i < code.length; i++) {
            const char = code[i];
            if(char == " "){
                
                if(buffer == "class"){
                    c += "<span style=\"color:yellow\">" + buffer + "</span>";
                }else{
                    c += buffer;
                }
                
                c += " ";
                buffer = "";
            }else{
                //console.log(char.charCodeAt(0), char)
                buffer += char;
            }
            if (i == code.length - 1){
                //console.log("added full buffer")
                c += buffer;
            }
        }
        
        //console.log(c);
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