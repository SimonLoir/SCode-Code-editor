export default class Highlighter{
    
    public static js(previous, code){

    }

    public static chooseHighlighter(type:string){
        if(["js", "json", "ts"].indexOf(type) >= 0){
            return this.js;
        }
    }
}