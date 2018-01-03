import Tabmanager from "../js/tabmanager/tabmanager";
import {$, AR} from "extjs";
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
AR.GET('dd', function() {

}, function () {

});
let scode = new SCode;
scode.Tabmanager = new Tabmanager();