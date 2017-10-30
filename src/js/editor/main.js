exports.init = function () {
    this.load = function ( toLoad ) {

        if(toLoad == "settings"){
            if (fs.existsSync(os.homedir() + "/.scode/settings.json")) {
                return JSON.parse(fs.readFileSync(os.homedir() + "/.scode/settings.json", "utf-8"));
            }else{
                return {
                    always_show_workdir_and_opened_files: true,
                    language: "en.json",
                    theme: "themes/scode-dark.css"
                };
            }
        }

    }
    return this;
}