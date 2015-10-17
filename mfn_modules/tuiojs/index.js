var util = require('util');
var events = require('events');
var OSC = require('../mfn_modules/oscjs');

function TUIO( port ){
	var self = this;
	this.port  = port || 3333;
	var client = new OSC(self.port);
	client.listen();
	client.on('/tuio/2Dcur',process);
}
util.inherits(TUIO, events.EventEmitter);

TUIO.prototype.process = function(data) {
	var self = this;
	var params = data.params;
	
	if (params[0] ==='alive'){
		params.shift();

		var removed_ids = [];
		for (var i = 0; i < self.ids.length; i++) {
			if( params.indexOf(self.ids[i]) ===-1 ){
				removed_ids.push(self.ids[i]);
			}
		};

		if (removed_ids.length > 0){
			self.emit('removeCursors', removed_ids );
		}

		var new_ids = [];
		for (var i = 0; i < params.length; i++) {
			if( self.ids.indexOf(params[i]) ===-1 ){
				new_ids.push(params[i]);
			}
		};
		if (removed_ids.length > 0){
			self.emit('addCursors', new_ids );
		}

		self.ids = params;
	}

	if (params[0] ==='set'){
		self.emit('updateCursor', {
			'id':params[0],
			'x':params[1],
			'y':params[2]
		});
	}
	// body...
};