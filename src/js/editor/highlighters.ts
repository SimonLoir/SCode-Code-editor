export default class Highlighter{
    
    public static js(){

    }

    public static chooseHighlighter(type:string){
        if(["js", "json", "ts"].indexOf(type) >= 0){
            return this.js;
        }
    }
}