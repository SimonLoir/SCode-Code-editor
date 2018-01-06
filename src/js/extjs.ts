function IndexOutOfArrayExecption(message) {
    this.message = message;
    this.name = "IndexOutOfArrayException";
}

class ExtJsObject {

    private node: Array<any>;

    public type: string;

    public ready;

    constructor(element?, e_index?) {
        var re;

        if (typeof (element) === "string") {
            re = document.querySelectorAll(element);
            if (e_index != undefined) {
                re = [re[e_index]];
            }
        } else if (element == undefined || element == document) {
            /**
             * @param {Function} toDo function that is called when the document has been loaded
             */
            this.ready = function (toDo) {
                document.addEventListener("DOMContentLoaded", toDo);
            }
            return this;
        } else if (typeof (element) === "object") {
            if (element.length == undefined) {
                re = [element];
            } else if (e_index != undefined) {
                re = [element[e_index]];
            } else {
                re = element;
            }
        } else if (element.type == "ExtJsObject") {
            return element;
        } else {
            return;
        }

        this.type = "ExtJsObject";
        this.node = re;
    }

    /**
     * @param {String} html HTML to put inside the element or undefined or nothing
     * @return {String|Object} HTML that is inside the first element or the current instance.
     */
    html(html?: string) {
        if(html != undefined){
            for (var i = 0; i < this.node.length; i++) {
                var e = this.node[i];
    
                if (typeof (html) === "string" || typeof (html) === "number") {
                    e.innerHTML = html;
                }
            }
            return this;
        }else{
            return this.node[0].innerHTML;
        }
    }

    /**
     * @param {Function|Undefined} toDo function that is called when somebody clicks on the element  or undefined or nothing
     * @param {String|Undefined} element specifies the element on which we are going to listen the click.
     */
    click(toDo?: (event?:Event) => void, element?: string) {

        for (var i = 0; i < this.node.length; i++) {
            var e = this.node[i];

            if (element === undefined) {
                if (toDo !== undefined) {
                    e.addEventListener("click", toDo);
                } else {
                    e.click();
                }
            } else if (toDo !== undefined) {
                var x = e;
                e.addEventListener("click", function (event) {
                    if (x.querySelector(element) == event.target) {
                        let xe: any = x.querySelector(element);
                        xe.prototype.toDo = toDo;
                        xe.toDo();
                    }
                });
            } else {
                var x = e;
                let xe: any = x.querySelector(element);
                xe.click();
            }

        }
        return this;
    }

    /**
     * @param index index of the element or undefined or nothing
     * @return {Object} a DOM element
     */
    get(index: any):any{
        if (index != undefined) {
            if (this.node[index] == undefined) throw new IndexOutOfArrayExecption("ExtJsObject.get undefined index node[" + index + "]");
            return this.node[index];
        } else {
            if (this.node[0] == undefined) throw new IndexOutOfArrayExecption("ExtJsObject.get undefined index node[0]");
            return this.node[0];
        }
    }
    /**
     * @param value the height of the element (and units (em / px / cm, etc)) or undefined or nothing
     * @return {Object|Number} Object if value != undefined and Number if value == undefined
     */
    height(value?) {
        for (var i = 0; i < this.node.length; i++) {
            var e = this.node[i];
            if (value !== undefined) {
                e.style.height = value;
            } else {
                return e.offsetHeight;
            }
        }
        return this;
    }
    /**
     * @param value the width of the element (and units (em / px / cm, etc)) or undefined or nothing
     * @return {Object|Number} Object if value != undefined and Number if value == undefined
     */
    width(value?) {
        for (var i = 0; i < this.node.length; i++) {
            var e = this.node[i];
            if (value !== undefined) {
                e.style.width = value;
            } else {
                return e.offsetWidth;
            }
        }
        return this;
    }
    /**
     * @param classx class to add to the classlist of the element
     * @return {Object} the current instance of ExtJs
     */
    addClass(classx: string) {
        for (var i = 0; i < this.node.length; i++) {
            var e = this.node[i];
            e.classList.add(classx);

        }
        return this;
    }

    /**
     * @param classx class to remove from the classlist of the element
     * @return {Object} the current instance of ExtJs
     */
    removeClass(classx: string) {
        for (var i = 0; i < this.node.length; i++) {
            var e = this.node[i];
            e.classList.remove(classx);

        }
        return this;
    }

