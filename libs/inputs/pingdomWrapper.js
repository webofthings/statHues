/* PingdomWrapper */
var pingdom = require('pingdom'), 
	lamps = require('../outputs/lampsWrapper.js');

var localConfig;
var prevStatus;
var isRunning;

module.exports = {
	name : function() {
		return "pingdom";
	},
	type : function() {
		return "input";
	},
	running : function(running) {
		isRunning = running;
	},
	init: function (config) {
		isRunning = true;
		localConfig = config;
		console.log("Initialising the PingdomWrapper...");

		// and call all the input services!
		checkStatus();	
	}
}

function checkStatus() {
	if(isRunning) {
		console.log("Calling %s", module.exports.name());
		pingdom.getChecks(localConfig.username, localConfig.password, localConfig.apiKey, function(data) {
			var downDetected = false;
			for (var i = 0; i<data.checks.length; i++) {
				var currentCheck = data.checks[i];
				console.log(currentCheck);
				if(currentCheck.status !== 'up') {
					serviceIsDown();
					downDetected = true;
					break;	
				}
			}
			if(!downDetected) {
				allServicesUp();
			}
		});
		setTimeout(function() {
			checkStatus();
		}, localConfig.interval * 1000);
	}
}

function hasStatusChanged(status) {
	if(prevStatus !== status) {
		return true;
	}
	return false;
}

function serviceIsDown() {
	if(hasStatusChanged) {
		lamps.change(module.exports.name(), function(lamp) {
			return lamp.error();
		});
		console.log("A service is down! (detected by %s)", module.exports.name());
		prevStatus = 'down';
	}
}

function allServicesUp() {
	if(hasStatusChanged) {
		lamps.change(module.exports.name(), function(lamp) {
			return lamp.ok();
		});
		console.log("All services up! (detected by %s)", module.exports.name());
		prevStatus = 'up';
	}
}