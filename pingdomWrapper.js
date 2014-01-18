// deps
var pingdom = require('pingdom'), hue = require('hue-module');


// configuration variables
var username = "";
var password = "";
var appKey = "";



pingdom.getChecks(username, password, appKey, function(data) {
	for (var i = 0; i<data.checks.length; i++) {
		var currentCheck = data.checks[i];
		console.log(currentCheck);
		if(currentCheck.status !== 'down') {
			serviceIsDown();
		}
	}
});


function serviceIsDown() {
	hue.load("192.168.11.131", "newdeveloper");
	hue.lights(function(lights){ for(i in lights) if(lights.hasOwnProperty(i)) hue.change(lights[i].set({"off": true, "rgb":[255,0,0]})); });
}