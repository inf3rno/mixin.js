# [API documentation](../../index.md) / [extensions](../index.md) / [inheritance-object.js](index.md)

## objectDecorator object

This object is returned by the [module](index.md) and it is a [`PrototypeDecorator`](../inheritance-decorator/PrototypeDecorator.md) instance.
It decorates the `Object.prototype` when it is enabled.

**It is not recommended to use this extension, because it affects the `Object.prototype`. So use it only when you know, what you are doing.**

#### Examples

```js
    var ancestor1 = {
        initialize: function (){
            this.a = 1;
        }
    };
    var Ancestor2 = function (){
        this.b = 2;
    };

    var descendant = ancestor1.extend(
        Ancestor2,
        {
            initialize: function (){
                ancestor1.toFunction().call(this);
                Ancestor2.call(this);
                this.c = 3;
            }
        }
    );

    var Ancestor1 = ancestor1.toFunction();
    var Descendant = descendant.toFunction();

    var a = new Ancestor1();
    console.log(a); //{a:1}
    var d = new Descendant();
    console.log(d); //{a:1, b:2, c:3}
```

## Object.prototype

This is modified when the `objectDecorator` is enabled.
You can achieve that by calling the [`enable()`](../inheritance-decorator/PrototypeDecorator.md#enable) method.

### <a name="mixin"></a>mixin()

This method supports multiple inheritance by calling the [`mixin()`](../../inheritance/Wrapper.md#mixin) method of the `Wrapper` of an `Object` instance.

#### Syntax

`Object mixin(mixed source_1, mixed source_2, ...)`

### <a name="extend"></a>extend()

This method supports prototypal inheritance by calling the [`extend()`](../../inheritance/Wrapper.md#extend) method of the `Wrapper` of an `Object` instance.

#### Syntax

`Object extend(mixed source_1, mixed source_2, ...)`

### <a name="hasAncestors"></a>hasAncestors()

This method supports ancestor check by calling the [`hasAncestors()`](../../inheritance/Wrapper.md#hasAncestors) method of the `Wrapper` of an `Object` instance.

#### Syntax

`Boolean hasAncestors(mixed source_1, mixed source_2, ...)`

### <a name="hasDescendants"></a>hasDescendants()

This method supports descendant check by calling the [`hasDescendants()`](../../inheritance/Wrapper.md#hasDescendants) method of the `Wrapper` of an `Object` instance.

#### Syntax

`Boolean hasDescendants(mixed source_1, mixed source_2, ...)`

### <a name="hasInstance"></a>hasInstance()

This method supports instance check by calling the [`hasInstance()`](../../inheritance/Wrapper.md#hasInstance) method of the `Wrapper` of an `Object` instance.

#### Syntax

`Boolean hasInstance(object instance)`

### <a name="toObject"></a>toObject()

This method returns the `constructor` by calling the [`toObject()`](../../inheritance/Wrapper.md#toObject) method of the `Wrapper` of an `Object` instance. The related `Object` instance is the `prototype` of the returned `constructor`.

#### Syntax

`Function toFunction()`
