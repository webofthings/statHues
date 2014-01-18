/* LampsWrapper */

module.exports = {
	name : function() {
		return "hue";
	},
	type : function() {
		return "output";
	},
	init: function () {	
		console.log("Initialising Hue lamps wrapper...");
	}
	
}