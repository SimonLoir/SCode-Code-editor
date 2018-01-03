export default class Settings{
    private _settings: Object;
    /** 
     * Loads the settings of the code editor
    */
    constructor (){
        this.load();
    }

    private load():void{
        this._settings = {}
    }
}