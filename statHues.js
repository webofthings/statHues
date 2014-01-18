	/* EVRYTHNG Hackathon - 18/01/2014 */


// Imports
var fs    = require('fs'),
nconf = require('nconf'),
express = require('express');

// Initalize config
nconf.argv()
       .env()
       .file({ file: 'config.json' });

console.log('pingdom: ' + nconf.get('pingdom'));
	
// Let's set up some terminal colours :)
// No-one likes a black and white terminal...

var red   = '\033[31m';
var blue  = '\033[34m';
var green = '\033[32m';
var reset = '\033[0m'; // Set back to white

console.log(green + "Welcome to " + red + "s" + green + "t" + blue + "a" + red + "t" + green + "H" + blue + "u" + red + "e" + green + "s" + blue + "!" + reset);

// Let's get ourselves an instance of express to work with!

var app = express();

// Any extras we want to initiate with express?
// More here: http://expressjs.com/api.html#middleware

app.use(express.bodyParser());
	
// Let's load our modules that we will want to call within
// this node app
	
var lamps 	= require('./lampsWrapper.js');
var jenkins = require('./jenkinsWrapper.js');
var git 	= require('./gitWrapper.js');
var pingdom = require('./pingdomWrapper.js');

//var inputsOutputs = [lamps, git, jenkins];
var inputsOutputs = [pingdom];


// Let's initialise our modules...
	
for(var i = 0; i < inputsOutputs.length; i++) {
	var currentService = inputsOutputs[i];
	currentService.init(nconf.get(currentService.name()));
}

// and call all the input services!
for(var i = 0; i < inputsOutputs.length; i++) {
	var currentService = inputsOutputs[i];
	if(currentService.type() === 'input') {
		currentService.checkStatus();
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