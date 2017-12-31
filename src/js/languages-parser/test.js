function test() {
    const parser = require('./main.js');
    const process = require('process');
    const fs = require('fs');
    const fileContent = fs.readFileSync(process.argv[2], "utf-8");
    let result = parser.tokenize("js", fileContent);
    let start = new Date().getTime();
    let end = new Date().getTime();
    let first = end - start;
    fs.writeFileSync('result.json', JSON.stringify(result));
    end = new Date().getTime();
    let second = end - start;    
    let text = "";
    end = new Date().getTime();
    let third = end - start;    
    return [first, second, third];
}
function testEsprima() {
    const parser = require('esprima');
    const process = require('process');
    const fs = require('fs');
    const fileContent = fs.readFileSync(process.argv[2], "utf-8");
    let result = parser.tokenize(fileContent);
    let start = new Date().getTime();
    let end = new Date().getTime();
    let first = end - start;
    fs.writeFileSync('resulte.json', JSON.stringify(result));
    end = new Date().getTime();
    let second = end - start;   
    let text = "";
    end = new Date().getTime();
    let third = end - start;  
    return [first, second, third];
}
var i = 0;
let swin = 0;
let ewin = 0;
while (i < 200) {
    i++;
    let hm = test();  
    let es = testEsprima();

    let h = 0;
    let s = 0;

    if (hm[2] < es[2]) {
        h++;
    }else{
        s++;
    }
    if(h > s){
        console.log( i + " : scode better : " + hm[2] + " - " + es[2]);
        swin++;
    }else{
        console.log( i + " : esprima better : " + hm[2] + " - " + es[2]);
        ewin++;
    }
}
function percent(a, b){
    return (a / b) * 100 + "%";
}
console.log("SCode : " + swin  + "(" + percent(swin, swin + ewin) +  ")", "Esprima : " + ewin + "(" + percent(ewin, swin + ewin) +  ")");