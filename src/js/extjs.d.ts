interface ExtJsObject{
    /**
     * Calls the callback when the document is fully loaded.
     * @param callback Function that is called when the document is ready.
     */
    ready(callback: () => void)
    /**
     * It calls the callback when the user performs a click on a sepcific element
     * @param callback Function called when the event is triggered
     * @param element Query selector of the element
     */
    click(callback: (event:Event) => void, element?: String)
}
declare module "extjs"{
    /**
    * @returns An extsjs object.
    * @param e An extjs object or a string that contains a query selector.
    * @param index The index of the node that we want to use from teh nodelist.
    */
    function $ (element: String | Object | undefined, e_index?: undefined | Number) :ExtJsObject
    export default $;
}