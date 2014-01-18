var hue = require('hue-module');

hue.load("192.168.11.131", "newdeveloper");

hue.lights(function(lights){
    for(i in lights)
        if(lights.hasOwnProperty(i))
            hue.change(lights[i].set({"off": true, "rgb":[0,200,200]}));
});