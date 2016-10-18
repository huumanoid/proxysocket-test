'use strict';
const fs = require('fs');
const net = require('net');
const crypto = require('crypto');

const rmdir = require('rmdir');
const proxysocket = require('proxysocket');

const ClientTest = require('./client-test');
const config = require('../config');
const check = require('./check');

rmdir(config.outdir, () => {
    fs.mkdirSync(config.outdir);

    let testCount = crypto.randomBytes(1).readUInt8();
    let testNum = 1;
    function test() {
        const clienttest = new ClientTest(crypto.randomBytes(1).readUInt8(), testNum);
        clienttest.run().then(() => {
            ++testNum;
            if (testNum <= testCount) {
                console.log(testNum + '/' + testCount);
                test();
            } else {
                check(1, testCount);
            }
        }).catch((err) => {
            console.error('error on test ' + testCount, err);
        });
    }
    test();
});
