(function () {

    var global = Function('return this')() || (42, eval)('this');

    if (!Object.prototype.hasOwnProperty)
        Object.prototype.hasOwnProperty = function (prop) {
            var proto = this.__proto__ || this.constructor.prototype;
            return (prop in this) && (!(prop in proto) || proto[prop] !== this[prop]);
        };

    if (!Object.create)
        Object.create = function (proto) {
            var Surrogate = function () {
            };
            Surrogate.prototype = proto;
            return new Surrogate();
        };

    if (!Object.defineProperty)
        Object.defineProperty = function (obj, prop, descriptor) {
            obj[prop] = descriptor.value;
        };

    if (!global.WeakMap) {
        var uid = 0;
        WeakMap = function () {
            this.secretProperty += String(++uid);
        };
        WeakMap.prototype = {
            constructor: WeakMap,
            secretProperty: "__secret_",
            set: function (key, value) {
                Object.defineProperty(key, this.secretProperty, {
                    value: value,
                    configurable: false,
                    enumerable: false,
                    writeable: false
                });
            },
            get: function (key) {
                return key[this.secretProperty];
            },
            has: function (key) {
                return this.secretProperty in key;
            }
        };
    }

})();

