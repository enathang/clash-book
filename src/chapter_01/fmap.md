# Fmap

We have seen data types that contain other data types. An example is `Maybe`

```
>>> Just 3 :: Maybe (Unsigned 8)
>>> Nothing :: Maybe (Unsigned 8)
```

We may want to apply a function `myFunc` to the `3` of `Just 3`. However, how do we do this when it can sometimes be `Nothing`. How does that work?

Without going into too much detail, we can use `fmap`.

```
>>> let x = Just 3 :: Maybe (Unsigned 8)
>>> fmap (+1) x
Just 4
>>> let y = Nothing :: Maybe (Unsigned 8)
>>> fmap (+1) y
Nothing
```

Okay, but uh, what is `fmap`? `fmap` is a function over a data type that can optionally apply a function on data within that data type. Which, as far as I'm concerned, is basically just an opinionated map.

`fmap` has a universal type signature, but it does not have a universal implementation. Each `fmap` implementation is specific to the data type that implements it. When in doubt, it's useful to look at the implementation of `fmap` for the data type in question.

````admonish example title="Functor Maybe"

```
fmap :: (a -> b) -> Maybe a -> Maybe b 
```

````

In fact, we can even look at the Haskell source code to see how they implement `fmap` for `Maybe a`

```
-- | @since base-2.01
instance  Functor Maybe  where
    fmap _ Nothing       = Nothing
    fmap f (Just a)      = Just (f a)
```