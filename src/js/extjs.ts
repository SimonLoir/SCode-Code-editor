class ExtJsObject {

    private node: Array<HTMLElement>;

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
    html(html: string) {
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
     * @param {Function|Undefined} toDo function that is called when somebody clicks on the element  or undefined or nothing
     * @param  {String|Undefined} element specifies the element on which we are going to listen the click.
     */
    click(toDo: () => void, element: string) {

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
                        let xe:any = x.querySelector(element);
                        xe.prototype.toDo = toDo;
                        xe.toDo();
                    }
                });
            } else {
                var x = e;
                let xe:any = x.querySelector(element);
                xe.click();
            }

        }
        return this;
    }

}

/**
 * 
 * @param {String|Object|Array} e 
 * @param {Number} index 
 */
function $(e?, index?):ExtJsObject{
    if (e != undefined) {
        return new ExtJsObject(e, index);
    } else {
        return this;
    }
}