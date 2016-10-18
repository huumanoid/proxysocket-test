'use strict';
const fs = require('fs');

const config = require('./config');

module.exports = function (startNum, endNum) {
    for (let i = startNum; i <= endNum; ++i) {
        const test = fs.readFileSync(config.outdir + '/' + config.testfilePrefix + i);
        const control = fs.readFileSync(config.outdir + '/' + config.controlfilePrefix + i);

        if (test.length !== control.length) {
            console.error('suite: ' + i + ', test and control files have different length.'
                + ' test has ' + test.length
                + ' control has ' + control.length);
            continue;
        }
        for (let byten = 0; byten < test.length; ++byten) {
            if (test[byten] !== control[byten]) {
                console.error('suite: ' + i 
                    + ', position: ' + byten 
                    + ', test has ' + test[byten] 
                    + ', control has ' + test[byten])
            }
        }
    }
    console.log('checks passed successfully');
}
