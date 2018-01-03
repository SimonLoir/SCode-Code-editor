"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tabmanager_1 = require("../js/tabmanager/tabmanager");
/**
 * Renderer process for scode
 */
class SCode {
    set Tabmanager(tabmanager) {
        this._tabmanager = tabmanager;
    }
}
let scode = new SCode;
scode.Tabmanager = new tabmanager_1.default();
//# sourceMappingURL=renderer.js.map