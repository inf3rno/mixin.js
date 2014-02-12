# API Documentation

## Inheritance Extensions

The main goal of extensions to adapt `Inheritance` to the system you prefer. So these extensions are just adapters, they do not modify the behavior of `Inheritance()`.

Currently the following extensions are available:

 - [`Object.prototype` adapter](extensions/object.md)
 - [`Function.prototype` adapter](extensions/function.md)

and you have an `Extension` class described in the following section.

### Extension interface

There isn't any restriction about how an extension has to be implemented, however I recommend the following interface:

    void initialize (options) - initialization, configuration
    void config(options) - configuration, should contain the options.isEnabled flag which enables the plugin
    Boolean isEnabled - this property stores whether the extension is enabled
    void enable() - enables the extension
    void disable() - disables the extension

If you have your own idea, just use the `Inheritance()` in your own adapter. There is nothing else to do.

### The Extension class

You can add a target object appender extension by instantiating the `Extension(options)` `constructor`.

For example the following `extension` appends the `Function.prototype`.

    var extension = new Extension({
        target: Function,
        source: {
            toObject: function (){
                return this.prototype
            }
        }
    });

This kind of `extension`s copy properties from a `source` to a `target` during the enabling procedure.

    extension.enable();
    console.assert(extension.isEnabled, "The extension should be enabled after calling the enable()");
    console.assert(Function.prototype.toObject instanceof Function, "Should copy the toObject function by enable.");

Disabling the `extension` should restore the original properties of the `target`.

    extension.disable();
    console.assert(!extension.isEnabled, "The extension should not be enabled after calling the disable()");
    console.assert(Function.prototype.toObject === undefined, "Should restore the undefined property of toObject by disable.");

Ofc. the `Extension` class is not always the best choice, but it works like charm by the `Function.prototype` and the `Object.prototype` adapters.
