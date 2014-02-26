/* EVRYTHNG "Pimp Your Office" Hackathon - 18/01/2014 */

// Imports
var fs    	= require('fs'),
nconf 		= require('nconf'),
express 	= require('express'),
cluster 	= require('cluster'),
fs 			= require('fs'),
schedule 	= require('node-schedule'),
evrythng 	= require('./libs/outputs/evrythngServices.js'),
lamps 		= require('./libs/outputs/lampsWrapper.js'),
jenkins 	= require('./libs/inputs/jenkinsWrapper.js'),
jenkinsBuilds   = require('./libs/inputs/jenkinsBuildWrapper.js'),
pingdom 	= require('./libs/inputs/pingdomWrapper.js');

// What are the inputs/outputs we want to use?
var inputsOutputs = [lamps, pingdom, jenkins, evrythng, jenkinsBuilds];

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

if (cluster.isMaster) {
	console.log('Starting process...');
	
	var worker = cluster.fork().process;
	console.log('Worker PID %s started.', worker.pid);

	// on uncaught exceptions we restart the worker (child)
	cluster.on('exit', function(worker) {
		console.log('Worker %s died! Restarting...', worker.process.pid);
		cluster.fork();
	});
} 
else {

// Let's initialise our modules...
for(var i = 0; i < inputsOutputs.length; i++) {
	var currentService = inputsOutputs[i];
	currentService.init(nconf.get(currentService.name()));
}

// and schedule the on/off of the lamps
// off during the night...
var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(0, 4)];
rule.hour = 20;
rule.minute = 00;

var stop = schedule.scheduleJob(rule, function(){
	// stop the services
	for(var i = 0; i < inputsOutputs.length; i++) {
		var currentService = inputsOutputs[i];
		if(currentService.type === 'input') 
			currentService.running(false);
	}
	lamps.allOff();
	console.log("All lamps off!");
});

// and on during the day...
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

}