var PORT = 33333;
var HOST = 'localhost';
var dgram = require('dgram');
var log = require('sys').log;
var client = dgram.createSocket('udp4');
var fs = require("fs");

fs.readFile('main.txt', function (err,data) {
  if (err) {
    return console.log(err);
  }
  client.send(data, 0, data.length, PORT, HOST, function(err, bytes) {
    if (err) 
        throw err;
    log('UDP file sent to ' + HOST +':'+ PORT);
    log('File size: ' + data.length);
  });
});