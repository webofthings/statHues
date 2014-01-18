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

            this.todo.push({
                state : next,
                duration : duration
            });

            return this;
        }

        Concern.prototype.rgb = function(rgb, duration) {
            var next = {
                "on" : true,
                "rgb" : rgb
            };

            this.todo.push({
                state : next,
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