    /**
     * Delete the element(s)
     */
    remove() {
        for (var i = 0; i < this.node.length; i++) {
            var e = this.node[i];
            e.parentElement.removeChild(e);
        }
    }
    /**
     * @param element_type element to createElement
     * @return {Array} element list in an ExtJsObject
     */
    child(element_type: string) {
        var e_list = [];
        for (var i = 0; i < this.node.length; i++) {
            var e = this.node[i];
            var elem = document.createElement(element_type);
            e.appendChild(elem);
            e_list.push(elem);
        }
        return $(e_list);
    }
    /**
     * @param prop The css proprety that we want to modify.
     * @param value The value that we want to assign to that property 
     * @param i the index of the element (optional)
     */
    css(prop: string, value: string, i?) {
        var y = i;
        if (i == undefined) {
            i = 0;
        }
        if (value == undefined) {
            return this.node[i].style[prop];
        } else if (y != undefined) {
            this.node[i].style[prop] = value;
            return this;
        } else {
            for (let i = 0; i < this.node.length; i++) {
                var e = this.node[i];
                e.style[prop] = value;
            }
            return this;
        }
    }
    /**
     * Returns the nearest parent of the element's
     * @param selector The selector of the nearest parent
     */
    parent(selector) {
        var parents = [];

        for (var i = 0; i < this.node.length; i++) {
            var e = this.node[i]; 
            if (selector == undefined) {
                parents.push(e.parentElement);
            }else{
                parents.push(e.closest(selector));
            }
        }

        return $(parents);
    }
    /**
     * @param {String} html Text to put inside the element or undefined or nothing
     * @return {String|Object} Text that is inside the first element or the current instance.
     */
    value(text?: string) {
        if(text != undefined){
            for (var i = 0; i < this.node.length; i++) {
                var e:HTMLTextAreaElement = this.node[i];
    
                if (typeof (text) === "string" || typeof (text) === "number") {
                    e.value = text;
                }
            }
            return this;
        }else{
            let node:HTMLTextAreaElement = this.node[0];
            return this.node[0].value;
        }
    }

    /**
     * @param {Function|Undefined} toDo function that is called when somebody keypress on the element  or undefined or nothing
     * @param {String|Undefined} element specifies the element on which we are going to listen the keypress.
     */
    keypress(toDo?: (event?:Event) => void, element?: string) {

        for (var i = 0; i < this.node.length; i++) {
            var e = this.node[i];

            if (element === undefined) {
                if (toDo !== undefined) {
                    e.addEventListener("keypress", toDo);
                }
            } else if (toDo !== undefined) {
                var x = e;
                e.addEventListener("keypress", function (event) {
                    if (x.querySelector(element) == event.target) {
                        let xe: any = x.querySelector(element);
                        xe.prototype.toDo = toDo;
                        xe.toDo();
                    }
                });
            }

        }
        return this;
    }

    /**
     * @param {Function|Undefined} toDo function that is called when somebody input on the element  or undefined or nothing
     * @param {String|Undefined} element specifies the element on which we are going to listen the input.
     */
    input(toDo?: (event?:Event) => void, element?: string) {

        for (var i = 0; i < this.node.length; i++) {
            var e = this.node[i];

            if (element === undefined) {
                if (toDo !== undefined) {
                    e.addEventListener("input", toDo);
                }
            } else if (toDo !== undefined) {
                var x = e;
                e.addEventListener("input", function (event) {
                    if (x.querySelector(element) == event.target) {
                        let xe: any = x.querySelector(element);
                        xe.prototype.toDo = toDo;
                        xe.toDo();
                    }
                });
            }

        }
        return this;
    }

    /**
     * @param {Function|Undefined} toDo function that is called when somebody keydown on the element  or undefined or nothing
     * @param {String|Undefined} element specifies the element on which we are going to listen the keydown.
     */
    keydown(toDo?: (event?:Event) => void, element?: string) {

        for (var i = 0; i < this.node.length; i++) {
            var e = this.node[i];

            if (element === undefined) {
                if (toDo !== undefined) {
                    e.addEventListener("keydown", toDo);
                }
            } else if (toDo !== undefined) {
                var x = e;
                e.addEventListener("keydown", function (event) {
                    if (x.querySelector(element) == event.target) {
                        let xe: any = x.querySelector(element);
                        xe.prototype.toDo = toDo;
                        xe.toDo();
                    }
                });
            }

        }
        return this;
    }

