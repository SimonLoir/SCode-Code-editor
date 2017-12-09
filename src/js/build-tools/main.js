exports.launch_command = "electron .";
exports.init = function () {
    var e = this;
    var btn_build = $('#build').child("span").html('<i class="icon-play" style="cursor:pointer;"></i>');
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
    var btn_build_package = $('#build').child("span").html('<i class="icon-box" style="cursor:pointer;"></i>');
    btn_build_package.addClass('default_color');
    if(project_settings != undefined){
        if(project_settings.project_type == "electron"){
            btn_build_package.click(e.buildElectron);
            if(project_settings.build_script != undefined){
                e.build_script = project_settings.build_script + ";exit";
            }
        }
    }else{
        btn_build_package.click(function (){
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
    var e = build_tools;
    console.log(e)
    setTimeout(function () {
        instance[2].write(e.build_script + "\r");
    }, 800);
}