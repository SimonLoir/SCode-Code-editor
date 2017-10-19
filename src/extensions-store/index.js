var os = require("os");
var fs = require("fs");
var path = require('path');

download_repo("https://github.com/SimonLoir/SCode-Code-editor");

function download_repo(repo) {
    require('simple-git')(os.homedir() + "/.scode/extensions")
    .clone(repo, os.homedir() + "/.scode/extensions/.ext-002", (error, ok) => {
        if (error != null) {
            rmdir(os.homedir() + "/.scode/extensions/.ext-002");
            download_repo(repo);
        }else{
            alert('Done')
        }
    })
}

function rmdir(dir_path) {
    if (fs.existsSync(dir_path)) {
        fs.readdirSync(dir_path).forEach(function(entry) {
            var entry_path = path.join(dir_path, entry);
            if (fs.lstatSync(entry_path).isDirectory()) {
                rmdir(entry_path);
            } else {
                fs.unlinkSync(entry_path);
            }
        });
        fs.rmdirSync(dir_path);
    }
}