var PORT = 33333;
var HOST = 'localhost';
var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var fs = require("fs");
var log = require('sys').log;
var wstream = fs.createWriteStream('new.txt');

wstream.on('finish', function () {
  console.log('file has been written');
});
server.on('message', function (message, remote) {
    wstream.write(message);
    wstream.end();
});

server.bind(PORT, HOST);