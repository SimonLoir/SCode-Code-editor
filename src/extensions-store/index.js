download_file("https://simonloir.be/scode/extensions/sl-app-1.zip");
function download_file (url) {
    var http = require('https');
    var fs = require('fs');
    var file = fs.createWriteStream("ext-temp.zip");
    var request = http.get(url, function(response) {
      response.pipe(file);
    });
}