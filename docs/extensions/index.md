# [API documentation](../index.md)

## extensions

The main goal of extensions to adapt `Inheritance` to the system you prefer.
So the available extensions are just adapters, they do not modify the behavior of the [`Wrapper`](../inheritance/index.md#Wrapper) class or any other classes...

Currently the following extensions are available:

 - [`PrototypeDecorator` extension](inheritance-decorator/index.md) - a general `Extension` class which overrides the `prototype` of the target `constructor`
 - [`Object.prototype` adapter](inheritance-object/index.md) - a `PrototypeDecorator` instance, which extends the `Object.prototype` with `Inheritance` methods
 - [`Function.prototype` adapter](inheritance-function/index.md) - a `PrototypeDecorator` instance, which extends the `Function.prototype` with `Inheritance` methods

All of them are implementing the [`Extension`](Extension.md) interface. Btw. implementing this interface is not necessary, it is just a recommended feature.

If you have a special environment, in which you want to program object oriented, then you can write your own adapter.
You should just implement the [`Extension`](Extension.md) interface and use the [`wrap()`](../inheritance/index.md#wrap) function and the methods you can find in the [`Wrapper`]((../inheritance/index.md#Wrapper)) class.