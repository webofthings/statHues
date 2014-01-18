(function(){

    var hue = require('hue-module');
    var log = require('loggly');
    var Concern = require('./Concern');

    // stop all lamp at startup

    var _hueIp = null;
    var _userName = null;

    exports.init = function(hueIp, userName) {
        console.log("lampsWrapper : Init [hueIp=%s, userName=%s]", hueIp, userName);

        _hueIp = hueIp;
        _userName = userName;

        hue.load(_hueIp, _userName);

        hue.lights(function(lights){
            for(i in lights)
                if(lights.hasOwnProperty(i))
                    hue.change(lights[i].set({"on": true, "hue":16000}));
        });
    }

    exports.change = function(what, fn) {
        hue.lights(function(lights) {
            var light = lights[0];
            console.log("To blue");
            //hue.change(light.set({ rgb : [0,0,255]}));

            var concern = Concern.Empty("test");
            concern = fn(concern);

            for (i = 0; i < concern.todo.length; i++) {
                var todo = concern.todo[i];
                console.log("Concern todo ", todo);

                var state = todo.state;
                 console.log("Concern state ", todo.state);

                hue.change(light.set(todo.state));
            }
        });
    }
    
    //function changeStatesAndRestore(newStates, duration) {
    //    Step(
    //        function lights() {
    //            hue.lights(this);
    //        },
    //        function saveState(lights) {
    //            for(i in lights)
    //                if(lights.hasOwnProperty(i)) {
    //
    //                }
    //        }
    //    )
    //}


})();
