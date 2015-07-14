// ensure we have an api token
if (!process.env.TOKEN) {
    console.log('Please set environment variable TOKEN');
    console.log('example: TOKEN=abcdefgh12345 npm test');
    process.exit(1);
}

// load the index.js file in the project's root
// this is the main library/module
var Thingiverse = require('../');
// return an instance of the module, ready for api calls
module.exports = new Thingiverse(process.env.TOKEN);
