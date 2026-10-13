# Inline lambdas

We have seen in the [Basic higher-order functions](basic_functions.md) section that we can pass functions as arguments to other functions, like so

```
>>> vec = 3 :> 4 :> 5 :> Nil :: Vec 3 (Unsigned 8)
>>> map (+1) vec
4 :> 5 :> 6 :> Nil
```

Oftentimes, we will use higher-order functions with existing named function. However, sometimes we would like to quickly apply a function to a type without making a special, new function. We can use an anonymous lambda, or inline lambda, to do this.

Inline lambdas have the syntax
```
(\var1 var2 ... -> exp)
```
where `\` is used by Haskell because it looks similar to the lambda symbol.


**Examples**
```
map (\x -> x+1) vec
zipWith (\x y -> x+y)
map (\(x, y) -> x+y)   -- You can also use pattern matching in our lambda
```

**Conclusion**

That's about it, really. Since pattern matching (previous section) and guards (next section) are more involved, I though I'd sneak in an easy section in the middle.