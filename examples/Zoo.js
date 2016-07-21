var o3 = require("..");

var Animal = o3.Class(Object, {
    type: "Animal",
    count: 0,
    toString: function () {
        return "We have " + this.count + " " + this.type + "s.";
    },
    prototype: {
        name: undefined,
        age: undefined,
        constructor: function (properties) {
            Animal.count++;
            this.merge(properties);
        },
        merge: o3.Class.prototype.merge,
        toString: function () {
            var Class = this.constructor;
            return this.name + " is a " + this.age + " year old " + Class.type + ".";
        }
    }
});

var Dolphin = o3.Class(Animal, {
    type: "Dolphin",
    count: 0,
    prototype: {
        constructor: function (properties) {
            Dolphin.count++;
            Animal.call(this, properties);
        }
    }
});

var Unicorn = o3.Class(Animal, {
    type: "Unicorn",
    count: 0,
    prototype: {
        constructor: function (properties) {
            Unicorn.count++;
            Animal.call(this, properties);
        }
    }
});

var Flipper = new Dolphin({
    name: "Flipper",
    age: 12
});

var Shedd = new Dolphin({
    name: "Shedd",
    age: 8
});

var Majectic = new Unicorn({
    name: "Majectic",
    age: 280
});

var Lovely = new Unicorn({
    name: "Lovely",
    age: 170
});

var Pinkie = new Unicorn({
    name: "Pinkie",
    age: 13
});

console.log("Zoo animal list:");
console.log(Animal.toString());

console.log(Unicorn.toString());
console.log(Majectic.toString());
console.log(Lovely.toString());
console.log(Pinkie.toString());

console.log(Dolphin.toString());
console.log(Flipper.toString());
console.log(Shedd.toString());
