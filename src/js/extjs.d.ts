interface ExtJsObject{

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