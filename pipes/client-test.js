'use strict';
const fs = require('fs');
const net = require('net');
const crypto = require('crypto');

const proxysocket = require('proxysocket');

const config = require('../config');

const socksip = config.socksip;
const socksport = config.socksport;
const serverip = config.echoip;
const serverport = config.echoport;

function getRandom(a) {
	a = (a+0x7ed55d16) + (a<<12);
    a = (a^0xc761c23c) ^ (a>>19);
    a = (a+0x165667b1) + (a<<5);
    a = (a+0xd3a2646c) ^ (a<<9);
    a = (a+0xfd7046c5) + (a<<3);
    a = (a^0xb55a4f09) ^ (a>>16);
    if( a < 0 ) a = 0xffffffff + a;
    return a;
}

function getRandomBytes(n) {
	const bytes = new Array(n);
	//const seed = 65537;
	const seed = crypto.randomBytes(2).readUInt16LE();
	for (let i = 0; i < n; ++i) {
		bytes[i] = getRandom(seed + i) % 255;
	}
	return bytes;
}

module.exports =
class ClientTest {
    constructor(attempts, testSuffix) {
        this.attempts = attempts;
        this.testSuffix = testSuffix;
    }

    run() {
        return new Promise((resolve, reject) => {

            //let socket = new net.Socket();
            const socket = proxysocket.create(socksip, socksport);
            socket.setEncoding('binary');

            // contains received data (passed there by socket.pipe)
            const teststream = fs.createWriteStream(config.outdir + '/' + config.testfilePrefix + this.testSuffix, { defaultEncoding: 'binary' });
            // contains actually sent data
            const controlstream = fs.createWriteStream(config.outdir + '/' + config.controlfilePrefix + this.testSuffix, { defaultEncoding: 'binary' });

            {
                let finished = 0;
                const finish = () => {
                    ++finished;
                    if (finished === 2) {
                        resolve();
                    }
                };
                teststream.once('finish', finish);
                controlstream.once('finish', finish);
            }

            socket.pipe(teststream);
            //socket.on('data', (d) => wstream.write(d));

            let attempts = this.attempts;
            //let attempts = 1;

            function send() {
                const len = crypto.randomBytes(1).readUInt8() + 1;
                //const len = 10;
                const buf = Buffer.from(getRandomBytes(len));

                socket.write(buf);
                //remember what we exactly send.
                controlstream.write(buf);

                let rec = Buffer.alloc(0);

                function onData(data) {
                    rec = Buffer.concat([rec, data]);

                    if (rec.length === buf.length) {
                        socket.removeListener('data', onData);
                        attempts--;

                        if (attempts > 0)
                            send();
                        else {
                            socket.end();
                            controlstream.end();
                        }
                    }
                }
                socket.on('data', onData);
            }

            socket.connect(serverip, serverport, () => send());

            socket.on('error', reject);
        });
    }

}
