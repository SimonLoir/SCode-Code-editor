import * as fs from "fs";
import * as os from "os";

export default class Settings{
    
    private default_settings = {
        always_show_explorer: true,
        theme:"../css/simonloir.scode.dark.css",
        color_scheme: "../css/simonloir.scode.hl.css",
        language: "en"
    }

    private _settings: Object;

    private scode_dir = os.homedir() + "/.scode/";

    private scode_opned_files_dir = this.scode_dir + "files.2.0.json";

    constructor (){
        this.load();
    }

    /**
     * Loads the settings of the editor.
     */
    private load():void{
        this._settings = this.default_settings;
    }

    /**
     * Sets a setting in scode configuration file
     * @param key 
     * @param value 
     */
    public set(key:string, value:string){
        this._settings[key] = value;
    }

    /**
     * Gets the whole settings or only one
     * @param key 
     */
    public get(key?:string){
        if(key != undefined){
            return this._settings[key];
        }else{
            return this._settings;
        }
    }

    /**
     * Gets the last files that where opened in the tabmanager
     */
    public getLastOpenedFiles():Array<string>{

        if(fs.existsSync(this.scode_opned_files_dir) == true){
            return JSON.parse(fs.readFileSync(this.scode_opned_files_dir, "utf-8"));
        }else{
            return [];
        }

    }

    /**
     * Verfifies if it's the first time that scode is started.
     */
    public get isFirstUse (){
        if(fs.existsSync(this.scode_dir)){
            return false;
        }
        return true;
    }
}