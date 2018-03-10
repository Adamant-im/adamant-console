const constants = require('./constants.js');
module.exports = {
    getEpochTime: function (time) {
	if (time === undefined) {
	    time = Date.now();
	}

	var d = constants.epochTime;
	var t = d.getTime();

	return Math.floor((time - t) / 1000);
    },
    getTime: function (time) {
	return this.getEpochTime(time);
    }
}