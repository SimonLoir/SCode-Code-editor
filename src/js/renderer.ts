/**
 ****************************  MODULES  ****************************
 */
import Settings from "../js/settings/settings";
import Tabmanager from "../js/tabmanager/tabmanager";
import View from "../js/view";

/**
 ****************************  SCODE CORE  ****************************
 */
class SCode extends View{
    
    private _tabmanager:Tabmanager;
    private _settings:Settings;

    public set tabmanager(tabmanager: Tabmanager) {
        this._tabmanager = tabmanager;
    }

    public get tabmanager(): Tabmanager{
        return this._tabmanager;
    }
    
    
    public set settings(settings: Settings) {
        this._settings = settings;
    }
    
    
    public get settings(): Settings {
        return this._settings;
    }
    
}

/**
 ****************************  SCODE INIT ****************************
 */

// New instance of scode 
let scode = new SCode;

// When all the modules have been loaded and when the style is loaded.
scode.ready(() => {

    // Loads the setings from .scode
    scode.settings = new Settings;

    // Creates a new tabmaanger and loads the last files that were opened when scode has been closed teh last time
    scode.tabmanager = new Tabmanager(scode.settings.getLastOpenedFiles());

    // We init scode with the right language
    scode.init(scode.settings.get('language'));

    // Sets the language of the code tabmanager
    scode.tabmanager.language = scode.language;

    // If it's the fist time that scode is loaded, it shows the readme file
    if(scode.settings.isFirstUse == true){
        scode.tabmanager.newTab(__dirname + "../readme.md", false);
    }   

    scode.tabmanager.newTab("dd", false);

});
