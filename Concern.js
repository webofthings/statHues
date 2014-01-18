(function(){
    var Concern = (function() {
        function Concern(name, todo) {
            this.name = name;
            this.todo = todo;
        }

        Concern.prototype.ok = function(duration) {
            return this.green(duration);
        }

        Concern.prototype.warn = function(duration) {
            return this.yellow(duration);
        }

        Concern.prototype.error = function(duration) {
            return this.red(duration);
        }

        Concern.prototype.color = function(name, duration) {
            if (name === 'red') {
                return this.red(duration);
            } else if (name === 'green') {
                return this.green(duration);
            } else if (name === 'blue') {
                return this.blue(duration);
            } else if (name === 'yellow') {
                return this.yellow(duration);
            } else {
                console.log("Unknown color : ",name);
                return this;
            }
        }

        Concern.prototype.red = function(duration) {
            return this.rgb([255, 0, 0], duration);
        }

        Concern.prototype.green = function(duration) {
            return this.rgb([0, 255, 0], duration);
        }

        Concern.prototype.blue = function(duration) {
            return this.rgb([0, 0, 255], duration);
        }

        Concern.prototype.yellow = function(duration) {
            return this.rgb([255, 255, 0], duration);
        }

        Concern.prototype.cyan = function(duration) {
            return this.rgb([255, 0, 255], duration);
        }

        Concern.prototype.magenta = function(duration) {
            return this.rgb([0, 255, 255], duration);
        }

        Concern.prototype.white = function(duration) {
            return this.rgb([255, 255, 255], duration);
        }

        Concern.prototype.on = function(duration) {
            return this.toggle(true, duration);
        }

        Concern.prototype.off = function(duration) {
            return this.toggle(false, duration);
        }

        Concern.prototype.toggle = function(toggle, duration) {
            var next = {
                "on" : toggle
            };

            return this.addState(next, duration);
        }

        Concern.prototype.rgb = function(rgb, duration) {
            var next = {
                "on" : true,
                "rgb" : rgb,
                "bri" : 255
            };

            return this.addState(next, duration);
        }

        Concern.prototype.addState = function(state, duration) {
            var last = this.todo[this.todo.length - 1];
            if (last && !last.duration) {
                last.duration = 1500;
            }

            this.todo.push({
                state : state,
                duration : duration
            });

            return this;
        }

        Concern.prototype.blink = function() {
            var last = this.todo[this.todo.length - 1];
            var duration = false;
            if (last && last.duration) {
                duration = last.duration;
                last.duration = 10;
            }

            this.todo.push({
                state : { "alert" : "lselect"},
                duration : duration
            });

            return this;
        
        }

        return Concern;

    })();

    exports.Concern = Concern;

    exports.Empty = function(name) {
        return new Concern(name, []);
    }
})();
