(function(){

	var server = '';
	var evrythngApiKey = '';

// sorry ugly I know... but it doesn't work today. 
//var evt = require('../evrythng-js-sdk/evrythng.js');


// Best http client lib in the world. srsly.
var request = require('request');

exports.init = function(config) {

	evryhtngApiKey = config.apiKey;

			// obviously only prod for now
			switch(config.url)
			{
				default:
				server = 'https://api.evrythng.com';
				break;
			}
			
			// get all things to test if API connex works
			
			
			this.loadService('GITHUB');
			console.log("evrythngServices : Init [environment=%s, apiKey=%s]", config.url, config.apiKey);
			
		}
		
		
		exports.loadService = function(serviceName){
			
			this.searchThngs(serviceName, function(data){console.log(data)}; );
			
		}
		
		
		
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
			
			request(options, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					//result=body;
			    //console.log(body) // Print the google web page.
			    callback(body)
			}
		})

			return result;			
			
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
			    console.log(body) // Print the google web page.
			}
		})
			
			
		}




	})();
