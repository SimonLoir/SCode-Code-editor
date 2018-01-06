import { encode } from "punycode";

export default class Highlighter{
    
    public static js(element:ExtJsObject, code:string){
        let endcode = "";
        for (let i = 0; i < code.length; i++) {
            const char = code[i];
            if(char == " "){
                endcode += "<span>&nbsp;</span>";
            }else if(char == "<"){
                endcode += "&lt;";                
            }else{
                endcode += char;
            }
        }
        element.html(endcode);
    }

    public static chooseHighlighter(type:string){
        if(["js", "json", "ts"].indexOf(type) >= 0){
            return this.js;
        }
    }
}