if (!Element.prototype.matches)
    Element.prototype.matches = Element.prototype.msMatchesSelector ||
        Element.prototype.webkitMatchesSelector;
if (!Element.prototype.closest)
    Element.prototype.closest = function (s) {
        var el = this;
        if (!document.documentElement.contains(el))
            return null;
        do {
            if (el.matches(s))
                return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null);
        return null;
    };
function $(e, index) {
    this.ajax = new ExtJsAjaxRequestObject();
    if (e != undefined) {
        return new ExtJsObject(e, index);
    }
    else {
        return this;
    }
}
function ExtJsObject(element, e_index) {
    var re;
    if (typeof (element) === "string") {
        re = document.querySelectorAll(element);
        if (e_index != undefined) {
            re = [re[e_index]];
        }
    }
    else if (element == undefined || element == document) {
        this.ready = function (toDo) {
            document.addEventListener("DOMContentLoaded", toDo);
        };
        return this;
    }
    else if (typeof (element) === "object") {
        if (element.length == undefined) {
            re = [element];
        }
        else if (e_index != undefined) {
            re = [element[e_index]];
        }
        else {
            re = element;
        }
    }
    else if (element.type == "ExtJsObject") {
        return element;
    }
    else {
        return false;
    }
    this.type = "ExtJsObject";
    this.node = re;
    this.html = function (html) {
        for (var i = 0; i < this.node.length; i++) {
            var e = this.node[i];
            if (typeof (html) === "string" || typeof (html) === "number") {
                e.innerHTML = html;
            }
            else {
                return e.innerHTML;
            }
        }
        return this;
    };
    this.click = function (toDo, element) {
        for (var i = 0; i < this.node.length; i++) {
            var e = this.node[i];
            if (element === undefined) {
                if (toDo !== undefined) {
                    e.addEventListener("click", toDo);
                }
                else {
                    e.click();
                }
            }
            else if (toDo !== undefined) {
                var x = e;
                e.addEventListener("click", function (event) {
                    if (x.querySelector(element) == event.target) {
                        var xe = x.querySelector(element);
                        xe.toDo = toDo;
                        xe.toDo();
                    }
                });
            }
            else {
                var x = e;
                var xe = x.querySelector(element);
                xe.click();
            }
        }
        return this;
    };
    this.get = function (index) {
        if (index != undefined) {
            if (this.node[index] == undefined)
                throw new IndexOutOfArrayExecption("ExtJsObject.get undefined index node[" + index + "]");
            return this.node[index];
        }
        else {
            if (this.node[0] == undefined)
                throw new IndexOutOfArrayExecption("ExtJsObject.get undefined index node[0]");
            return this.node[0];
        }
    };
    this.height = function (value) {
        for (var i = 0; i < this.node.length; i++) {
            var e = this.node[i];
            if (value !== undefined) {
                e.style.height = value;
            }
            else {
                return e.offsetHeight;
            }
        }
        return this;
    };
    this.width = function (value) {
        for (var i = 0; i < this.node.length; i++) {
            var e = this.node[i];
            if (value !== undefined) {
                e.style.width = value;
            }
            else {
                return e.offsetWidth;
            }
        }
        return this;
    };
    this.addClass = function (classx) {
        for (var i = 0; i < this.node.length; i++) {
            var e = this.node[i];
            e.classList.add(classx);
        }
        return this;
    };
    this.removeClass = function (classx) {
        for (var i = 0; i < this.node.length; i++) {
            var e = this.node[i];
            e.classList.remove(classx);
        }
        return this;
    };
    this.remove = function () {
        for (var i = 0; i < this.node.length; i++) {
            var e = this.node[i];
            e.parentElement.removeChild(e);
        }
    };
    this.child = function (element_type) {
        var e_list = [];
        for (var i = 0; i < this.node.length; i++) {
            var e = this.node[i];
            var elem = document.createElement(element_type);
            e.appendChild(elem);
            e_list.push(elem);
        }
        return $(e_list);
    };
    this.css = function (prop, value, i) {
        var y = i;
        if (i == undefined) {
            i = 0;
        }
        if (value == undefined) {
            return this.node[i].style[prop];
        }
        else if (y != undefined) {
            this.node[i].style[prop] = value;
            return this;
        }
        else {
            for (var i = 0; i < this.node.length; i++) {
                var e = this.node[i];
                e.style[prop] = value;
            }
            return this;
        }
    };
    this.parent = function (selector) {
        var parents = [];
        for (var i = 0; i < this.node.length; i++) {
            var e = this.node[i];
            if (selector == undefined) {
                parents.push(e.parentElement);
            }
            else {
                parents.push(e.closest(selector));
            }
        }
        return $(parents);
    };
}
var AR = new ExtJsAjaxRequestObject();
function ExtJsAjaxRequestObject() {
    this.GET = function (url, func, error) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                func(xhttp.responseText);
            }
            else if (xhttp.readyState == 4) {
                if (error != undefined) {
                    try {
                        error();
                    }
                    catch (e) {
                    }
                }
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    };
    this.DELETE = function (url, func, error) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                func(xhttp.responseText);
            }
            else if (xhttp.readyState == 4) {
                if (error != undefined) {
                    try {
                        error();
                    }
                    catch (e) {
                    }
                }
            }
        };
        xhttp.open("GET", url, true);
        xhttp.setRequestHeader("x-http-method-override", "DELETE");
        xhttp.send();
    };
    this.POST = function (url, data, func, error) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                func(xhttp.responseText);
            }
            else if (xhttp.readyState == 4) {
                if (error != undefined) {
                    try {
                        error();
                    }
                    catch (e) {
                    }
                }
            }
        };
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
    };
    this.PUT = function (url, data, func, error) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                func(xhttp.responseText);
            }
            else if (xhttp.readyState == 4) {
                if (error != undefined) {
                    try {
                        error();
                    }
                    catch (e) {
                    }
                }
            }
        };
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
    };
}
function IndexOutOfArrayExecption(message) {
    this.message = message;
    this.name = "IndexOutOfArrayException";
}
