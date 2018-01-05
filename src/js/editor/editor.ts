import Highlighter from "./highlighters";
export default class Editor {
    
    private type:string;

    private hl:(previous, code) => void;

    private textarea:ExtJsObject;

    private textarea_colors:ExtJsObject;

    constructor(filetype:string, content:string, container:ExtJsObject) {
        
        let $textarea_colors = container.child('div');
        $textarea_colors.html("class");
        $textarea_colors.addClass("code-editor-colors");
        
        let $textarea = container.child('textarea');
        let textarea:HTMLTextAreaElement =  $textarea.get(0)
        textarea.value = content;
        $textarea.addClass('code-editor');
        
        let $line_numbers = container.child("textarea");
        let ln:HTMLTextAreaElement = $line_numbers.get(0);
        ln.value = "1\n2\n3\n4888";
        $line_numbers.addClass('line-numbers');

        this.type = filetype;

        this.hl = Highlighter.chooseHighlighter(this.type);

        this.textarea = $textarea;
        this.textarea_colors = $textarea_colors;

        this.codify();

    }

    private codify() {
        
        let $t = this.textarea;
        let $tc = this.textarea_colors;

        let t:HTMLTextAreaElement = $t.get(0);
        let tc:HTMLDivElement = $tc.get(0);

        

    }
}