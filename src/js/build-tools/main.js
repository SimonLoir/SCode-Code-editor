this.init = function () {
    $('#build').html('');
    var btn_build = $('#build').html('<i style="font-size:45px;">&#8227;</i>');
    btn_build.addClass('default_color');
    var e = this;

    btn_build.click(this.testElectron);
}
this.testElectron = function () {
    var instance = newTerminal();

    setTimeout(function () {
        instance[2].write("electron .\r");
    }, 1500);
}

this.buildElectron = function () {
    var instance = newTerminal();

    setTimeout(function () {
        instance[2].write("electron .\r");
    }, 1500);
}