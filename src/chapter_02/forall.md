# Common gotcha: forall.
There is one pitfall with type variables in Haskell that is so common that it warrants its own section.

We can define type variables both in the definition of functions and within our `where` clauses.

```
f :: Vec n a -> Vec n a -> Vec n a
f x y = z
 where
  z = 3 :: Vec n a
```

Within our type signature for `f`, both `n` and `a` are universal. HOWEVER, the type variables `n` and `a` within the `where` clause are NOT automatically assumed by ghc to be the same type variables as the function signature.

Meaning even though you use the same name for the type variable, you can run into the error message

```
Could not deduce `n ~ n0`.
```

However, if you add the quatifier `forall` to the type variables.

```
f :: forall n a. Vec n a -> Vec n a -> Vec n a
f x y = z
 where
  z = 3 :: Vec n a
```

Then it will compile cleanly.