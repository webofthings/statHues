	/* EVRYTHNG Hackathon - 18/01/2014 */


// Imports
var fs    		= require('fs'),
nconf 		= require('nconf'),
express 	= require('express'),
evrythng 	= require('./evrythngServices.js');
lamps 		= require('./lampsWrapper.js');
jenkins 	= require('./jenkinsWrapper.js');
git 		= require('./gitWrapper.js');
pingdom 	= require('./pingdomWrapper.js');

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
var inputsOutputs = [pingdom, lamps, git, jenkins];


// Let's initialise our modules...
for(var i = 0; i < inputsOutputs.length; i++) {
	var currentService = inputsOutputs[i];
	currentService.init(nconf.get(currentService.name()));
}

/*// and call all the input services!
setTimeout(function() {
	loopInputs();
}, 1000);

function loopInputs() {
	for(var i = 0; i < inputsOutputs.length; i++) {
		var currentService = inputsOutputs[i];
		if(currentService.type() === 'input') {
			currentService.checkStatus();
		}
	}
}*/


function Service(thngId) {
	return service = {
		thngId : thngId,

	}
}

// Add your routes here and send the data to your module

app.get('/api/git/:kpi', function(req, res) {

	git.parse(req, res);

});

// Now let's set up the server itself!	

var server = require('http').createServer(app);
server.listen(1337);
console.log(green + "StatHues is now listening on port 1337!" + reset);

/*	// Example to setup the lamps
	setTimeout(function() {
		lamps.changeAndRestore("github", function(lamp) {

			return lamp.ok(750).blue(1000).cyan(1000).error().warn();
		});
		lamps.change("jenkins", function(lamp) {

			return lamp.red().magenta(1000).yellow(1000);
		});
}, 1000);*/

