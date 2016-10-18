'use strict';
const net = require('net');
const config = require('../config');

const serverip = config.ip;
const serverport = config.port;

function echoServer() {
	const server = net.createServer((c) => {
		c.on('data', (data) => c.write(data));
	});
	server.listen(serverport);
}

echoServer();
