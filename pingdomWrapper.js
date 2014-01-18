/* PingdomWrapper */
var pingdom = require('pingdom'), 
hue = require('hue-module');

var localConfig;

module.exports = {
	name : function() {
		return "pingdom";
	},
	type : function() {
		return "input";
	},
	init: function (config) {
		localConfig = config;
		console.log("Initialising the PingdomWrapper...");
		
	},
	checkStatus : function() {
		pingdom.getChecks(localConfig.username, localConfig.password, localConfig.apiKey, function(data) {
			for (var i = 0; i<data.checks.length; i++) {
				var currentCheck = data.checks[i];
				//console.log(currentCheck);
				if(currentCheck.status !== 'down') {
					serviceIsDown();
					break;
				}
			}
		});
	}
}


function serviceIsDown() {
	hue.load(localConfig.url, localConfig.username);
	hue.lights(function(lights){ for(i in lights) if(lights.hasOwnProperty(i)) hue.change(lights[i].set({"off": true, "rgb":[0,0,0]})); });
}