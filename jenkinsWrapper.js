/* JenkinsWrapper */

module.exports = {
	name : function() {
		return "jenkins";
	},
	type : function() {
		return "input";
	},
	init: function (config) {
		
		console.log("Initialising Jenkins wrapper...");
		
	}, 
	checkStatus : function() {
		console.log("not implemented yet!");
	}
	
}