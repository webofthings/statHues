(function(){

    var hue = require('hue-module');
    var log = require('loggly');
    var Concern = require('./Concern');

    // stop all lamp at startup

    var _hueIp = null;
    var _userName = null;
    var _lampMapping = {};

    exports.init = function(hueIp, userName, lampServices) {
        console.log("lampsWrapper : Init [hueIp=%s, userName=%s]", hueIp, userName);

        _hueIp = hueIp;
        _userName = userName;

        hue.load(_hueIp, _userName);
        var services = lampServices.reverse();
        hue.lights(function(lights){
            for(i in lights)
                if(lights.hasOwnProperty(i)) {
                    var serviceName = services.pop();
                    console.log("Assign service "+serviceName+" to lamp "+i);
                    _lampMapping[serviceName] = i;
                    hue.change(lights[i].set({"on": false, "hue":0}));
                }
        });
    }

    function executeNextStep(service, todos) {
         var next = todos.pop();
         if (next) {
            console.log("Execute next step ", next);
           var state = next.state;
           console.log("-> state ", state);
           var duration = next.duration;
           console.log("-> duration ", duration);

           // TODO
            hue.lights(function(lights) {
                var light = lights[_lampMapping[service]];
                hue.change(light.set(state));
            });
            
           if (duration) {
               setTimeout(function() {
                    executeNextStep(service, todos)
                }, duration);
           }
         }
    }
    exports.change = function(service, fn) {
        if (_lampMapping[service]) {
            console.log("Change lamp state for service "+service+" (lamp "+_lampMapping[service]+")");
            var concern = Concern.Empty(service);
            concern = fn(concern);

            var todos = concern.todo.reverse();
            executeNextStep(service, todos);
        } else {
            console.log("Warn : Service "+service+" is not registered");
        }

    }
    
    exports.changeAndRestore = function(service, fn) {
        if (_lampMapping[service]) {
            console.log("Change and restore lamp state for service "+service+" (lamp "+_lampMapping[service]+")");

            hue.lights(function(lights) {
                var light = lights[_lampMapping[service]];
                var lightId = light.id;
                hue.light(lightId, function(lightData) {
                    console.log("Initial state : ",lightData);
                    var concern = Concern.Empty(service);
                    concern = fn(concern).addState(lightData);
                    var todos = concern.todo.reverse();
                    executeNextStep(service, todos);
                })

            });
        } else {
            console.log("Warn : Service "+service+" is not registered");
        }
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
