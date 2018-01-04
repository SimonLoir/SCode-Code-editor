import * as fs from "fs";

interface ControlsBar{
    close_button: ExtJsObject
    minimize_button: ExtJsObject
    full_screen_button: ExtJsObject
    bar: ExtJsObject
}

export default class View {

    public version = "2.18.1";

    public ready = $(document).ready;

    public controls_bar: ControlsBar;

    public side_panel: ExtJsObject;

    private _language: any;

    public __tabmanager: ExtJsObject;

    /**
     * Gets a language pack from the res folder.
     * @param language The language of the language pack
     */
    private getLanguagePack(language: string): Object{
        
        let language_pack_location = __dirname + "/../res/lang-" + language + ".json";
        
        if(fs.existsSync(language_pack_location)){

            let language_pack_content = fs.readFileSync(language_pack_location, "utf-8");
            
            return JSON.parse(language_pack_content);
        
        }

        throw new Error("Cannot find language pack for scode");

    }

    /**
     * Method called to create the view.
     * @param language the global language of scode.
     */
    public init(language:string) {

        $('#scode_version').html(this.version);
        
        this._language = this.getLanguagePack(language);

        this.__tabmanager = $('#scode_tabmanager');

        $('#scode_explorer_title').html(this._language.explorer.toUpperCase());

        this.controls_bar = {
            bar: $('#scode_header'),
            close_button: $('.scode_controls#close'),
            minimize_button : $('.scode_controls#minimize'),
            full_screen_button: $('.scode_controls#fullscreen')
        }

        this.addEvents();
    }

    /**
     * Returns the global language pack.
     */
    public get language() {
        return this._language;
    }

    /**
     * Adds features on HTMLElements
     */
    public addEvents(){
        let app = require('electron').remote;
        var window = app.getCurrentWindow();
        
        this.controls_bar.close_button.click(function () {
            window.close();
        });

        this.controls_bar.minimize_button.click(function () {
            window.minimize();
        });

        this.controls_bar.full_screen_button.click(function () {
            if(window.isFullScreen() == true){

                window.setFullScreen(false);
                //$('#togglefullscreen i').removeClass('icon-resize-small');                
                //$('#togglefullscreen i').addClass('icon-resize-full');

            } else {

                window.setFullScreen(true);
                //$('#togglefullscreen i').removeClass('icon-resize-full');                                
                //$('#togglefullscreen i').addClass('icon-resize-small');
            }
        });


    }

}