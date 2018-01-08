import * as fs from "fs";
import { BrowserWindow } from "electron";
import Tabmanager from "./tabmanager/tabmanager";
import Settings from "./settings/settings";

interface ControlsBar {
    close_button: ExtJsObject
    minimize_button: ExtJsObject
    full_screen_button: ExtJsObject
    bar: ExtJsObject
}

export default class View {

    public settings:Settings;

    public tabmanager:Tabmanager;

    public version = "2.18.1";

    public ready = $(document).ready;

    public controls_bar: ControlsBar;

    public side_panel: ExtJsObject;

    private _language: any;

    public __tabmanager: ExtJsObject;

    public open_file_buttons: ExtJsObject;

    public open_folder_buttons: ExtJsObject;

    /**
     * Gets a language pack from the res folder.
     * @param language The language of the language pack
     */
    private getLanguagePack(language: string): Object {

        let language_pack_location = __dirname + "/../res/lang-" + language + ".json";

        if (fs.existsSync(language_pack_location)) {

            let language_pack_content = fs.readFileSync(language_pack_location, "utf-8");

            return JSON.parse(language_pack_content);

        }

        throw new Error("Cannot find language pack for scode");

    }

    /**
     * Method called to create the view.
     * @param language the global language of scode.
     */
    public init(language: string) {

        $('#scode_version').html(this.version);

        this._language = this.getLanguagePack(language);

        this.__tabmanager = $('#scode_tabmanager');

        $("#scode-welcome").html(this._language["scode-welcome"]);

        $('#scode_default_button_open_file').html(this._language["open-file"]);

        this.open_file_buttons = $('.open_file');

        this.open_folder_buttons = $('#scode_default_button_open_folder').html(this._language["open-folder"]);

        $('#scode_explorer_title').html(this._language.explorer.toUpperCase());

        this.controls_bar = {
            bar: $('#scode_header'),
            close_button: $('.scode_controls#close'),
            minimize_button: $('.scode_controls#minimize'),
            full_screen_button: $('.scode_controls#fullscreen')
        }

        this.controls_bar.full_screen_button.addClass('icon-resize-full');

        this.addEvents();

        var link_theme = document.body.appendChild(document.createElement('link'));
        link_theme.href = this.settings.get('theme');
        link_theme.rel = "stylesheet";

        var link = document.body.appendChild(document.createElement('link'));
        link.href = this.settings.get('color_scheme');
        link.rel = "stylesheet";
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
    public addEvents() {
        let app = require('electron').remote;
        let dialog = app.dialog;
        var window = app.getCurrentWindow();

        this.controls_bar.close_button.click(() => {
            window.close();
        });

        this.controls_bar.minimize_button.click(() => {
            window.minimize();
        });

        this.controls_bar.full_screen_button.click(() => {

            let e = $(this);

            if (window.isFullScreen() == true) {

                window.setFullScreen(false);
                e.removeClass('icon-resize-small');
                e.addClass('icon-resize-full');

            } else {

                window.setFullScreen(true);
                e.removeClass('icon-resize-full');
                e.addClass('icon-resize-small');

            }
        });

        this.open_file_buttons.click(() => {
            dialog.showOpenDialog({properties: ["openFile"]}, files => {
                
                if(!files || files == null){
                    //an error occurred
                    console.log(files);
                    return false;
                }

                files.forEach(file => {
                    this.tabmanager.newTab(file);
                });

            })
        })


    }

}