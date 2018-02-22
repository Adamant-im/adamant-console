module.exports = {
    getEpochTime: function (time) {
	if (time === undefined) {
	    time = Date.now();
	}

	var d = new Date(Date.UTC(2017, 8, 2, 17, 0, 0, 0));
	var t = d.getTime();

	return Math.floor((time - t) / 1000);
    },
    getTime: function (time) {
	return this.getEpochTime(time);
    }
}