var EventEmitter = require("events").EventEmitter;

var global = (function () {
    return this;
})();

var native = {
    global: global,
    console: global.console
};

var dummy = function () {
};

var echo = function (message) {
    return message;
};

var lastId = 0;
var id = function () {
    return ++lastId;
};
Object.defineProperty(id, "last", {
    configurable: false,
    enumerable: true,
    get: function () {
        return lastId;
    }
});
id.define = function (subject) {
    Object.defineProperty(subject, "id", {
        configurable: false,
        enumerable: false,
        writable: false,
        value: id()
    });
};

var watchObserver = "@observer";

var watch = function (subject, property, listener) {
    if (!(subject instanceof Object))
        throw new InvalidArguments();
    if (typeof (property) != "string")
        throw new InvalidArguments();
    if (!(listener instanceof Function))
        throw new InvalidArguments();

    var observer = subject[watchObserver];
    if (!subject.hasOwnProperty(watchObserver)) {
        observer = new EventEmitter();
        observer.values = {};
        Object.defineProperty(subject, watchObserver, {
            writable: false,
            enumerable: false,
            configurable: false,
            value: observer
        });
    }
    if (!observer.values.hasOwnProperty(property)) {
        var enumerable = true;
        if (subject.hasOwnProperty(property)) {
            var descriptor = Object.getOwnPropertyDescriptor(subject, property);
            if (!descriptor.configurable)
                throw new InvalidArguments();
            if (descriptor.set || descriptor.get)
                throw new InvalidArguments();
            if (!descriptor.writable)
                throw new InvalidArguments();
            enumerable = descriptor.enumerable;
        }
        observer.values[property] = subject[property];
        Object.defineProperty(subject, property, {
            set: function (value) {
                var oldValue = observer.values[property];
                observer.values[property] = value;
                if (value !== oldValue)
                    observer.emit(property, value, oldValue, property, subject);
            },
            get: function () {
                return observer.values[property];
            },
            enumerable: enumerable,
            configurable: false
        });
    }
    observer.on(property, listener);
};

var unwatch = function (subject, property, listener) {
    if (!(subject instanceof Object))
        throw new InvalidArguments();
    if (typeof (property) != "string")
        throw new InvalidArguments();
    if (!(listener instanceof Function))
        throw new InvalidArguments();

    if (subject.hasOwnProperty(watchObserver))
        subject[watchObserver].removeListener(property, listener);
};

var clone = function (subject) {
    if (typeof (subject) == "object" && subject && (subject.clone instanceof Function))
        return subject.clone();
    return shallowClone(subject);
};

var shallowClone = function (subject) {
    if (typeof (subject) != "object" || subject === null)
        return subject;
    if (subject instanceof Array)
        return subject.slice();
    if (subject instanceof Date)
        return new Date(subject);
    if (subject instanceof RegExp)
        return new RegExp(subject);
    return Object.create(subject);
};

var merge = function (subject, source) {
    if (!(subject instanceof Object))
        throw new InvalidArguments();
    var sources = toArray(arguments).slice(1);
    if (subject.merge instanceof Function)
        return subject.merge.apply(subject, sources);
    return shallowMerge(subject, sources);
};

var shallowMerge = function (subject, sources) {
    if (!(subject instanceof Object))
        throw new InvalidArguments();
    if (!(sources instanceof Array))
        throw new InvalidArguments();
    for (var index in sources) {
        var source = sources[index];
        if (source === undefined || source === null)
            continue;
        if (!(source instanceof Object))
            throw new InvalidArguments();
        for (var property in source)
            subject[property] = source[property];
    }
    return subject;
};

