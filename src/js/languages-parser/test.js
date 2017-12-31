const parser = require('./main.js');
const process = require('process');
const fs = require('fs');
const fileContent = fs.readFileSync(process.argv[2], "utf-8");
let result = parser.tokenize("js", fileContent);
let start = new Date().getTime();
result = JSON.stringify(result);
let end = new Date().getTime();
console.log(end - start, "ms")
fs.writeFileSync('result.json', result);
end = new Date().getTime();
console.log(end - start, "ms")
console.log(result)