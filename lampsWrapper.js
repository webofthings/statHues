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
                    hue.change(lights[i].set({"on": true, "hue":0}));
        });
    }

    function executeNextStep(dummy, todos) {
         var next = todos.pop();
         if (next) {
            console.log("Execute next step ", next);
           var state = next.state;
           console.log("-> state ", state);
           var duration = next.duration;
           console.log("-> duration ", duration);

           // TODO
            hue.lights(function(lights) {
                var light = lights[0];
                hue.change(light.set(state));
            });
            
           if (duration) {
               setTimeout(function() {
                    executeNextStep(dummy, todos)
                }, duration);
           }
         }
    }
    exports.change = function(what, fn) {
        //hue.lights(function(lights) {
        //    var light = lights[0];

            var concern = Concern.Empty(what);
            concern = fn(concern);

            var todos = concern.todo.reverse();
            executeNextStep(what, todos);
        //});
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