var deep = function (subject, source, options, path) {
    if (!path)
        path = [];
    if (options === null || options === undefined)
        options = {};
    if (!(options instanceof Object) || (options.constructor !== Object))
        throw new InvalidArguments.Nested({path: path});

    for (var option in options) {
        var value = options[option];
        if (option == "required") {
            if (typeof (value) != "boolean")
                throw new InvalidArguments.Nested({path: path});
        }
        else if (option == "subject") {
            if (!(value instanceof Function))
                throw new InvalidArguments.Nested({path: path});
        }
        else if (option == "property") {
            if (!(value instanceof Object) || value.constructor !== Object)
                throw new InvalidArguments.Nested({path: path});
            for (var propertyOptionsProperty in value) {
                var propertyOption = value[propertyOptionsProperty];
                if (!(propertyOption instanceof Object) || (propertyOption.constructor !== Object && !(propertyOption instanceof Function)))
                    throw new InvalidArguments.Nested({path: path});
            }
        }
        else if (option == "defaultProperty") {
            if (!(value instanceof Object) || (value.constructor !== Object && !(value instanceof Function)))
                throw new InvalidArguments.Nested({path: path});
        }
        else
            throw new InvalidArguments.Nested({path: path});
    }

    var isEnumerable = function (o) {
        return (o instanceof Object) && !(o instanceof Date) && !(o instanceof RegExp) && !(o instanceof Function);
    };

    var requiredCheck = function () {
        if (options.required && (source === undefined || source === null))
            throw new InvalidArguments.Nested({path: path});
    };

    var eachPropertyCalled = false;
    var eachProperty = function (newSubject, newSource) {
        if (newSubject !== undefined)
            subject = newSubject;
        if (newSource !== undefined)
            source = newSource;

        requiredCheck();

        if (options.defaultProperty || options.property) {
            if (!isEnumerable(source))
                throw new InvalidArguments.Nested({path: path});
            var isSubjectEnumerable = isEnumerable(subject);
            var depth = path.length;

            var visit = {};
            for (var property in source)
                visit[property] = true;
            if (options.property)
                for (var property in options.property) {
                    var propertyOptions = options.property[property];
                    if (!visit.hasOwnProperty(property) && !(propertyOptions instanceof Function) && propertyOptions.required)
                        visit[property] = true;
                }

            for (var property in visit) {
                path[depth] = property;
                var propertyOptions = options.defaultProperty;
                if (options.property && options.property.hasOwnProperty(property)) {
                    propertyOptions = options.property[property];
                    if (!(propertyOptions instanceof Function) && propertyOptions.required && (!(property in source) || source[property] === Object.prototype[property]))
                        throw new InvalidArguments.Nested({path: path});
                }
                if (propertyOptions === undefined)
                    continue;
                var result;
                if (propertyOptions instanceof Function)
                    result = propertyOptions(subject, source[property], property, path);
                else
                    result = deep(isSubjectEnumerable ? subject[property] : undefined, source[property], propertyOptions, path);
                if (result !== undefined) {
                    if (!isSubjectEnumerable)
                        throw new InvalidArguments.Nested({path: path});
                    subject[property] = result;
                }
            }
            path.length = depth;
        }
        eachPropertyCalled = true;
    };

    requiredCheck();
    if (options.subject) {
        var result = options.subject(subject, source, eachProperty, path);
        if (result !== undefined)
            subject = result;
    }
    if (!eachPropertyCalled)
        eachProperty();
    return subject;
};

var toArray = function (subject) {
    if (!(subject instanceof Object) || (subject instanceof Function))
        throw new InvalidArguments();
    if (subject instanceof Array)
        return subject.slice();
    if (subject.toArray instanceof Function)
        return subject.toArray();
    var result = [];
    for (var key in subject)
        result.push(subject[key]);
    return result;
};


var ClassBuilder = function () {
};
ClassBuilder.prototype =
{
    constructor: ClassBuilder,
    subject: undefined,
    setConstructor: function (subject) {
        if (!(subject instanceof Function))
            throw new InvalidArguments();
        if (this.subject)
            throw new InvalidStateTransition();
        this.subject = subject;
        return this;
    },
    inherit: function (Ancestor) {
        if (!(Ancestor instanceof Function))
            throw new InvalidArguments();
        this.mergeStatic(Ancestor);
        this.setPrototype(clone(Ancestor.prototype));
        return this;
    },
    setPrototype: function (prototype) {
        if (typeof (prototype) != "object" || prototype === null)
            throw new InvalidArguments();
        this.subject.prototype = prototype;
        this.subject.prototype.constructor = this.subject;
        return this;
    },
    mergeStatic: function (staticProperties) {
        if (staticProperties)
            merge(this.subject, staticProperties);
        return this;
    },
    mergePrototype: function (properties) {
        if (properties)
            merge(this.subject.prototype, properties);
        return this;
    },
    release: function () {
        var subject = this.subject;
        delete (this.subject);
        return subject;
    }
};
var classBuilder = new ClassBuilder();

