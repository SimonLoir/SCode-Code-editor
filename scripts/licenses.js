/*
This file makes a LICENSE file
*/

const fs = require('fs');

let licenses = getLicenses("../node_modules", "");

let readme = "<h1>Licenses</h1>\n";
readme += "<h2>SCode</h2><pre>" + fs.readFileSync('../LICENSE') + "</pre>";
readme += "<h2>Third party softwares</h2>" + licenses;
console.log(readme);

fs.writeFile('../LICENSES.html', readme, "utf-8", (e) => {
    console.log(e);
})


function getLicenses(dir, string){
    let node_modules = fs.readdirSync(dir);
    node_modules.forEach( e => {
        let d = dir + "/" + e;
        if(fs.statSync(d).isDirectory() == true){
            string = getLicenses(d, string);
        }else if(e.toLowerCase().indexOf('license') >= 0 && e.toLowerCase().indexOf('.js') < 0 && e.toLowerCase().indexOf('.ts') < 0){
            string += "<br /><br /><b>> " + d + "<b><br /><pre>" + fs.readFileSync(d) + "</pre>";
        }
    });
    return string;
}

