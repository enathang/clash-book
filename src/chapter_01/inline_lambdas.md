# Inline lambdas

We have seen in the Basic higher-order functions section that we can pass functions as arguments to other functions, like so

```
>>> vec = 3 :> 4 :> 5 :> Nil :: Vec 3 (Unsigned 8)
>>> map (+1) vec
4 :> 5 :> 6 :> Nil
```

Often times we will use these functions with existing named function. However, sometimes we would like to quickly apply a function to a type without making a special, new function. We can use anonymous lambdas, or inline lambdas, to do this.

Inline lambdas have the syntax
```
(\var1 var2 ... -> exp)
```
where `\` is used by Haskell because it looks similar to the lambda symbol.


**Examples**
```
map (\x -> x+1) vec
map (\x y -> x+y)
map (\(x, y) -> x+y)   -- You can also use pattern matching in a lambda
```