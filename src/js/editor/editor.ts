import Highlighter from "./highlighters";
export default class Editor {

    private type: string;

    private hl: (element: ExtJsObject, code: string) => void;

    public textarea_colors: ExtJsObject;

    private ln: ExtJsObject;

    public last_cursor_position: CursorPosition;

    constructor(filetype: string, content: string, container: ExtJsObject) {


        let $textarea_colors = container.child('div');
        $textarea_colors.addClass("code-editor-colors");
        $textarea_colors.css('overflow', "auto");


        let $line_numbers = container.child("textarea");
        let ln: HTMLTextAreaElement = $line_numbers.get(0);
        this.ln = $line_numbers;
        $line_numbers.addClass('line-numbers');

        this.type = filetype;

        this.hl = Highlighter.chooseHighlighter(this.type);

        this.textarea_colors = $textarea_colors;

        this.codify(content);

        $textarea_colors.get(0).onscroll = function () {
            $('.autocomplete').remove();
            $line_numbers.get(0).scrollTop = this.scrollTop;
        }

    }

    private codify(initial_content: string) {

        //Some variables, it's easier to write ;-)
        let tc = this.textarea_colors;
        let ln = this.ln;

        //We clean everything
        tc.html('');

        //We split the content into lines so that it will be faster to process (see https://simonloir.be/scode/doc/editor)
        let lines = initial_content.split(/\r?\n/);
        lines.forEach(line => {
            let HTMLLine: ExtJsObject = tc.child('pre')
            this.hl(HTMLLine, line.replace(/\t/g, "    "));
            HTMLLine.addClass('line');
            HTMLLine.get(0).contentEditable = true;
        });

        //We add an input listener and when it is triggered, it tries to highlight the current line
        tc.input((e: KeyboardEvent) => {
            let target: any = e.target;

            if (target.classList.contains('line')) {
                target = target;
            } else {
                target = $('target').parent('.line').get(0);
            }

            if (e.ctrlKey != true && e.keyCode != 13) {

                let length_before = this.updatePosition(target);

                this.hl(this.last_cursor_position.line, this.last_cursor_position.line.text());

                toolkit.setCaretPos(target, length_before);
            }

        });

        tc.keyup((e:KeyboardEvent) => {

            if (e.keyCode == 8) {

                let target: any = e.target;

                if (target.classList.contains('line')) {
                    target = $(target);
                } else {
                    target = $('target').parent('.line');
                }

                if (target.text() == "") {
                    
                    let sibling = target.prevSibling();
                    let length = sibling.text().length;
                    
                    sibling.get(0).focus();
                    
                    toolkit.setCaretPos(sibling.get(0), length);
                    
                    target.remove();

                    this.updateLineNumbers();

                }
            }

        });

        tc.keydown((e: KeyboardEvent) => {
            if (e.keyCode == 13) {
                e.preventDefault();

                let target: any = e.target;

                if (target.classList.contains('line')) {
                    target = target;
                } else {
                    target = $('target').parent('.line').get(0);
                }


                let nextSbibling = target.nextSibling;
                console.log(target)

                let new_pre;

                if (nextSbibling != undefined) {
                    new_pre = this.textarea_colors.get(0).insertBefore(document.createElement('pre'), nextSbibling);
                } else {
                    new_pre = this.textarea_colors.child('pre');
                }

                new_pre.contentEditable = true;
                new_pre.focus();
                new_pre = $(new_pre).addClass('line');

                this.updateLineNumbers();

            } else if (e.keyCode == 38 || e.keyCode == 40) {
                e.preventDefault();

                let target: any = e.target;

                if (target.classList.contains('line')) {
                    target = target;
                } else {
                    target = $('target').parent('.line').get(0);
                }


                if (e.keyCode == 38) {
                    $(target).prevSibling().get(0).focus();
                } else {
                    $(target).nextSibling().get(0).focus();
                }
            }else if (e.keyCode == 46) {

                let target: any = e.target;

                if (target.classList.contains('line')) {
                    target = $(target);
                } else {
                    target = $('target').parent('.line');
                }

                if (target.text() == "\n") {
                    
                    target.nextSibling().get(0).focus();

                    target.remove();

                    this.updateLineNumbers();

                }
            }
        });

        tc.get(0).onmousedown = function (e) {
            //might be usefull for selections
            //console.log(e);
        }

        this.updateLineNumbers();

    }

    private updatePosition(target) {
        let length_before = toolkit.getCursorPosition(target);

        this.last_cursor_position = {
            line: $(target),
            inline: length_before
        }

        return length_before;
    }

    private updateLineNumbers() {
        let $line_numbers = this.ln;
        $line_numbers.value('');
        for (let i = 1; i <= this.textarea_colors.get(0).querySelectorAll('.line').length; i++) {
            $line_numbers.get(0).value += `${i}\n`;
        }
    }
}

class toolkit {
    public static getCursorPosition(target) {
        let childNodes: Array<any> = target.childNodes;
        let selection = document.getSelection().getRangeAt(0);
        let length_before = 0;

        for (const node of childNodes) {
            if (node == selection.startContainer || node.contains(selection.startContainer))
                return length_before + selection.startOffset;

            if (node.nodeType == 1) {
                length_before += node.innerText.length;
            } else if (node.nodeType == 3) {
                length_before += node.data.length;
            }
        }
    }
    // from (en) https://social.msdn.microsoft.com/Forums/fr-FR/f91341cb-48b3-424b-9504-f2f569f4860f/getset-caretcursor-position-in-a-contenteditable-div?forum=winappswithhtml5
    public static setCaretPos(el, sPos) {
        var charIndex = 0, range = document.createRange();
        range.setStart(el, 0);
        range.collapse(true);
        var nodeStack = [el], node, foundStart = false, stop = false;

        while (!stop && (node = nodeStack.pop())) {
            if (node.nodeType == 3) {
                var nextCharIndex = charIndex + node.length;
                if (!foundStart && sPos >= charIndex && sPos <= nextCharIndex) {
                    range.setStart(node, sPos - charIndex);
                    foundStart = true;
                }
                if (foundStart && sPos >= charIndex && sPos <= nextCharIndex) {
                    range.setEnd(node, sPos - charIndex);
                    stop = true;
                }
                charIndex = nextCharIndex;
            } else {
                var i = node.childNodes.length;
                while (i--) {
                    nodeStack.push(node.childNodes[i]);
                }
            }
        }
        let selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

interface CursorPosition {
    line: ExtJsObject,
    inline: Number
}