var expect = require("expect.js"),
    sinon = require("sinon"),
    o3 = require("../../.."),
    Class = o3.Class,
    InstantiatingAbstractClass = o3.InstantiatingAbstractClass;

module.exports = function () {
    var Ancestor,
        Descendant,
        instance,
        RandomClass = function () {
        };

    this.Given(/^an Ancestor$/, function (next) {
        Ancestor = Class.extend({
            a: {},
            b: function () {
            }
        }, {
            x: {},
            y: function () {
            }
        });
        next();
    });

    this.When(/^I clone the Ancestor$/, function (next) {
        Descendant = Ancestor.extend();
        next();
    });

    this.When(/^I instantiate the Descendant$/, function (next) {
        instance = new Descendant();
        next();
    });

    var instanceClone;
    this.When(/^I clone the instance$/, function (next) {
        instanceClone = instance.clone();
        next();
    });

    this.Then(/^the Descendant should inherit the properties of the Ancestor$/, function (next) {
        expect(Descendant.prototype.a).to.be(Ancestor.prototype.a);
        expect(Descendant.prototype.b).to.be(Ancestor.prototype.b);
        expect(Descendant.x).to.be(Ancestor.x);
        expect(Descendant.y).to.be(Ancestor.y);
        next();
    });

    this.Then(/^the instance of the Descendant should be the instance of the Ancestor$/, function (next) {
        expect(instance).to.be.a(Descendant);
        expect(instance).to.be.an(Ancestor);
        next();
    });

    this.Then(/^not the instance of some RandomClass$/, function (next) {
        expect(instance).not.to.be.a(RandomClass);
        next();
    });

    var abstractInstantiation;

    this.When(/^I try to instantiate the base Class$/, function (next) {
        abstractInstantiation = function () {
            new Class();
        };
        next();
    });

    this.Then(/^it should throw an Error, because of abstract class instantiation$/, function (next) {
        expect(abstractInstantiation).to.throwError(new InstantiatingAbstractClass());
        next();
    });


    var aClass;

    this.Given(/^a class$/, function (next) {
        aClass = Class.extend({
            a: 1,
            b: 2
        }, {
            x: 11,
            y: 12
        });
        next();
    });

    this.When(/^I add new properties$/, function (next) {
        aClass.mixin({
            b: 3,
            c: 4
        }, {
            y: 13,
            z: 14
        });
        next();
    });

    this.Then(/^the class should contain the new properties$/, function (next) {
        expect(aClass.prototype.c).to.be(4);
        expect(aClass.z).to.be(14);
        next();
    });

    this.Then(/^the inherited properties of the class should be overridden with the new ones$/, function (next) {
        expect(aClass.prototype.b).to.be(3);
        expect(aClass.y).to.be(13);
        next();
    });

    this.When(/^I instantiate the class$/, function (next) {
        instance = new aClass({
            b: 5,
            c: 6
        });
        next();
    });

    this.Then(/^the instantiation with parameters should add new properties to the instance by default$/, function (next) {
        expect(instance).to.be.an(aClass);
        expect(instance.b).to.be(5);
        expect(instance.c).to.be(6);
        next();
    });

    var spy;

    this.Given(/^a class with custom merging algorithm$/, function (next) {
        spy = sinon.spy();
        aClass = Class.extend({
            merge: spy
        }, {
            merge: spy
        });
        next();
    });

    this.Then(/^the class should use the custom merging algorithm to add the new properties$/, function (next) {
        expect(spy.called).to.be.ok();
        expect(spy.callCount).to.be(2);
        expect(spy.calledWith({
            b: 3,
            c: 4
        })).to.be.ok();
        expect(spy.calledWith({
            y: 13,
            z: 14
        })).to.be.ok();
        next();
    });

    this.Given(/^an Ancestor with custom cloning algorithm$/, function (next) {
        spy = sinon.spy();
        Ancestor = Class.extend({
            build: spy
        });
        next();
    });

    this.Then(/^the Descendant should inherit the properties of the Ancestor by using the custom cloning algorithm$/, function (next) {
        expect(spy.calledOn(Descendant.prototype)).to.be.ok();
        next();
    });


    this.Then(/^the instantiation should trigger the custom cloning algorithm$/, function (next) {
        expect(spy.calledOn(instance)).to.be.ok();
        next();
    });

    this.Then(/^the instance cloning should trigger the custom cloning algorithm as well$/, function (next) {
        expect(spy.calledOn(instanceClone)).to.be.ok();
        next();
    });

    this.Given(/^a class with custom initialization algorithm$/, function (next) {
        spy = sinon.spy();
        aClass = Class.extend({
            init: spy
        });
        next();
    });

    this.Then(/^the instantiation with parameters should trigger the custom initialization algorithm$/, function (next) {
        expect(spy.callCount).to.be(1);
        expect(spy.calledOn(instance)).to.be.ok();
        expect(spy.calledWith({
            b: 5,
            c: 6
        }));
        next();
    });

    this.Then(/^the default behavior which is adding new properties to the instance should not run$/, function (next) {
        expect(instance.b).to.be(undefined);
        expect(instance.c).to.be(undefined);
        next();
    });
};