    /**
     * @param {Function|Undefined} toDo function that is called when somebody keyup on the element  or undefined or nothing
     * @param {String|Undefined} element specifies the element on which we are going to listen the keyup.
     */
    keyup(toDo?: (event?:Event) => void, element?: string) {

        for (var i = 0; i < this.node.length; i++) {
            var e = this.node[i];

            if (element === undefined) {
                if (toDo !== undefined) {
                    e.addEventListener("keyup", toDo);
                }
            } else if (toDo !== undefined) {
                var x = e;
                e.addEventListener("keyup", function (event) {
                    if (x.querySelector(element) == event.target) {
                        let xe: any = x.querySelector(element);
                        xe.prototype.toDo = toDo;
                        xe.toDo();
                    }
                });
            }

        }
        return this;
    }

}

class AjaxRequest {
    /**
    * @param {String} url URL of the resource
    * @param {Function} callback function which is called when the request has been performed correctly
    * @param {Function} error_callback function which is called when the request has not been performed correctly
    */
    public GET(url: string, callback: (data: string) => void, error_callback?: () => void){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                callback(xhttp.responseText);
            } else if (xhttp.readyState == 4) {

                if (error_callback != undefined) {
                    try {
                        error_callback();
                    } catch (e) {

                    }
                }

            }
        }
        xhttp.open("GET", url, true);
        xhttp.send();
    }
    /**
    * @param {String} url URL of the resource
    * @param {Function} callback function which is called when the request has been performed correctly
    * @param {Function} error_callback function which is called when the request has not been performed correctly
    */
    public DELETE(url: string, callback: (data: string) => void, error_callback?: () => void){
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                callback(xhttp.responseText);
            } else if (xhttp.readyState == 4) {

                if (error_callback != undefined) {
                    try {
                        error_callback();
                    } catch (e) {

                    }
                }

            }
        }
        xhttp.open("GET", url, true);
        xhttp.setRequestHeader("x-http-method-override", "DELETE");

        xhttp.send();
    }
    /**
    * @param {String} url URL of the resource
    * @param {Array} data assoc array with the data that will be sent
    * @param {Function} callback function which is called when the request has been performed correctly
    * @param {Function} error_callback function which is called when the request has not been performed correctly
    */
    public POST(url: string, data: Object, callback: (data: string) => void, error_callback?: () => void){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                callback(xhttp.responseText);
            } else if (xhttp.readyState == 4) {

                if (error_callback != undefined) {
                    try {
                        error_callback();
                    } catch (e) {

                    }
                }

            }
        }
        xhttp.open("POST", url, true);
        var keys = Object.keys(data);
        var d = "";
        for (var i = 0; i < keys.length; i++) {
            if (i !== 0) {
                d = d + "&";
            }
            d = d + keys[i] + "=" + data[keys[i]];
        }
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(d);
    }
    /**
    * @param {String} url URL of the resource
    * @param {Array} data assoc array with the data that will be sent
    * @param {Function} callback function which is called when the request has been performed correctly
    * @param {Function} error_callback function which is called when the request has not been performed correctly
    */
    public PUT(url: string, data: Object, callback: (data: string) => void, error_callback?: () => void){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                callback(xhttp.responseText);
            } else if (xhttp.readyState == 4) {

                if (error_callback != undefined) {
                    try {
                        error_callback();
                    } catch (e) {

                    }
                }

            }
        }
        xhttp.open("POST", url, true);
        var keys = Object.keys(data);
        var d = "";
        for (var i = 0; i < keys.length; i++) {
            if (i !== 0) {
                d = d + "&";
            }
            d = d + keys[i] + "=" + data[keys[i]];
        }
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.setRequestHeader("x-http-method-override", "PUT");
        xhttp.send(d);
    }
}
var AR = new AjaxRequest();
/**
 * 
 * @param {String|Object|Array} e 
 * @param {Number} index 
 */
function $(e?, index?): ExtJsObject {
    if (e != undefined) {
        return new ExtJsObject(e, index);
    } else {
        return this;
    }
}

