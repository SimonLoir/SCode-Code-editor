exports.launch_command = "electron .";
exports.init = function () {
    var e = this;
    $('#build').html('->');
    var btn_build = $('#build').html('<i style="font-size:45px;">&#8227;</i>');
    btn_build.addClass('default_color');
    if(project_settings != undefined){
        if(project_settings.project_type == "electron"){
            btn_build.click(e.testElectron);
            if(project_settings.launch_command != undefined){
                e.launch_command = project_settings.launch_command + ";exit";
            }
        }
    }else{
        btn_build.click(function (){
            alert('Mettez à jour .scode.json dans votre projet pour accèder au build tools');
        });
    }
    return this;
}
exports.testElectron = function () {
    var instance = newTerminal();
    var e = build_tools;
    console.log(e)
    setTimeout(function () {
        instance[2].write(e.launch_command + "\r");
    }, 800);
}

exports.buildElectron = function () {
    var instance = newTerminal();

    setTimeout(function () {
        instance[2].write("electron .\r");
    }, 800);
}