import Tabmanager from "../js/tabmanager/tabmanager";
import $ from "extjs";
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
$('test').child({

});
let scode = new SCode;
scode.Tabmanager = new Tabmanager();