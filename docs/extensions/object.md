# API Documentation

## Available Extensions

If you want to know more about extensions please visit the [Inheritance Extensions](../extension.md) section!

### Object.prototype adapter

This adapter extends the `Object.prototype` with the following functions:

    Object mixin(ancestor1, ancestor2, ...) - multiple inheritance
    Object extend(ancestor1, ancestor2, ...) - prototypal inheritance
    Boolean hasAncestors(ancestor1, ancestor2, ...) - ancestor check
    Boolean hasDescendants(descendant1, descendant2, ...) - descendant check
    Boolean instanceOf(ancestor1, ancestor2, ..., constructor, ...) - instance check
    Function toFunction() - returns the constructor

Example usage:

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

Of course your can combine this with the `Function.prototype` adapter if you want, but usually the `Function.prototype` adapter is more than enough, and nobody will like you if you override the `Object.prototype`.