var Class = classBuilder
    .setConstructor(function () {
        throw new InstantiatingAbstractClass();
    })
    .inherit(Object)
    .mergeStatic({
        extend: function (properties, staticProperties) {
            return this.clone().mixin(properties, staticProperties);
        },
        clone: function () {
            return classBuilder.setConstructor(function () {
                id.define(this);
                if (this.build instanceof Function)
                    this.build();
                if (this.init instanceof Function)
                    this.init.apply(this, arguments);
            }).inherit(this).release();
        },
        mixin: function (properties, staticProperties) {
            return classBuilder.setConstructor(this).mergePrototype(properties).mergeStatic(staticProperties).release();
        },
        merge: function (source) {
            return shallowMerge(this, toArray(arguments));
        }
    })
    .mergePrototype({
        init: function () {
            this.merge.apply(this, arguments);
            this.configure();
        },
        clone: function () {
            var instance = shallowClone(this);
            id.define(instance);
            if (instance.build instanceof Function)
                instance.build();
            return instance;
        },
        merge: function (source) {
            return shallowMerge(this, toArray(arguments));
        },
        configure: dummy
    })
    .release();


var newUserErrorConstructor = function () {
    return function () {
        id.define(this);
        if (this.build instanceof Function)
            this.build();
        if (this.init instanceof Function)
            this.init.apply(this, arguments);
    }
};

var UserError = classBuilder.setConstructor(newUserErrorConstructor())
    .inherit(Error)
    .mergeStatic(Class).mergePrototype(Class.prototype)
    .mergeStatic({
        clone: function () {
            return classBuilder.setConstructor(newUserErrorConstructor()).inherit(this).release();
        },
        getCurrentStackTrace: function () {
            var nativeError = new Error();
            var parser = new StackStringParser();
            return parser.parse(nativeError.stack);
        },
        parser: undefined
    })
    .mergePrototype({
        name: "UserError",
        message: "",
        stackTrace: undefined,
        init: function () {
            this.merge.apply(this, arguments);
            this.stackTrace = UserError.getCurrentStackTrace();
            Object.defineProperty(this, "stack", {
                configurable: false,
                enumerable: false,
                get: this.toStackString.bind(this)
            });
            this.configure();
        },
        toStackString: function () {
            var string = "";
            string += this.name;
            string += " " + this.message + "\n";
            string += this.stackTrace;
            return string;
        }
    })
    .release();

var InvalidStateTransition = UserError.extend({
    name: "InvalidStateTransition",
    message: "Invalid State Transition"
});

var InstantiatingAbstractClass = UserError.extend({
    name: "InstantiatingAbstractClass",
    message: "Instantiating Abstract Class"
});

var InvalidConfiguration = UserError.extend({
    name: "InvalidConfiguration",
    message: "Invalid configuration"
});

var InvalidArguments = UserError.extend({
    name: "InvalidArguments",
    message: "Invalid arguments."
});

InvalidArguments.Empty = InvalidArguments.extend({
    message: "Arguments required."
});
InvalidArguments.Nested = InvalidArguments.extend({
    path: undefined,
    configure: function () {
        InvalidArguments.prototype.configure.call(this);
        if (this.path instanceof Array)
            this.message = "Invalid arguments on path [" + this.path.join(",") + "]";
    }
});

var InvalidResult = UserError.extend({
    name: "InvalidResult"
});

var CompositeError = UserError.extend({
    name: "CompositeError",
    toStackString: function (key) {
        var string = UserError.prototype.toStackString.call(this);
        if (typeof (key) == "string")
            key += ".";
        else
            key = "";
        for (var property in this) {
            var error = this[property];
            if (!(error instanceof Error))
                continue;
            string += "\ncaused by <" + key + property + "> ";
            if (error instanceof CompositeError)
                string += error.toStackString(key + property);
            else
                string += error.stack;
        }
        return string;
    }
});

var StackTrace = Class.extend({
    frames: [],
    string: undefined,
    build: function () {
        this.frames = shallowClone(this.frames);
    },
    merge: function (source) {
        for (var index in arguments)
            deep(this, arguments[index], {
                property: {
                    frames: {
                        subject: function (subjectFrames, frames, eachProperty) {
                            if (!(frames instanceof Array))
                                throw new StackTrace.StackFramesRequired();
                            eachProperty();
                            subjectFrames.push.apply(subjectFrames, frames);
                        },
                        defaultProperty: function (stackTrace, frame) {
                            if (!(frame instanceof StackFrame))
                                throw new StackTrace.StackFrameRequired();
                        }
                    }
                },
                defaultProperty: function (stackTrace, value) {
                    return value;
                }
            }, [index]);
        return this;
    },
    toString: function () {
        if (this.string === undefined)
            this.string = this.frames.join("\n");
        return this.string;
    }
}, {
    StackFramesRequired: InvalidConfiguration.extend({
        message: "An array of frames is required."
    }),
    StackFrameRequired: InvalidConfiguration.extend({
        message: "StackFrame required as frames member."
    })
});

