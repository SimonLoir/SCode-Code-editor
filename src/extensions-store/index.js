var os = require("os");
require('simple-git')(os.homedir() + "/.scode/extensions")
.clone("https://github.com/SimonLoir/SCode-Code-editor", os.homedir() + "/.scode/extensions/.ext-001")
.then(() => {
  alert('Done');
})
function download_repo (repo) {
    var http = require('https');
    var fs = require('fs');
    var file = fs.createWriteStream("ext-temp.zip");
    var request = http.get(url, function(response) {
      response.pipe(file);
    });
}