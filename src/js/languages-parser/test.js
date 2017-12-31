const parser = require('./main.js');
const process = require('process');
const fs = require('fs');
const fileContent = fs.readFileSync(process.argv[2], "utf-8");
let result = parser.tokenize("js", fileContent);
result = JSON.stringify(result);
fs.writeFileSync('result.json', result);