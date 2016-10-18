'use strict';
const fs = require('fs');
const net = require('net');
const crypto = require('crypto');

const proxysocket = require('proxysocket');
const rmdir = require('rmdir');

const ClientTest = require('./client-test');
const config = require('./config');
const check = require('./check');

rmdir(config.outdir, () => {
    fs.mkdirSync(config.outdir);

    let testCount = crypto.randomBytes(1).readUInt8();
    let tests = [];
    for (let i = 1; i <= testCount; ++i) {
        tests.push(new ClientTest(crypto.randomBytes(1).readUInt8(), i).run());
    }
    Promise.all(tests).then(() => {
        check(1, testCount);
    });
})
