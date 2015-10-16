// Some buffers to get the float bit pattern, for example.
var array_buffer = new ArrayBuffer(4);
var data_view = new DataView(array_buffer);

module.exports = {
	messageOctets:function( path, typetag, params ) {
	 	var self =  this;
	    var octets = [ ];
	    self.appendString(octets, path);
	    self.appendString(octets, ',' + typetag);
	    for (var i = 0, il = typetag.length; i < il; ++i) {
	      var tag = typetag[i];
	      switch (tag) {
	        case 'i':
	          self.appendInt(octets, params[i]);
	          break;
	        case 'f':
	          self.appendFloat(octets, params[i]);
	          break;
	        case 's':
	          self.appendString(octets, params[i]);
	          break;
	        case 'b':
	          self.appendBlob(octets, params[i]);
	          break;
	        // Types with implicit parameters, just ignore the passed parameter.
	        case 'T': case 'F': case 'N': case 'I':
	          break;
	        default:
	          throw 'Unknown osc type: ' + tag;
	          break;
	      }
	    }
	    return octets;
	},
	appendBlob: function(octets, val) {
	  var self = this;
	  var len = val.length;
	  self.appendInt(octets, len);

	  // grow byte array and carve out space for the Blob
	  var start = octets.length;
	  octets.length += len;
	  for (var i = 0; i < len; ++i) {
	    octets[start+i] = val[i];
	  }

	  // We want to pad to 4 byte boundary.
	  var num_nulls = (4 - (len & 3)) & 3;
	  for (var i = 0; i < num_nulls; ++i) {
	    octets.push(0);
	  }
	},
	appendInt:function (octets, val,data_view) {
	  data_view.setInt32(0, val, false);
	  for (var i = 0; i < 4; ++i) {
	    octets.push(data_view.getUint8(i));
	  }
	},
	appendFloat:function (octets, val,data_view) {
	  data_view.setFloat32(0, val, false);
	  for (var i = 0; i < 4; ++i) {
	    octets.push(data_view.getUint8(i));
	  }
	},
  	appendString:function (octets, str) {
	    var len = str.length;
	    for (var i = 0; i < len; ++i) {
	      octets.push(str.charCodeAt(i) & 0x7f);  // Should be 7-bit clean right?
	    }
	    // We want to add the null byte and pad to 4 byte boundary.
	    var num_nulls = 4 - (len & 3);  // Will always be at least 1 for terminator.
	    for (var i = 0; i < num_nulls; ++i) {
	      octets.push(0);
	    }
  }
}