'use strict';

const config = require('../config');
const proxysocket = require('proxysocket');

const socket = proxysocket.create(config.socksip, config.socksport);

socket.connect(config.echoip, config.echoport, () => {
    const send = new Buffer('п', 'utf8');
    socket.write(send);
    let rec = Buffer.alloc(0);
    socket.on('data', (data) => {
        rec = Buffer.concat([rec, data]);
        console.log('received: ', rec); console.log('sent:     ', send);
    });
});
