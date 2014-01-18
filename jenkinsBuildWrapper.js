/* JenkinsWrapper */

var jenkinsapi = require('jenkins-api'),
lamps = require('./lampsWrapper.js');
var Step = require('step');

var localConfig;
var prevStatus;
var jenkins;
var isRunning;

module.exports = {
	name : function() {
		return "jenkinsbuild";
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
		console.log("Initialising the %s service", module.exports.name());
                console.log("Watched builds : ", localConfig.watched);
		jenkins = jenkinsapi.init("https://" + config.username + ":" + config.apiKey + "@" + config.url);

		// and call all the input services!
		checkStatus();
	}
}

function checkStatus() {
    if(isRunning) {
    	console.log("Calling %s", module.exports.name());

    	var building = false;

        Step(
            function() {
                var group = this.group();
                for (i = 0; i < localConfig.watched.length ; i++) {
                    var buildName = localConfig.watched[i];
                    console.log("Check for build ",buildName);
                    var builds = jenkins.last_build_info(buildName, group());
                }
            },
            function(err, data) {
                if (err){
                    console.log(err);
                }
                for (i = 0; i< data.length; i++) {
                    var d = data[i];
                    console.log("Check job "+ d.fullDisplayName);
                    // console.log(" -> ",d); // XXX
                    console.log(" Running : "+d.building);
                    building |= d.building;
                }
                
                console.log("Build running :",building);
                updateStatus(building);
            }
        )
    }

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
