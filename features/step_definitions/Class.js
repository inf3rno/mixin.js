var expect = require("expect.js"),
    sinon = require("sinon"),
    Class = require("../../lib/Class");

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

    this.Given("a config with a constructor", function (next) {
        config = {
            prototype: {
                constructor: aConstructor
            }
        };
        next();
    });


    this.When("I create a class based on this config", function (next) {
        aClass = Class(Object, config);
        next();
    });

    this.Then("the constructor of the class should be the constructor given in the config", function (next) {
        expect(aClass).to.be(aConstructor);
        next();
    });

    this.Given("a config with factory", function (next) {
        config = {
            factory: function () {
                return anotherConstructor;
            }
        };
        next();
    });

    this.Then("the constructor of the class should be created by the factory given in the config", function (next) {
        expect(aClass).to.be(anotherConstructor);
        next();
    });

    this.Given("an ancestor class having a factory", function (next) {
        anAncestor = Class(Object, {
            factory: function () {
                return oneMoreConstructor
            }
        });
        next();
    });

    this.When("I create a class inheriting from this ancestor", function (next) {
        aClass = Class.clone.call(anAncestor);
        next();
    });

    this.Then("the constructor of the class should be created by the factory inherited from the ancestor", function (next) {
        expect(aClass).to.be(oneMoreConstructor);
        next();
    });

    this.When("I create a class without a factory", function (next) {
        defaultFactorySpy = sinon.spy(Class, "factory");
        aClass = Class(Object, {});
        next();
    });

    this.Then("the constructor of the class should be created by the default factory", function (next) {
        expect(defaultFactorySpy.called).to.be.ok();
        expect(defaultFactorySpy.returned(sinon.match.same(aClass))).to.be.ok();
        Class.factory.restore();
        next();
    });

    this.Given("a config having properties", function (next) {
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

    this.Then("the class should add the properties from the config", function (next) {
        expect(aClass.a).to.be(1);
        expect(aClass.b).to.be(2);
        expect(aClass.prototype.c).to.be(3);
        expect(aClass.prototype.d).to.be(4);
        next();
    });

    this.Given("an ancestor class having properties", function (next) {
        anAncestor = Class(Object, {
            x: 1,
            prototype: {
                y: 2,
                z: 3
            }
        });
        next();
    });

    this.Then("the class should inherit properties of the ancestor", function (next) {
        expect(aClass.prototype).to.be.an(anAncestor);
        expect(aClass.x).to.be(anAncestor.x);
        next();
    });

    this.When("I create a class and merge it with the properties of another class", function (next) {
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

    this.Then("the class should add the properties of the other class", function (next) {
        expect(aClass.a).to.be(1);
        expect(aClass.b).to.be(12);
        expect(aClass.x).to.be(101);
        expect(aClass.prototype.c).to.be(3);
        expect(aClass.prototype.d).to.be(14);
        expect(aClass.prototype.y).to.be(102);
        next();
    });

    this.When("I create a class inheriting from the Class class", function (next) {
        aClass = Class.clone();
        next();
    });

    this.Then("the class should inherit the methods declared in the Class class", function (next) {
        expect(aClass.prototype).to.be.a(Class);
        expect(aClass.clone).to.be(Class.clone);
        next();
    });

    this.When("I create a class and merge it with the Class class properties", function (next) {
        aClass = Class(Object, {});
        Class.merge.call(aClass, Class);
        next();
    });

    this.Then("the class should add the properties of the Class class", function (next) {
        expect(aClass.prototype).not.to.be.a(Class);
        expect(aClass.prototype.clone).to.be(Class.prototype.clone);
        expect(aClass.clone).to.be(Class.clone);
        next();
    });

};