var expect = require("expect.js"),
    sinon = require("sinon"),
    Class = require("../..").Class;

module.exports = function () {

    var config,
        aClass,
        aConstructor = function () {
        },
        anotherConstructor = function () {
        },
        oneMoreConstructor = function () {
        },
        anAncestor,
        defaultFactorySpy;

    this.Given(/^a config with a constructor$/, function (next) {
        config = {
            prototype: {
                constructor: aConstructor
            }
        };
        next();
    });


    this.When(/^I create a class based on this config$/, function (next) {
        aClass = Class(Object, config);
        next();
    });

    this.Then(/^the constructor of the class should be the constructor given in the config$/, function (next) {
        expect(aClass).to.be(aConstructor);
        next();
    });

    this.Given(/^a config with factory$/, function (next) {
        config = {
            factory: function () {
                return anotherConstructor;
            }
        };
        next();
    });

    this.Then(/^the constructor of the class should be created by the factory given in the config$/, function (next) {
        expect(aClass).to.be(anotherConstructor);
        next();
    });

    this.Given(/^an ancestor class having a factory$/, function (next) {
        anAncestor = Class(Object, {
            factory: function () {
                return oneMoreConstructor
            }
        });
        next();
    });

    this.When(/^I create a class inheriting from this ancestor$/, function (next) {
        aClass = Class.clone.call(anAncestor);
        next();
    });

    this.Then(/^the constructor of the class should be created by the factory inherited from the ancestor$/, function (next) {
        expect(aClass).to.be(oneMoreConstructor);
        next();
    });

    this.When(/^I create a class without a factory$/, function (next) {
        defaultFactorySpy = sinon.spy(Class, "factory");
        aClass = Class(Object, {});
        next();
    });

    this.Then(/^the constructor of the class should be created by the default factory$/, function (next) {
        expect(defaultFactorySpy.called).to.be.ok();
        expect(defaultFactorySpy.returned(sinon.match.same(aClass))).to.be.ok();
        Class.factory.restore();
        next();
    });

    this.Given(/^a config having properties$/, function (next) {
        config = {
            a: 1,
            b: 2,
            prototype: {
                c: 3,
                d: 4
            }
        };
        next();
    });

    this.Then(/^the class should add the properties from the config$/, function (next) {
        expect(aClass.a).to.be(1);
        expect(aClass.b).to.be(2);
        expect(aClass.prototype.c).to.be(3);
        expect(aClass.prototype.d).to.be(4);
        next();
    });

    this.When(/^I create a class with some of these properties defined$/, function (next) {
        aClass = Class({
            a: 11,
            prototype: {
                c: 13
            }
        });
        next();
    });

    this.Then(/^the absorb method should add only the missing properties from the config$/, function (next) {
        Class.absorb.call(aClass, config);
        expect(aClass.a).to.be(11);
        expect(aClass.b).to.be(2);
        expect(aClass.prototype.c).to.be(13);
        expect(aClass.prototype.d).to.be(4);
        next();
    });


    this.Given(/^an ancestor class having properties$/, function (next) {
        anAncestor = Class(Object, {
            x: 1,
            prototype: {
                y: 2,
                z: 3
            }
        });
        next();
    });

    this.Then(/^the class should inherit properties from the ancestor$/, function (next) {
        expect(aClass.prototype).to.be.an(anAncestor);
        expect(aClass.x).to.be(anAncestor.x);
        next();
    });

    this.When(/^I create a class and merge it with the properties of another class$/, function (next) {
        aClass = Class(Object, {
            a: 1,
            b: 2,
            prototype: {
                c: 3,
                d: 4
            }
        });
        Class.merge.call(aClass, Class(Object, {
            b: 12,
            x: 101,
            prototype: {
                d: 14,
                y: 102
            }
        }));
        next();
    });

    this.Then(/^the class should contain the properties of the other class$/, function (next) {
        expect(aClass.a).to.be(1);
        expect(aClass.b).to.be(12);
        expect(aClass.x).to.be(101);
        expect(aClass.prototype.c).to.be(3);
        expect(aClass.prototype.d).to.be(14);
        expect(aClass.prototype.y).to.be(102);
        next();
    });

    this.When(/^I create a class and absorb the missing properties from another class$/, function (next) {
        aClass = Class({
            a: 1,
            prototype: {
                c: 3
            }
        });
        var anotherClass = Class({
            a: 11,
            b: 12,
            prototype: {
                c: 13,
                d: 14
            }
        });
        Class.absorb.call(aClass, anotherClass);
        next();
    });

    this.Then(/^the class should add the properties of the other class only if they weren't defined previously$/, function (next) {
        expect(aClass.a).to.be(1);
        expect(aClass.b).to.be(12);
        expect(aClass.prototype.c).to.be(3);
        expect(aClass.prototype.d).to.be(14);
        next();
    });

    this.When(/^I create a class and absorb the missing properties from another class, which inherited some of the properties$/, function (next) {
        aClass = Class({
            a: 1,
            prototype: {
                d: 4
            }
        });
        var anAncestor = Class({
            a: 11,
            b: 12,
            c: 13,
            prototype: {
                d: 14,
                e: 15,
                f: 16
            }
        });
        var anotherClass = Class(anAncestor, {
            a: 21,
            b: 22,
            prototype: {
                e: 25
            }
        });
        Class.absorb.call(aClass, anotherClass);
        next();
    });

    this.Then(/^the class should add the inherited and own properties of the other class only if they weren't defined previously$/, function (next) {
        expect(aClass.a).to.be(1);
        expect(aClass.b).to.be(22);
        expect(aClass.c).to.be(13);
        expect(aClass.prototype.d).to.be(4);
        expect(aClass.prototype.e).to.be(25);
        expect(aClass.prototype.f).to.be(16);
        next();
    });

    this.When(/^I create a class inheriting from the Class class$/, function (next) {
        aClass = Class.clone();
        next();
    });

    this.Then(/^the class should inherit the methods declared in the Class class$/, function (next) {
        expect(aClass.prototype).to.be.a(Class);
        expect(aClass.clone).to.be(Class.clone);
        next();
    });

    this.When(/^I create a class and merge it with the Class class$/, function (next) {
        aClass = Class(Object, {});
        Class.merge.call(aClass, Class);
        next();
    });

    this.Then(/^the class should contain the methods of the Class class$/, function (next) {
        expect(aClass.prototype).not.to.be.a(Class);
        expect(aClass.prototype.clone).to.be(Class.prototype.clone);
        expect(aClass.clone).to.be(Class.clone);
        next();
    });

    this.When(/^I create a class and absorb the missing methods from the Class class$/, function (next) {
        aClass = Class({
            merge: 1,
            prototype: {
                clone: 2
            }
        });
        Class.absorb.call(aClass, Class);
        next();
    });

    this.Then(/^the class should contain the methods of the Class class only if they weren't defined previously$/, function (next) {
        expect(aClass.merge).to.be(1);
        expect(aClass.clone).to.be(Class.clone);
        expect(aClass.prototype.clone).to.be(2);
        expect(aClass.prototype.merge).to.be(Class.prototype.merge);
        next();
    });


};