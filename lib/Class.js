var Class = function (Source, config) {
    if (arguments.length == 0) {
        Source = Object;
        config = {};
    }
    if (arguments.length == 1 && !(Source instanceof Function)) {
        config = Source;
        Source = Object;
    }
    if (!config)
        config = {};
    if (!(config instanceof Object))
        throw new SyntaxError("Invalid configuration object.");
    return (Source.extend || Class.extend).call(Source, config);
};

Class.factory = function () {
    var Source = this;
    return function () {
    };
};

Class.extend = function (config) {
    var Source = this;
    if (!config)
        config = {};
    var Subject;
    if ((config.prototype instanceof Object) && config.prototype.constructor !== Object)
        Subject = config.prototype.constructor;
    else if (config.factory instanceof Function)
        Subject = config.factory.call(Source);
    Subject = (Source.clone || Class.clone).call(Source, Subject);
    (Subject.merge || Class.merge).call(Subject, config);
    return Subject;
};

Class.prototype.extend = function (config) {
    var subject = this;
    var instance = (subject.clone || Class.prototype.clone).call(subject);
    (instance.merge || Class.prototype.merge).call(instance, config);
    return instance;
};

Class.clone = function (Subject) {
    var Source = this;
    if (!(Subject instanceof Function))
        Subject = (Source.factory || Class.factory).call(Source);
    Subject.prototype = (Source.prototype.clone || Class.prototype.clone).call(Source.prototype);
    Subject.prototype.constructor = Subject;
    for (var staticProperty in Source)
        if (staticProperty !== "prototype")
            Subject[staticProperty] = Source[staticProperty];
    return Subject;
};

Class.prototype.clone = function () {
    var subject = this;
    return Object.create(subject);
};

Class.merge = function (config) {
    var Subject = this;
    for (var staticProperty in config)
        if (staticProperty !== "prototype")
            Subject[staticProperty] = config[staticProperty];
    if (config.prototype instanceof Object)
        (Subject.prototype.merge || Class.prototype.merge).call(Subject.prototype, config.prototype);
    return Subject;
};

Class.prototype.merge = function (config) {
    var subject = this;
    for (var property in config)
        if (property !== "constructor")
            subject[property] = config[property];
    return subject;
};

Class.absorb = function (config) {
    var Subject = this;
    for (var staticProperty in config)
        if (staticProperty !== "prototype" && (Subject[staticProperty] === undefined || Subject[staticProperty] === Function.prototype[staticProperty]))
            Subject[staticProperty] = config[staticProperty];
    if (config.prototype instanceof Object)
        (Subject.prototype.absorb || Class.prototype.absorb).call(Subject.prototype, config.prototype);
    return Subject;
};

Class.prototype.absorb = function (config) {
    var subject = this;
    for (var property in config)
        if (property !== "constructor" && (subject[property] === undefined || subject[property] === Object.prototype[property]))
            subject[property] = config[property];
    return subject;
};

Class.getAncestor = function () {
    var Source = this;
    if (Source !== Source.prototype.constructor)
        return Source.prototype.constructor;
};

module.exports = Class;