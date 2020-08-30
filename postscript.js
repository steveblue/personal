const fs = require('fs');
let server = fs.readFileSync('dist/server/index.js').toString();
server = server.replace(`require('config')`, `require('./config')`);
fs.writeFileSync('dist/server/index.js', server);