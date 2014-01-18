	/* EVRYTHNG Hackathon - 18/01/2014 */


// Imports
var fs    	= require('fs'),
nconf 		= require('nconf'),
express 	= require('express'),
schedule = require('node-schedule'),
evrythng 	= require('./evrythngServices.js'),
lamps 		= require('./lampsWrapper.js'),
jenkins 	= require('./jenkinsWrapper.js'),
jenkinsBuilds   = require('./jenkinsBuildWrapper.js');
git 		= require('./gitWrapper.js'),
pingdom 	= require('./pingdomWrapper.js')

// Initalize the config file
nconf.argv()
.env()
.file({ file: 'config.json' });

// Let's set up some terminal colours :)
// No-one likes a black and white terminal...

var red   = '\033[31m';
var blue  = '\033[34m';
var green = '\033[32m';
var reset = '\033[0m'; // Set back to white

console.log(green + "Welcome to " + red + "s" + green + "t" + blue + "a" + red + "t" + green + "H" + blue + "u" + red + "e" + green + "s" + blue + "!" + reset);

var app = express();
app.use(express.bodyParser());
//var inputsOutputs = [pingdom, lamps, git, jenkins];
var inputsOutputs = [lamps, pingdom, jenkins, evrythng, jenkinsBuilds];


// Let's initialise our modules...
for(var i = 0; i < inputsOutputs.length; i++) {
	var currentService = inputsOutputs[i];
	currentService.init(nconf.get(currentService.name()));
}

// and schedule the on/off of the lamps
var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(0, 6)];
rule.hour = 20;
rule.minute = 34;

var stop = schedule.scheduleJob(rule, function(){
	// stop the services
	for(var i = 0; i < inputsOutputs.length; i++) {
		var currentService = inputsOutputs[i];
		if(currentService.type === 'input') 
			currentService.running(false);
	}
	lamps.allOff();
});

// and on during the day
var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(0, 4)];
rule.hour = 9;
rule.minute = 00;

var start = schedule.scheduleJob(rule, function(){
	// start the services
	for(var i = 0; i < inputsOutputs.length; i++) {
		var currentService = inputsOutputs[i];
		currentService.running(true);
	}
});


// Add your routes here and send the data to your module

app.get('/api/git/:kpi', function(req, res) {

	git.parse(req, res);

});


// Now let's set up the server itself!	
var server = require('http').createServer(app);
server.listen(1337);
console.log(green + "StatHues is now listening on port 1337!" + reset);
