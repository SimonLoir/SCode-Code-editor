/**
 ****************************  MODULES  ****************************
 */
import Settings from "../js/settings/settings";
import Tabmanager from "../js/tabmanager/tabmanager";

/**
 ****************************  SCODE CORE  ****************************
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

/**
 ****************************  SCODE INIT ****************************
 */
$(document).ready(function () {
    let scode = new SCode;
    scode.Tabmanager = new Tabmanager();
    let s = new Settings();
});
