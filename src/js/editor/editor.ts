import Highlighter from "./highlighters";
export default class Editor {

    private type: string;

    private hl: (element: ExtJsObject, code: string) => void;

    public textarea_colors: ExtJsObject;

    private ln: ExtJsObject;

    public last_cursor_position:CursorPosition;

    constructor(filetype: string, content: string, container: ExtJsObject) {
        
        
        let $textarea_colors = container.child('div');
        $textarea_colors.addClass("code-editor-colors");
        $textarea_colors.css('overflow', "auto");
        
        
        let $line_numbers = container.child("textarea");
        let ln: HTMLTextAreaElement = $line_numbers.get(0);
        this.ln = $line_numbers;
        $line_numbers.addClass('line-numbers');
        for (let i = 1; i < 200; i++) {
            $line_numbers.get(0).value += `${i}\n`;            
        }

        this.type = filetype;

        this.hl = Highlighter.chooseHighlighter(this.type);

        this.textarea_colors = $textarea_colors;

        this.codify(content);

    }

    private codify(initial_content: string) {

        //Some variables, it's easier to write ;-)
        let tc = this.textarea_colors;
        let ln = this.ln;

        //We clean everything
        tc.html('');
        //ln.value("");

        //We split the content into lines so that it will be faster to process (see https://simonloir.be/scode/doc/editor)
        let lines = initial_content.split(/\r?\n/);
        lines.forEach(line => {
            let HTMLLine: ExtJsObject = tc.child('pre')
            this.hl(HTMLLine, line.replace(/\t/g, "    "));
            HTMLLine.addClass('line');
            HTMLLine.get(0).contentEditable = true;
        });

        //We add an input listener and when it is triggered, it tries to highlight the current line
        tc.keyup((e: Event) => {
            
            let target:any = e.target;

            if(target.classList.contains('line')){
                target = target;
            }else{
                target = $('target').parent('.line').get(0);
            }

            let length_before = toolkit.getCursorPosition(target);

            this.last_cursor_position = {
                line: $(target),
                inline: length_before
            }

            console.log(this.last_cursor_position);
            
            this.hl(this.last_cursor_position.line, this.last_cursor_position.line.text());
            
        });

    }
}

class toolkit{
    public static getCursorPosition(target){
        let childNodes:Array<any> = target.childNodes;
        let selection = document.getSelection().getRangeAt(0);
        let length_before = 0;
        
        for (const node of childNodes) {
            if (node == selection.startContainer || node.contains(selection.startContainer))
                return length_before + selection.startOffset;

            if(node.nodeType == 1){                 
                length_before += node.innerText.length;
            }else if (node.nodeType == 3){
                length_before += node.data.length;
            }
        }
    }
}

interface CursorPosition{
    line:ExtJsObject,
    inline: Number
}