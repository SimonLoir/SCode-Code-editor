import Settings from "../js/settings/settings";
import Tabmanager from "../js/tabmanager/tabmanager";
/**
 * Renderer process for scode
 */
class SCode {
    
    private _tabmanager:any;

    set Tabmanager(tabmanager:any) {
        this._tabmanager = tabmanager;
    }

    get Tabmanager(){
        return this._tabmanager;
    }
}



let scode = new SCode;
scode.Tabmanager = new Tabmanager();
let s = new Settings();