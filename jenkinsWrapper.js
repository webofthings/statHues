/* JenkinsWrapper */

var jenkinsapi = require('jenkins-api'),
lamp = require('./lampsWrapper.js');

var localConfig;
var prevStatus;
var jenkins;

module.exports = {
	name : function() {
		return "jenkins";
	},
	type : function() {
		return "input";
	},
	init: function (config) {
		localConfig = config;
		console.log("Initialising the %s service", module.exports.name());

		jenkins = jenkinsapi.init("https://" + config.username + ":" + config.apiKey + "@" + config.url);

		// and call all the input services!
		checkStatus();	
	}
}

function checkStatus() {
	console.log("Calling %s", module.exports.name());

	//FAILURE UNSTABLE SUCCESS

	jenkins.last_build_info('CI_GITWATCHER', function(err, data) {
		if (err) { return console.log(err); }

		var failureDetected = false;
		var currentCheck = data.result;
		console.log(currentCheck);
		if(currentCheck.status !== 'SUCCESS') {
			failure();
		} else {
			allServicesUp();
		}

		setTimeout(function() {
			checkStatus();
		}, localConfig.interval * 1000);
	});
}


function hasStatusChanged(status) {
	if(prevStatus !== status) {
		return true;
	}
	return false;
}

function failure(status) {
	if(hasStatusChanged) {
		lamps.change(module.exports.name(), function(lamp) {
			if(status === 'UNSTABLE') {
				return lamp.warn();	
			}
			else if(status === 'FAILURE') {
				return lamp.error();
			}
		});
		console.log("A build is having troubles! (detected by %s)", module.exports.name());
		prevStatus = status;
	}
}

function allSuccess(status) {
	if(hasStatusChanged) {
		lamps.change(module.exports.name(), function(lamp) {
			return lamp.ok();
		});
		console.log("All builds are passing! (detected by %s)", module.exports.name());
		prevStatus = status;
	}
}