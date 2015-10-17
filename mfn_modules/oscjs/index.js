var sender = require("./lib/sender");
var receiver = require("./lib/receiver");
var util = require('util');
var events = require('events');
var dgram = require('dgram');
var udp = dgram.createSocket('udp4');

function OSC ( host, port, opts ) {
  this.host = host || "127.0.0.1";
  this.port = port || 3333;
  this.opts = opts || {};

  // if (opts.broadcast === true) udp.setBroadcast(true);

}
util.inherits(OSC, events.EventEmitter);

OSC.prototype.send = function( path, typetag, params) {
	var self = this;
	var udp = dgram.createSocket('udp4');
	var octets = sender.messageOctets( path, typetag, params);
	udp.send(new Buffer(octets), 0, octets.length, self.port, self.host);
};

OSC.prototype.listen = function(first_argument) {
	var self = this;
	var udp = dgram.createSocket('udp4');


  	function processMessageOrBundle(msg, pos) {
    	var path = receiver.readString(msg, pos);
    	pos+= path.length + 4 - (path.length & 3);

	    if (path === '#bundle') {
	      pos += 8;  // Skip timetag, treat everything as 'immediately'.
	      while (pos < msg.length) {
	        var len = readInt(msg, pos);
	        pos += 4;
	        processMessageOrBundle(msg, pos);
	        pos += len;
	      }

	      return;
	    }

	    var typetag = receiver.readString(msg, pos);
	    pos += typetag.length + 4 - (typetag.length & 3);

	    var params = [ ];
	    for (var i = 1, il = typetag.length; i < il; ++i) {
	      var tag = typetag[i];
	      switch (tag) {
	        case 'T': params.push(true); 		break;
	        case 'F': params.push(false); 		break;
	        case 'N': params.push(null);		break;
	        case 'I': params.push(undefined);	break;
	        case 'f':
	          params.push(receiver.readFloat(msg, pos));
	          pos += 4;
	          break;
	        case 'i':
	          params.push(receiver.readInt(msg, pos));
	          pos += 4;
	          break;
	        case 's':
	          var str = receiver.readString(msg, pos);
	          pos += str.length + 4 - (str.length & 3);
	          params.push(str);
	          break;
	        case 'b':
	          var bytes = receiver.readBlob(msg, pos);
	          pos += 4 + bytes.length + ((4 - (bytes.length & 3)) & 3);
	          params.push(bytes);
	          break;
	        default:
	          console.log('WARNING: Unhandled OSC type tag: ' + tag);
	          break;
	      }
	    }

	    var e = {path: path, typetag: typetag.substr(1), params: params}
	    self.emit(path + typetag, e);
	    self.emit(path, e);
	    self.emit('', e);
	}

	udp.on('message', function(msg, rinfo) {
		try {
		  processMessageOrBundle(msg, 0);
		} catch(e) {
		  console.log('WARNING: Skipping OSC message, error: ' + e);
		}
	});

	udp.bind(self.port);
	// Close the underlying socket for the receiver.  No new messages should be
	// received and the socket will be closed (although perhaps it is possible
	// we will still get some messages that are already received and buffered).
	// Returns true if the socket was closed or false if it was already closed.
	this.close = function() {
		if (udp === null) return false;
		udp.close();
		udp = null;
		return true;
	};
};

module.exports = OSC;