(function(){
    var Concern = (function() {
        function Concern(name, todo) {
            this.name = name;
            this.todo = todo;
        }

        Concern.prototype.ok = function() {
            return this.green();
        }

        Concern.prototype.warn = function() {
            return this.yellow();
        }

        Concern.prototype.error = function() {
            return this.red();
        }

        Concern.prototype.red = function() {
            return this.rgb([255, 0, 0]);
        }

        Concern.prototype.green = function() {
            return this.rgb([0, 255, 0]);
        }

        Concern.prototype.blue = function() {
            return this.rgb([0, 0, 255]);
        }

        Concern.prototype.yellow = function() {
            return this.rgb([255, 255, 0]);
        }

        Concern.prototype.cyan = function() {
            return this.rgb([255, 0, 255]);
        }

        Concern.prototype.magenta = function() {
            return this.rgb([0, 255, 255]);
        }

        Concern.prototype.white = function() {
            return this.rgb([255, 255, 255]);
        }

        Concern.prototype.on = function() {
            return this.toggle(true);
        }

        Concern.prototype.off = function() {
            return this.toggle(false);
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
                "rgb" : rgb
            };

            return this.addState(next, duration);
        }

        Concern.prototype.addState = function(state, duration) {
            var last = this.todo[this.todo.length - 1];
            if (last && !last.duration) {
                last.duration = 5000;
            }

            this.todo.push({
                state : state,
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
