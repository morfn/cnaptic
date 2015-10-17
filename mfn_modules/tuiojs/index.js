var util = require('util');
var events = require('events');
var OSC = require('../oscjs');

function TUIO( port ){
	var self = this;
	this.port  = port || 3333;
	this.cids = [];
	var client = new OSC(self.port);
	client.listen();
	client.on('/tuio/2Dcur',function (data){
		self.process(data);
	});
}
util.inherits(TUIO, events.EventEmitter);

TUIO.prototype.process = function(data) {
	var self = this;
	var params = data.params;
	
	if (params[0] ==='alive'){
		params.shift();
		var removed_ids = [];
		for (var i = 0; i < self.cids.length; i++) {
			if( params.indexOf(self.cids[i]) ===-1 ){
				removed_ids.push(self.cids[i]);
			}
		};

		if (removed_ids.length > 0){
			self.emit('removeCursors', removed_ids );
		}

		var new_ids = [];
		for (var i = 0; i < params.length; i++) {
			if( self.cids.indexOf(params[i]) ===-1 ){
				new_ids.push(params[i]);
			}
		};
		if (new_ids.length > 0){
			self.emit('addCursors', new_ids );
		}
		self.cids = params;
	}

	if (params[0] ==='set'){
		params.shift();
		self.emit('updateCursor', {
			'id':params[0],
			'x':params[1],
			'y':params[2]
		});
	}
	// body...
};

module.exports = TUIO;
