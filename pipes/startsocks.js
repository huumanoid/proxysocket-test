var child_process = require('child_process');

var config = require('./config');

child_process.exec('ssh -N -D 0.0.0.0:' + config.socksport 
    + ' localhost');
