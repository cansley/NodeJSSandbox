/**
 * Created by cxa70 on 11/11/2014.
 */
var fs = require('fs');

var options = {
    key: fs.readFileSync('./lib/key.pem', 'utf-8'),
    cert: fs.readFileSync('./lib/key-cert.pem', 'utf-8')
};

exports.options = options;