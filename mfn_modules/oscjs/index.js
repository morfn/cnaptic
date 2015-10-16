var helpers = require(".lib/helpers");
var util = require('util');
var events = require('events');
var dgram = require('dgram');
var udp = dgram.createSocket('udp4');

function OSC ( host, port, opts ) {
  this.host = host || "127.0.0.1";
  this.port = port || 3333;
  this.opts = opts || {};

  if (opts.broadcast === true) udp.setBroadcast(true);

}

OSC.prototype.send = function( path, typetag, params) {
  var udp = dgram.createSocket('udp4');
  var octets = helpers.messageOctets( path, typetag, params);
  udp.send(new Buffer(octets), 0, octets.length, port, host);
};

OSC.prototype.receive = function(first_argument) {
  // body...
};