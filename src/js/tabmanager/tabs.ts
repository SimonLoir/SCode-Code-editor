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

    public viewer(){
        //Here comes a view
    }
}