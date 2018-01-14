/*
This file makes a LICENSE file
*/

const fs = require('fs');

let licenses = getLicenses("../node_modules", "");

let readme = "# Licenses\n";
readme += "## SCode" + fs.readFileSync('../LICENSE');
readme += "## Third party softwares" + licenses;
console.log(readme);

fs.writeFile('../LICENSES.md', readme, "utf-8", (e) => {
    console.log(e);
})


function getLicenses(dir, string){
    let node_modules = fs.readdirSync(dir);
    node_modules.forEach( e => {
        let d = dir + "/" + e;
        if(fs.statSync(d).isDirectory() == true){
            string = getLicenses(d, string);
        }else if(e.toLowerCase().indexOf('license') >= 0){
            string += "\n\n>" + d + "\n" + fs.readFileSync(d);
        }
    });
    return string;
}

