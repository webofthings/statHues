(function(){

	// Best http client lib in the world. srsly.
	var request = require('request');


	var server = '';
	var evrythngApiKey = '';

	var services = [];
	// sorry ugly I know... but it doesn't work today. 
	//var evt = require('../evrythng-js-sdk/evrythng.js');

  exports.name = function() {
      return "evrythng";
  }

  exports.type = function() {
      return "output";
  }


	exports.init = function(config) {
		evryhtngApiKey = config.apiKey;

		// obviously only prod for now
		switch(config.url)
		{
		default:
			server = 'https://api.evrythng.com';
			break;
		}
			
		console.log("evrythngServices : Init [environment=%s, apiKey=%s]", config.url, config.apiKey);
			
		// get all things to test if API connex works
		
		
		// in the mother code, load the service for each ;)			
		initService('github',function(thngId){
			console.log("github shit is initialized");
			//serviceId,propertyName,value,timestamp,callback
			updateServiceProperty('github','commitToday',7,null,function(thngId){
				console.log("github's property is initialized")
			});
		});
		
		initService('jenkins',function(thngId){
			console.log("jenkins shit is initialized")
			//updateServiceProperty('github','commitToday',5,null,null)
		});
		
		initService('pingdom',function(thngId){
			console.log("pingdom shit is initialized")
			//updateServiceProperty('github','commitToday',5,null,null)
		});
		
			
	}
	
	// This simply initiates the service - need to call it once per service
	exports.initService = initService; 
	function initService(serviceName, callback){
				
		loadService(serviceName, function(thngId) {
			console.log("EVT Object for " + serviceName + " loaded: " + thngId);
			services[serviceName]=thngId;
			console.log("Current services: ", services);
			callback(thngId);
		});
		
	} 
		
	
	// This is the main thing you guys need to use
	exports.updateServiceProperty = updateServiceProperty;	
	function updateServiceProperty(serviceName,propId,val,timestamp,callback){
		var property = [{value: val}]; 
		
		var options = {
			url: server+'/thngs/' + services[serviceName] + '/properties/' + propId,
			method: "POST",
			json: property,
			headers: {
				'User-Agent': 'request',
				'Accept':'application/json',
				'Authorization': evryhtngApiKey
			}
		};
		
		console.log("Updating property: " + options.url);
			
		request(options, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				callback(body)
			} else {
				console.log("Update Service Property Problem " + response.statusCode)
			}
		})
		
	}	
		
	//function loadService(serviceName, callback){
	exports.loadService = loadService;
	function loadService(serviceName, callback){
		searchThngs(serviceName, function(data){
			var thngId='';
			
			console.log("Searching for " + serviceName + " - Results found: "+ data)
			
			var body = JSON.parse(data);
			
			if (body.thngs.length>0){// if thing was found, use its ID
				// We assume there's only 1...
				thngId=body.thngs[0].id
				callback(thngId);
			} else { // otherwise create it on the fly
				var thng = {
		    	name: serviceName
				};
				
				console.log("This service doesn't exist yet, we create it then!", thng)
				
				// Create it!
				createThng(thng, function(data){
					console.log("Thng created:",data)
					//var body = JSON.parse(data);
					callback(body.id);
				})
			}
			
		});
			
			
	}
	
		
	// Search for the thng by name
	exports.createThng = createThng; 
	function createThng(thng, callback){
		var options = {
			url: server+'/thngs',
			method: "POST",
			json: thng,
			headers: {
				'User-Agent': 'request',
				'Accept':'application/json',
				'Authorization': evryhtngApiKey
			}
		};
			
		console.log("calling: " + options.url);
			
		request(options, function (error, response, body) {
			if (!error && response.statusCode == 201) {
				//result=body;
				//console.log(body) // Print the google web page.
				callback(body)
			} else {
				console.log("CREATE THNG Problem " + response.statusCode)
			}
		})
			
	};

		
		
	// Search for the thng by name
	exports.searchThngs = searchThngs;
	function searchThngs(name, callback){
		var options = {
			url: server+'/search?types=thng&name='+name,
			headers: {
				'User-Agent': 'request',
				'Accept':'application/json',
				'Authorization': evryhtngApiKey
			}
		};
			
		console.log("Searching: " + options.url);
			
		request(options, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				callback(body)
			}
		})
			
	};
		
	// Gets list of all the thngs
	exports.getAllThngs = function(){
			
		var options = {
			url: server+'/thngs',
			headers: {
				'User-Agent': 'request',
				'Accept':'application/json',
				'Authorization': evryhtngApiKey
			}
		};
			
			
		request(options, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(body) 
			}
		})
			
			
	}




})();
