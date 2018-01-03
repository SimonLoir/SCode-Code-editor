/**
 ****************************  MODULES  ****************************
 */
import Settings from "../js/settings/settings";
import Tabmanager from "../js/tabmanager/tabmanager";

/**
 ****************************  SCODE CORE  ****************************
 */
class SCode {
    
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

let scode = new SCode;
scode.settings = new Settings;
scode.tabmanager = new Tabmanager(scode.settings.getLastOpenedFiles());
if(scode.settings.isFirstUse == true){
    scode.tabmanager.newTab("d");
}



