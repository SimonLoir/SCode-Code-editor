import Editor from "./../editor/editor";
import * as fs from "fs";
export default class Tab {

    private _filename:string;
    private _type:string;
    private _editor:Editor;

    constructor(filename:string, type:string){
        this._filename = filename;
        this._type = type;
    }

    public codeEditor(default_content:string, container:ExtJsObject){
        //Here comes the code editor
        this._editor = new Editor(this._type, default_content, container);
        container.keydown((e:KeyboardEvent) => {
            if(e.ctrlKey == true){
                if(e.key == "s"){
                    fs.writeFileSync(this._filename, this._editor.textarea_colors.text(), "utf8");
                }
            }
        })
    }

    public viewer(filename, container: ExtJsObject){
        let iframe = container.child('iframe');
        iframe.get(0).src = filename;
        iframe.css('position', "absolute");
        iframe.css('top', "0");
        iframe.css('left', "0");
        iframe.css('right', "0");
        iframe.css('bottom', "0");
        iframe.css('width', "100%");
        iframe.css('height', "100%");
        iframe.css('border', "none");
    }
}