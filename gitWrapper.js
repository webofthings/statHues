/* GitWrapper */

module.exports = {
	name : function() {
		return "git";
	},
	type : function() {
		return "input";
	},
	init: function (config) {
		
		console.log("Initialising Git wrapper...");
		
	},
	checkStatus : function() {
		console.log("not implemented yet!");
	},
	
	
	parse: function (req, res) {
		
		console.log(req.params);
		
	}
	
}