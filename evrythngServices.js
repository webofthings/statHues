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
		
		this.initService('github');
		this.initService('jenkins');
		this.initService('pingdom');
		
			
	}
	
	
	exports.initService = function(serviceName,callback){
		this.loadService(serviceName, function(thngId) {
			console.log("EVT Object for " + serviceName + " initialized: " + thngId);
			services.push({
				name : serviceName,
				thngId : thngId
			});
			
		});
	}
	
	// This is the main thing you guys need to use
	exports.updateServiceProperty = function(serviceName,propId,val,timestamp,callback){
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
		
	}	
		
	exports.loadService = function(serviceName, callback){
		this.searchThngs(serviceName, function(data){
			var thngId='';
			
			console.log("THNG Search - Results found: "+ data)
			
			var body = JSON.parse(data);
			
			if (body.thngsResultCount>0){// if thing was found, use its ID
				// We assume there's only 1...
				thngId=body.thngs[0].id
				callback(null, thngId);
			} else { // otherwise create it on the fly
				var thng = {
		    	name: serviceName
				};
				
				console.log("Then we create thng")
		
				createThng(thng, function(data){
					callback(body.id);
				})
				thng
			}
			
		});
		
		// search for a thng called "serviceName"
		
		// if thng exists, return its id
		
			
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
	exports.searchThngs = function(name, callback){
		var options = {
			url: server+'/search?types=thng&name='+name,
			headers: {
				'User-Agent': 'request',
				'Accept':'application/json',
				'Authorization': evryhtngApiKey
			}
		};
			
		console.log("calling: " + options.url);
			
		request(options, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				//result=body;
				//console.log(body) // Print the google web page.
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
