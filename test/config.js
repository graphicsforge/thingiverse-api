if (!process.env.TOKEN) {
    console.log('Please set environment variable TOKEN');
    console.log('example: TOKEN=abcdefgh12345 npm test');
    process.exit(1);
}

var Thingiverse = require('../');
module.exports = new Thingiverse(process.env.TOKEN);
