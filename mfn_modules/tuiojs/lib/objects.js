function TuioObject(){}
TUIOObject.prototype.update = function() {};
TUIOObject.prototype.label = function() {};

function Tuio2DCursor ( s_id, x_pos, y_pos, x_vel, y_vel, m_accel) {
	this.s_id = s_id;
	this.x_pos = x_pos;
	this.y_pos = y_pos;
	this.x_vel = x_vel;
	this.y_vel = y_vel;
	this.m_accel = m_accel;
}

function TuioProfile () {
	this.address = null;
	this.objects = [];
	this.sessions = [];
}

TuioProfile.prototype.alive = function(client,message) {
	// body...
};