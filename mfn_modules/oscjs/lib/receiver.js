// Some buffers to get the float bit pattern, for example.
var array_buffer = new ArrayBuffer(4);
var data_view = new DataView(array_buffer);

module.exports = {
	readString:function (buffer, start) {
		var end = start;
		var len = buffer.length;

		// Seek to the end of the string (which will be terminated by 1-4 NULLs).
		while (end < len && buffer[end] !== 0) end++;

		// NOTE(deanm): At this point we could probably salvage the message and
		// take the string (which was probably truncated due to UDP packet size),
		// but it is probably the best decision to error out on malformed data.
		if (end >= len)
			throw "Encountered invalid OSC string, missing NULL termination.";

		return buffer.toString('ascii', start, end);
	},	
	readBlob:function (buffer, start) {
		var len = this.readInt(buffer, start);
		start += 4;
		return buffer.slice(start, start+len);
	},
	readFloat:function (buffer, pos) {
		data_view.setUint8(0, buffer[pos]);
		data_view.setUint8(1, buffer[pos+1]);
		data_view.setUint8(2, buffer[pos+2]);
		data_view.setUint8(3, buffer[pos+3]);
		return data_view.getFloat32(0, false);
	},
	readInt:function (buffer, pos) {
		data_view.setUint8(0, buffer[pos]);
		data_view.setUint8(1, buffer[pos+1]);
		data_view.setUint8(2, buffer[pos+2]);
		data_view.setUint8(3, buffer[pos+3]);
		return data_view.getInt32(0, false);
	}
}