var StackFrame = Class.extend({
    description: undefined,
    path: undefined,
    row: undefined,
    col: undefined,
    string: undefined,
    configure: function () {
        if (typeof (this.description) != "string")
            throw new StackFrame.DescriptionRequired();
        if (typeof (this.path) != "string")
            throw new StackFrame.PathRequired();
        if (isNaN(this.row))
            throw new StackFrame.RowRequired();
        if (isNaN(this.col))
            throw new StackFrame.ColRequired();
    },
    toString: function () {
        if (this.string !== undefined)
            return this.string;
        this.string = "\tat " + this.description + " (" + this.path + ":" + this.row + ":" + this.col + ")";
        if (this.description === "")
            this.string = this.string.replace("  ", " ");

        return this.string;
    }
}, {
    DescriptionRequired: InvalidConfiguration.extend({
        message: "Description string required."
    }),
    PathRequired: InvalidConfiguration.extend({
        message: "Path string required."
    }),
    RowRequired: InvalidConfiguration.extend({
        message: "Row number required."
    }),
    ColRequired: InvalidConfiguration.extend({
        message: "Col number required"
    })
});

var Wrapper = Class.extend({
    preprocessors: [],
    done: function () {
        return toArray(arguments);
    },
    algorithm: function (wrapper) {
        return function () {
            return wrapper.done.apply(this, arguments);
        };
    },
    properties: {},
    build: function () {
        deep(this, this, {
            property: {
                preprocessors: function (subject, preprocessors) {
                    return shallowClone(preprocessors);
                },
                properties: function (subject, properties) {
                    return shallowClone(properties);
                }
            }
        });
    },
    merge: function (source) {
        for (var index in arguments)
            deep(this, arguments[index], {
                property: {
                    preprocessors: {
                        subject: function (subjectPreprocessors, preprocessors, eachProperty) {
                            if (!(preprocessors instanceof Array))
                                throw new Wrapper.ArrayRequired();
                            eachProperty();
                            subjectPreprocessors.push.apply(subjectPreprocessors, preprocessors);
                        },
                        defaultProperty: function (subjectPreprocessors, preprocessor) {
                            if (!(preprocessor instanceof Function))
                                throw new Wrapper.PreprocessorRequired();
                        }
                    },
                    done: function (wrapper, done) {
                        if (!(done instanceof Function))
                            throw new Wrapper.FunctionRequired();
                        return done;
                    },
                    algorithm: function (wrapper, algorithm) {
                        if (!(algorithm instanceof Function))
                            throw new Wrapper.AlgorithmRequired();
                        return algorithm;
                    },
                    properties: {
                        defaultProperty: function (subjectProperties, value) {
                            return value;
                        }
                    }
                },
                defaultProperty: function (subject, value) {
                    return value;
                }
            }, [index]);
        return this;
    },
    toFunction: function () {
        var func = this.algorithm(this);
        if (!(func instanceof Function))
            throw new Wrapper.InvalidAlgorithm();
        shallowMerge(func, [
            {
                wrapper: this
            },
            this.properties
        ]);
        return func;
    }
}, {
    algorithm: {
        cascade: function (wrapper) {
            return function () {
                var parameters = toArray(arguments);
                for (var index in wrapper.preprocessors) {
                    var preprocessor = wrapper.preprocessors[index];
                    var result = preprocessor.apply(this, parameters);
                    if (!(result instanceof Array))
                        throw new Wrapper.InvalidPreprocessor();
                    parameters = result;
                }
                return wrapper.done.apply(this, parameters);
            };
        },
        firstMatch: function (wrapper) {
            return function () {
                var parameters = toArray(arguments),
                    match;
                for (var index in wrapper.preprocessors) {
                    var preprocessor = wrapper.preprocessors[index];
                    match = preprocessor.apply(this, arguments);
                    if (match !== undefined) {
                        if (!(match instanceof Array))
                            throw new Wrapper.InvalidPreprocessor();
                        parameters = match;
                        break;
                    }
                }
                return wrapper.done.apply(this, parameters);
            };
        },
        firstMatchCascade: function (wrapper) {
            return function () {
                var parameters = toArray(arguments);
                var reduce = function () {
                    var match;
                    for (var index in wrapper.preprocessors) {
                        var preprocessor = wrapper.preprocessors[index];
                        match = preprocessor.apply(this, parameters);
                        if (match !== undefined) {
                            if (!(match instanceof Array))
                                throw new Wrapper.InvalidPreprocessor();
                            parameters = match;
                            break;
                        }
                    }
                    if (match !== undefined)
                        reduce.call(this);
                };
                reduce.call(this);
                return wrapper.done.apply(this, parameters);
            };
        }
    },
    ArrayRequired: InvalidConfiguration.extend({
        message: "Array required."
    }),
    PreprocessorRequired: InvalidConfiguration.extend({
        message: "Function required as preprocessor."
    }),
    FunctionRequired: InvalidConfiguration.extend({
        message: "Function required."
    }),
    AlgorithmRequired: InvalidConfiguration.extend({
        message: "Function required."
    }),
    InvalidAlgorithm: InvalidConfiguration.extend({
        message: "Invalid algorithm given."
    }),
    InvalidPreprocessor: InvalidResult.extend({
        message: "Preprocessor must return Array as result."
    })
});

