/* LampsWrapper */

(function(){

    var hue = require('hue-module');
    var Concern = require('./Concern');
    var Step = require('step');

    // stop all lamp at startup

    var _hueIp = null;
    var _userName = null;
    var _lampMapping = {};

    exports.name = function() {
        return "hue";
    }

    exports.type = function() {
        return "output";
    }   

    exports.init = function(config) {
        console.log("lampsWrapper : Init [hueIp=%s, userName=%s]", config.url, config.username);

        _hueIp = config.url;
        _userName = config.username;

        hue.load(_hueIp, _userName);
        var services = config.lampServices.reverse();
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

    exports.michaelKnight = function(duration) {
        if (!duration) {
            duration = 5000;
        }
        console.log("Michael Knight for "+duration);
        var restore = [];
        Step(
            function() {
                console.log("Get lights"); // XXX
                hue.lights(this);
            },
            function(lights) {
                console.log("Got lights", lights); // XXX
                var group = this.group();
                for (i in lights) {
                    if (lights.hasOwnProperty(i)) {
                        var light = lights[i];
                        console.log("Count++",i);
                        betterLight(light.id, group());
                    }
                }
            },
            function(err, lightsData) {
                console.log("Got lightsData", lightsData.length); // XXX
                for (i = 0; i < lightsData.length; i++) {
                    console.log("Store light data ",lightsData[i]);
                    restore.push(lightsData[i]);
                }
                hue.lights(this);
            },
            function(lights) {
                console.log("Got lights", lights); // XXX
                setTimeout(function() {
                    for (i in lights) {
                        if (lights.hasOwnProperty(i)) {
                            var light = lights[i];
                            hue.change(light.set({
                                sat:255, bri :255, hue: 0 , on : true,
                                alert : "lselect", transistiontime : 10
                            }));
                        }
                    }
                }, 1000);
            }
        );

//        setTimeout(function() {
//            console.log("Restore");
//            for (i in restore) {
//                var light = restore[i];
//                console.log("To restore: ",light);
//                hue.light(light.id, function(l) {
//                    hue.change(l.set(light));
//                });
//            }
//        }, duration);


        function betterLight(id, callback) {
            hue.light(id, function(l) {
                callback(null, l);
            });
        }
        

    }

})();
