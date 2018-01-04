interface ControlsBar{
    close_button:ExtJsObject
    minimize_button:ExtJsObject
    full_screen_button:ExtJsObject
    bar:ExtJsObject
}
export default class View {

    public version = "2.18";

    public ready = $(document).ready;

    public controls_bar:ControlsBar;

    public side_panel:ExtJsObject

    constructor(){
        // Stuff to do when the app is ready
        this.ready(() => {

            $('#scode_version').html(this.version);

        });
    }

}