UserError.prototype.merge = new Wrapper({
    algorithm: Wrapper.algorithm.firstMatch,
    preprocessors: [
        function (message) {
            if (typeof (message) == "string")
                return [{message: message}];
        }
    ],
    done: UserError.prototype.merge
}).toFunction();

var StackStringParser = Class.extend({
    messageFinder: /^[^\n]*\n/,
    inheritanceRelatedFramesFinder: /^[\s\S]*?\s+new\s+[^\n]+\n/,
    parse: function (string) {
        if (typeof (string) != "string")
            throw new StackStringParser.StackStringRequired();
        var rawFramesString = this.removeMessage(string);
        var framesString = this.removeInheritanceRelatedFrames(rawFramesString);
        var frames = this.parseFramesString(framesString);
        return new StackTrace({
            frames: frames
        });
    },
    removeMessage: function (stackString) {
        return stackString.replace(this.messageFinder, "");
    },
    removeInheritanceRelatedFrames: function (rawFramesString) {
        return rawFramesString.replace(this.inheritanceRelatedFramesFinder, "");
    },
    parseFramesString: function (framesString) {
        var frameStrings = framesString.split("\n");
        var frames = [];
        for (var index in frameStrings)
            frames.push(this.parseFrameString(frameStrings[index]));
        return frames;
    },
    parseFrameString: new Wrapper({
        algorithm: Wrapper.algorithm.firstMatch,
        preprocessors: [
            function (frameString) {
                var match = frameString.match(/^\s*at\s+(?:\s*(.*?)\s*)\((.+):(\d+):(\d+)\)\s*$/);
                if (match)
                    return [{
                        description: match[1],
                        path: match[2],
                        row: Number(match[3]),
                        col: Number(match[4])
                    }];
            },
            function (frameString) {
                var match = frameString.match(/^\s*at\s+(.+):(\d+):(\d+)\s*$/);
                if (match)
                    return [{
                        description: "",
                        path: match[1],
                        row: Number(match[2]),
                        col: Number(match[3])
                    }];
            },
            function (frameString) {
                var match = frameString.match(/^\s*at\s+(?:\s*(.*?)\s*)\((.+)\)\s*$/);
                if (match)
                    return [{
                        description: match[1],
                        path: match[2],
                        row: -1,
                        col: -1
                    }];
            }
        ],
        done: function (options) {
            if (!(options instanceof Object))
                throw new StackStringParser.UnknownFrameFormat();
            return new StackFrame(options);
        }
    }).toFunction()
}, {
    StackStringRequired: InvalidArguments.extend({
        message: "Stack string required."
    }),
    UnknownFrameFormat: InvalidArguments.extend({
        message: "Unknown frame format."
    })
});

module.exports = {
    native: native,
    dummy: dummy,
    echo: echo,
    id: id,
    watch: watch,
    unwatch: unwatch,
    clone: clone,
    shallowClone: shallowClone,
    merge: merge,
    shallowMerge: shallowMerge,
    deep: deep,
    toArray: toArray,
    ClassBuilder: ClassBuilder,
    Class: Class,
    UserError: UserError,
    CompositeError: CompositeError,
    InvalidStateTransition: InvalidStateTransition,
    InstantiatingAbstractClass: InstantiatingAbstractClass,
    InvalidConfiguration: InvalidConfiguration,
    InvalidArguments: InvalidArguments,
    InvalidResult: InvalidResult,
    StackStringParser: StackStringParser,
    StackTrace: StackTrace,
    StackFrame: StackFrame,
    Wrapper: Wrapper
};

