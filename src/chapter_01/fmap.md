# Fmap

We have learned that we can use `map` to apply a function to the elements inside a `Vec`. However, there are other types besides vectors that contain elements. An example is `Maybe`

```
>>> Just 3 :: Maybe (Unsigned 8)
>>> Nothing :: Maybe (Unsigned 8)
```

We may want to apply a function `myFunc` to the `3` of `Just 3`. However, how do we do this when it can sometimes be `Nothing`. How does that work?

In this section, we introduce the `Functor` typeclass. Any data type that implements this class provides a method, `fmap`, which allows us to apply functions to (some) values inside the data type.

## The functor typeclass

````admonish example title="Functor typeclass"
```
class Functor (f :: Type -> Type) where
```

A type `f` is a Functor if it provides a function `fmap` which, given any types `a` and `b` lets you apply any function from `(a -> b)` to turn an `f a` into an `f b`, preserving the structure of `f`.

**Notable methods**

```
fmap :: (a -> b) -> f a -> f b 
```

**Notable instances**
- `Maybe a`

**Examples**
```
>>> fmap (+1) (Just 3)
Just 4
>>> fmap (+1) Nothing
Nothing
>>> fmap isEven (1, 2)
(1, True)
>>> fmap isOdd (1, 2)
(1, False)
```

````

Here are a couple notes to help you parse the above definition:
 - We often use `f` to denote a function. However, in the above definition, `f` (short for functor) is simply a type variable like `a` and `b`. 
 - Haskell doesn't require `a` and `b` to be the same type, but it also doesn't require `a` and `b` to be different types. So `fmap (+1)` typechecks because it goes `f num -> f num`, and `fmap isEven` also typechecks as it goes `f num -> f bool`.

**Example 1: Maybe**

To give a concrete example, we will rewrite the above definition in the context of `Maybe`:

**`Maybe`** is a Functor **because** it provides a function `fmap` which, given any types `a` and `b` lets you apply any function from `(a -> b)` to turn an **`Maybe a`** into an **`Maybe b`**, preserving the structure of **`Maybe`**.

In fact, we can even look at the Haskell source code to see how they implement `fmap` for `Maybe a`

```
-- | @since base-2.01
instance  Functor Maybe  where
    fmap _ Nothing       = Nothing
    fmap f (Just a)      = Just (f a)
```


`fmap` has a universal type signature, but it does not have a universal implementation. Each `fmap` implementation is specific to the data type that implements it. When in doubt, it's useful to look at the implementation of `fmap` for the data type in question.

**Example 2: Either**

Either is another classic Haskell type. Either takes in two type variables, `a` and `b`, and holds _either_ `a` or `b`.

```

```

**Example 3: Tuple**

Tuples also implements Functor. We can see that with a couple examples:

```
>>> fmap isEven (1, 2)
(1, True)
>>> fmap isOdd (1, 2)
(1, False)
```

Interestingly, it seems `fmap` only applies the function to the 2nd element in the tuple.

We can confirm our intuition by looking at the source code for the Fuctor instance for tuple:


```
-- | @since base-2.01
instance Functor ((,) a) where
    fmap f (x,y) = (x, f y)
```

## Why the name functor?

The name functor comes Category Theory, which is a branch of mathematics that has influenced Haskell.

Readers sometimes get hung up on what a functor _is_. It's one of those terms that is so abstract it seems to lose meaning. I would encourage you to simply think of a functor as _anything that implements a fmap function_.

This is a generally useful way of conceptualizing typeclasses in Haskell. An `Eq` is anything that implements the `(==)` function, an `Ord` is anything that implements the `>` function, etc. This way, typeclasses are not things but simply properties that a data type may or may not have.

## Where would I use fmap?
The short answer: pretty much everywhere.

But for a slightly longer answer, here's an example.

```
```