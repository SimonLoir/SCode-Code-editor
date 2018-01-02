/**
 * Polyfills
 */
if (!Element.prototype.matches)
    Element.prototype.matches = Element.prototype.msMatchesSelector ||
        Element.prototype.webkitMatchesSelector;

if (!Element.prototype.closest)
    Element.prototype.closest = function (s:any) {
        var el = this;
        if (!document.documentElement.contains(el)) return null;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null);
        return null;
    };

/**
 * 
 * @param {String|Object|Array} e 
 * @param {Number} index 
 */
function $(e:any, index?:any) {
    this.ajax = new ExtJsAjaxRequestObject();
    if (e != undefined) {
        return new ExtJsObject(e, index);
    } else {
        return this;
    }
}
/**
 * 
 * @param {*} element 
 * @param {*} e_index 
 */
function ExtJsObject(element:any, e_index:any) {
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
        this.ready = function (toDo:any) {
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
        return false;
    }

    this.type = "ExtJsObject";
    this.node = re;

    /**
     * @param {String} html HTML to put inside the element or undefined or nothing
     * @return {String|Object} HTML that is inside the first element or the current instance.
     */
    this.html = function (html:any) {
        for (var i = 0; i < this.node.length; i++) {
            var e = this.node[i];

            if (typeof (html) === "string" || typeof (html) === "number") {
                e.innerHTML = html;
            } else {
                return e.innerHTML;
            }
        }
        return this;
    }

    /**
     * @param {Function|Undefined} toDo function that is called when somebody click on the element  or undefined or nothing
     * @param  {String|Undefined} element specifies the element on which we are going to listen the click.
     */
    this.click = function (toDo:any, element:any) {

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
                e.addEventListener("click", function (event:any) {
                    if (x.querySelector(element) == event.target) {
                        let xe = x.querySelector(element);
                        xe.toDo = toDo;
                        xe.toDo();
                    }
                });
            } else {
                var x = e;
                let xe = x.querySelector(element);
                xe.click();
            }

        }
        return this;
    }

    /**
     * @param {Number|String} index index of the element or undefined or nothing
     * @return {Object} a DOM element
     */
    this.get = function (index:any) {
        if (index != undefined) {
            if (this.node[index] == undefined) throw new IndexOutOfArrayExecption("ExtJsObject.get undefined index node[" + index + "]");
            return this.node[index];
        } else {
            if (this.node[0] == undefined) throw new IndexOutOfArrayExecption("ExtJsObject.get undefined index node[0]");
            return this.node[0];
        }
    }

    /**
     * @param {String} value the height of the element (and units (em / px / cm, etc)) or undefined or nothing
     * @return {Object|Number} Object if value != undefined and Number if value == undefined
     */
    this.height = function (value:any) {
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
     * @param {String} value the width of the element (and units (em / px / cm, etc)) or undefined or nothing
     * @return {Object|Number} Object if value != undefined and Number if value == undefined
     */
    this.width = function (value) {
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
     * @param {String} classx class to add to the classlist of the element
     * @return {Object} the current instance of ExtJs
     */
    this.addClass = function (classx) {
        for (var i = 0; i < this.node.length; i++) {
            var e = this.node[i];
            e.classList.add(classx);

        }
        return this;
    }

    /**
     * @param {String} classx class to remove from the classlist of the element
     * @return {Object} the current instance of ExtJs
     */
    this.removeClass = function (classx) {
        for (var i = 0; i < this.node.length; i++) {
            var e = this.node[i];
            e.classList.remove(classx);

        }
        return this;
    }

    /**
     * Delete the element(s)
     */
    this.remove = function () {
        for (var i = 0; i < this.node.length; i++) {
            var e = this.node[i];
            e.parentElement.removeChild(e);

        }
    }
    /**
     * @param {String} element_type element to createElement
     * @return {Array} element list in an ExtJsObject
     */
    this.child = function (element_type) {
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
     * @param {String} prop The css proprety that we want to modify.
     * @param {String} value The value that we want to assign to that property 
     * @param {Number} i the index of the element (optional)
     */
    this.css = function (prop, value, i) {
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
            for (var i = 0; i < this.node.length; i++) {
                var e = this.node[i];
                e.style[prop] = value;
            }
            return this;
        }
    }
    this.parent = function (selector) {

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
}



var AR = new ExtJsAjaxRequestObject(); // AjaxRequest with ExtJs

function ExtJsAjaxRequestObject() {

    /**
     * @param {String} url URL of the resource
     * @param {Function} func function which is called when the request has been performed correctly
     * @param {Function} error function which is called when the request has not been performed correctly
     */
    this.GET = function (url, func, error) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                func(xhttp.responseText);
            } else if (xhttp.readyState == 4) {

                if (error != undefined) {
                    try {
                        error();
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
     * @param {Function} func function which is called when the request has been performed correctly
     * @param {Function} error function which is called when the request has not been performed correctly
     */
    this.DELETE = function (url, func, error) {
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                func(xhttp.responseText);
            } else if (xhttp.readyState == 4) {

                if (error != undefined) {
                    try {
                        error();
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
     * @param {Function} func function which is called when the request has been performed correctly
     * @param {Function} error function which is called when the request has not been performed correctly
     */
    this.POST = function (url, data, func, error) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                func(xhttp.responseText);
            } else if (xhttp.readyState == 4) {

                if (error != undefined) {
                    try {
                        error();
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
     * @param {Function} func function which is called when the request has been performed correctly
     * @param {Function} error function which is called when the request has not been performed correctly
     */
    this.PUT = function (url, data, func, error) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                func(xhttp.responseText);
            } else if (xhttp.readyState == 4) {

                if (error != undefined) {
                    try {
                        error();
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


/* Exceptions */

function IndexOutOfArrayExecption(message:any) {
    this.message = message;
    this.name = "IndexOutOfArrayException";
}