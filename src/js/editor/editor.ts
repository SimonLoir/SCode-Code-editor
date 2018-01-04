import Highlighter from "./highlighters";
export default class Editor {
    
    private type:string

    private hl:() => void;

    constructor(filetype:string) {
        
        this.type = filetype;

        this.hl = Highlighter.chooseHighlighter(this.type);

    }
}