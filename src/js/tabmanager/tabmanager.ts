import * as path from "path";
import * as fs from "fs";
/** 
 * This file is part of the tabmanager module.
 */
export default class Tabmanager{
    
    private _tabs: any[] = [];
    private _tabmanager: ExtJsObject;
    private _language: Object;

    /**
     * Creates a new tabmanager
     * @param default_files Files that have to be opened on startup
     */
    constructor(default_files?:Array<string>){

        if(default_files != undefined){

            default_files.forEach(file => {
                
                this.newTab(file)

            });

        }

    }

    /**
     * Creates a new tab in the tabmanager
     * @param filename the name of the file. 
     */
    public newTab(filename: string, editor?:boolean) {

        //Default behavior : tries to create a code editor for the file.
        if(editor == undefined){
            editor = true;
        }

        if(!fs.existsSync(filename)){
            
            throw new Error("Cannot open the file because the file doesn't exist");
        }

               
        
    }

    /**
     * Sets the language of the tabmanager
     */
    public set language(languagePack) {
        this._language = languagePack;
    }
    

}