const fs = require("fs");
const path = require('path');

// Hack, we cant import without babel
const js = fs.readFileSync(path.join(__dirname, './darkside.js'), 'utf8');
const str = js.slice(js.indexOf('{'));
const obj = eval('(' + str + ')');

fs.writeFileSync(path.join(__dirname, './darkside.json'), JSON.stringify(obj.colors));
console.log('Done!');
