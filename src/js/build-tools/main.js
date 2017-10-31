exports.init = function () {
    var e = this;
    $(document).ready(function () {
        $('#build').html('->');
        var btn_build = $('#build').html('<i style="font-size:45px;">&#8227;</i>');
        btn_build.addClass('default_color');
        btn_build.click(e.testElectron);
    });
    return this;
}
exports.testElectron = function () {
    var instance = newTerminal();

    setTimeout(function () {
        instance[2].write("electron .\r");
    }, 1500);
}

exports.buildElectron = function () {
    var instance = newTerminal();

    setTimeout(function () {
        instance[2].write("electron .\r");
    }, 1500);
}