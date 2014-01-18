/* JenkinsWrapper */

var jenkinsapi = require('jenkins-api'),
lamp = require('./lampsWrapper.js');

var localConfig;
var prevStatus;
var jenkins;

module.exports = {
	name : function() {
		return "jenkinsbuild";
	},
	type : function() {
		return "input";
	},
	init: function (config) {
		localConfig = config;
		console.log("Initialising the %s service", module.exports.name());
                console.log("Watched builds : ", localConfig.watched);
		jenkins = jenkinsapi.init("https://" + config.username + ":" + config.apiKey + "@" + config.url);

		// and call all the input services!
		checkStatus();
	}
}

function checkStatus() {
	console.log("Calling %s", module.exports.name());

	var building = false;

        for (i = 0; i < localConfig.watched.length ; i++) {
            var buildName = localConfig.watched[i];
            console.log("Check for build ",buildName);
            var builds = jenkins.last_build_info(buildName, function(err, data) {

                if (err){
                    console.log(err);
                } else {
                    building |= data.building;
                    
                }
            });
        }

        console.log("Build running :",building);
        updateStatus(building);

        setTimeout(function() {
                checkStatus();
        }, localConfig.interval * 1000);
}


function updateStatus(status) {

    var success = false;

    if(status || prevStatus !== status) {
        if (status) {
            // build started
            console.log("Change build lamp to on");
            success = lamps.change(module.exports.name(), function(lamp) {
                return lamp.yellow(10000).blink();
            });
        } else {
            // build started
            console.log("Change build lamp to off");
            success = lamps.change(module.exports.name(), function(lamp) {
                return lamp.off();
            });
        }
    }
    if (success) {
        prevStatus = status;
    }
}

