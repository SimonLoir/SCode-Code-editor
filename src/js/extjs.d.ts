/**
 * This file contains all the documentation about extjs for typescript
 */
interface ExtJsObject {
    /**
     * Calls the callback when the document is fully loaded.
     * @param callback Function that is called when the document is ready.
     */
    ready(callback: () => void)
    /**
     * It calls the callback when the user performs a click on a sepcific element or it triggers a click event when no callback is passed.
     * @param callback Function called when the event is triggered
     * @param element Query selector of the element
     */
    click(callback?: (event: Event) => void, element?: String)
    /**
     * @param index index of the element or undefined or nothing
     * @return {Object} a DOM element
     */
    get(index: Number)
    /**
     * @param value the height of the element (and units (em / px / cm, etc)) or undefined or nothing
     * @return {Object|Number} Object if value != undefined and Number if value == undefined
     */
    height(value?)
    /**
     * @param value the width of the element (and units (em / px / cm, etc)) or undefined or nothing
     * @return {Object|Number} Object if value != undefined and Number if value == undefined
     */
    width(value?)
    /**
     * @param classx class to add to the classlist of the element
     * @return {Object} the current instance of ExtJs
     */
    addClass(classx: String)

    /**
     * @param classx class to remove from the classlist of the element
     * @return {Object} the current instance of ExtJs
     */
    removeClass(classx: String)

    /**
     * Delete the element(s)
     */
    remove()
    /**
     * @param element_type element to createElement
     * @return {Array} element list in an ExtJsObject
     */
    child(element_type: String)
    /**
     * @param prop The css proprety that we want to modify.
     * @param value The value that we want to assign to that property 
     * @param i the index of the element (optional)
     */
    css(prop: String, value: String, i?)
    /**
     * Returns the nearest parent of the element's
     * @param selector The selector of the nearest parent
     */
    parent(selector)
}


declare module "extjs" {

    function $(element: String | Object | undefined, e_index?: undefined | Number): ExtJsObject;
    class AR {
        /**
        * @param {String} url URL of the resource
        * @param {Function} callback function which is called when the request has been performed correctly
        * @param {Function} error_callback function which is called when the request has not been performed correctly
        */
        static GET(url: String, callback: (data: string) => void, error_callback?: () => void)
        /**
        * @param {String} url URL of the resource
        * @param {Function} callback function which is called when the request has been performed correctly
        * @param {Function} error_callback function which is called when the request has not been performed correctly
        */
        static DELETE(url: String, callback: (data: string) => void, error_callback?: () => void)
        /**
        * @param {String} url URL of the resource
        * @param {Array} data assoc array with the data that will be sent
        * @param {Function} callback function which is called when the request has been performed correctly
        * @param {Function} error_callback function which is called when the request has not been performed correctly
        */
        static POST(url: String, data: Object, callback: (data: string) => void, error_callback?: () => void)
        /**
        * @param {String} url URL of the resource
        * @param {Array} data assoc array with the data that will be sent
        * @param {Function} callback function which is called when the request has been performed correctly
        * @param {Function} error_callback function which is called when the request has not been performed correctly
        */
        static PUT(url: String, data: Object, callback: (data: string) => void, error_callback?: () => void)
    }

}