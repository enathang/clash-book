# Type application

We have seen functions that are defined with `type variables`.

```
f :: forall n a. Vec n a -> Vec n a -> Vec n a
f x y = z
 where
  z = 3 :: Vec n a
```

These type variables are often inferred from the concrete types of the arguments we pass:

```
x = 3 :> 4 :> 5 :> Nil :: Vec 3 (Unsigned 8)
y = 6 :> 7 :> 8 :> Nil :: Vec 3 (Unsigned 8)
f x y -- Here, `n=3` is inferred
```

However, sometimes it's useful to explicitly define what we want a type variable to be. We can use the `@` symbol to apply a Haskell `type` to a `type variable`.

Example:
```
x = 3 :> 4 :> 5 :> Nil :: Vec 3 (Unsigned 8)
y = 6 :> 7 :> 8 :> Nil :: Vec 3 (Unsigned 8)
f @3 x y -- Here, `n=3` is explicitly stated

f @3 @(Unsigned 8) x y -- We can even explicitly set multiple types

f @_ @(Unsigned 8) x y -- We have to declare types in order. If we wish to skip over a type, we use _
```

## When would we use type application?
The most common situation is we want to declare and use a type (usually a number) to define our circuit but we don't pass it in the type signature.

Here's a complex example that we can define a circuit that divides the work in `m` stages, where `m` is allowed to be configured by different applications.

```
multiLevelFold
  :: forall m n a.
  (KnownNat m, 2 <= m)
  => (a -> a -> a)
  -> Vec m a
  -> a
multiLevelFold _ (elem :> Nil) = elem


multiLevelFold f =
multiLevelFold
  :: forall m n a.
  (KnownNat m, 2 <= m)
  => (a -> a -> a)
  -> Vec (n + 1) a
  -> a
multiLevelFold f =
```
