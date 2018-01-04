import * as fs from "fs";

interface ControlsBar{
    close_button: ExtJsObject
    minimize_button: ExtJsObject
    full_screen_button: ExtJsObject
    bar: ExtJsObject
}
export default class View {

    public version = "2.18";

    public ready = $(document).ready;

    public controls_bar: ControlsBar;

    public side_panel: ExtJsObject;

    private language: Object;

    private getLanguagePack(language: string): Object{
        
        let language_pack_location = __dirname + "/../res/lang-" + language + ".json";
        
        if(fs.existsSync(language_pack_location)){

            let language_pack_content = fs.readFileSync(language_pack_location, "utf-8");
            
            return JSON.parse(language_pack_content);
        
        }

        throw new Error("Cannot find language pack for scode");

    }

    public init(language:string) {

        $('#scode_version').html(this.version + ":" + language);
        
        this.language = this.getLanguagePack(language);

    }

}