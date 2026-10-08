# Constraints

In the last section, we introduced type variables and how they can be used to make functions generic. However, we often want to limit _which_ types can be substituted into the type variables.

## Revisiting our example
We previously defined the function

```
isEven :: BitVector n -> Bool
isEven a = (mod a 2) == 0
```

However, is this the most generic we can make it? What about `Unsigned n` and `Signed n`?

Well, we could define the function more generically over any type `a`

```
isEven :: a -> Bool
isEven a = (mod a 2) == 0
```

This approach works for `Unsigned n` and `Signed n`. However, this would also allow one to substitute in `String` and `Vec 3 Bool` into `isEven`, which wouldn't make any sense.

Therefore, we want some way of limiting `a` to be certain types. But which types and how?

## Introducing typeclass constraints

Constraints limit what types we can substitute into our type variables and still have the code typecheck. Therefore, constraints are never needed in purely monomorphic functions.

Per our [Haskell syntax](../introduction/introduction_to_haskell.md) section, functions have the following type structure

```
-- This is the type signature of the function, with
-- the function declaration below it
functionName :: (Constraint1, ...) => InputType1 -> InputType2 -> ... -> OutputType
functionName input1 input2 = outputExpression
```

Haskell provides a few different types of constraints, but we will look at the most relevant one: a typeclass constraint.

A typeclass constraint requires the corresponding type being substituted for a type variable to implement a specific type class. For example, the following constraint requires any concrete type for `a` to implement the `Ord` typeclass:

`myFunc :: (Ord a) => a -> a`

Adding this constraint guarantees that any `a` implements all of the functions of `Ord`. We can therefore safely use any of `Ord`s functions, such as `>` and `<`, on `a` within `myFunc`. 

To generalize this concept, we refer back to a statement made in the previous section

> This may seem like a vacuous statement, but: functions are composed of one or more other functions. To see if this function is well-defined, you simply need to check that the type signatures of all internal functions are respected.

Applying this to our earlier example, the function `isEven` uses the `mod` and `==` functions. Haskell also uses `fromIntegral` on `0`, so that's required as well.

```
isEven :: (Eq a, Integral a, Num a) => a -> Bool
isEven a = (mod a 2) == 0
```

Congrats, `isEven` now works over any type that implements `mod`, `==`, and has a concept of `0`!

## Walking through another example

Let's walk through another example. Let's say we try to define a generic function that does an element-wise subtraction between two vectors. Our initial implementation might look something like:

```
subtractVectors :: Vec n a -> Vec m a -> Vec n a
subtractVectors vec1 vec2 = zipWith (-) vec1 vec2
```

If we try to compile this example, we will get a couple type errors. Why?

Let's look at the type signatures of the internal functions:
- `zipWith :: (a -> b -> c) -> Vec n a -> Vec n b -> Vec n c`
- `(-) :: a -> a -> a` (from `Num` typeclass)

We can now see a couple of reasons why our code won't type check:
1. In `subtractVectors`, vec1 is of length `n` and vec2 is of length `m`. However, `zipWith` requires both input vectors to be the same length `n`. Since nothing guarantees that `n` and `m` are the same type level number, the type signature of `zipWith` fails.
2. The `(-)` function is defined in the `Num` typeclass. Therefore, only types that implement the `Num` typeclass have a `(-)` function. Since both vec1 and vec2 hold elements of type `a`, but we don't guarantee `a` implements `Num`, we cannot guarantee that this operation is well defined.

To fix these errors, we can update the function type signature such that
1. the two vectors must have the same length
2. any `a` must implement the `Num` typeclass (and therefore define `(-)`)

Here's a fixed version of `subtractVectors` that does typecheck:

```
subtractVectors :: <!--hl-->Num a =><!--/hl--> Vec n a -> Vec <!--hl-->n<!--/hl--> a -> Vec n a
subtractVectors vec1 vec2 = fmap (-) vec1 vec2
```

Notice we didn't change the function behavior at all: we simple restricted the usage of the function to well-defined values.


## Getting used to generics and constraints

If all this talk of generics and constraints is confusing to you, take heart. We refer back to the previous section

> Haskell allows (and encourages) functions to be polymorphic. This is probably one of the biggest mental barriers to writing good Haskell code. Not because it's particularly difficult, but because we as engineers are used to reasoning about concrete things and not abstract things with properties.

Hidden in this section is a rather heady argument: the structure of computation is largely independent of the specific elements in the computation. As long as you can guarantee the elements uphold a few properties, a computation structure can be used over any number of elements.

This approach can sometimes lead to users thinking Haskell code looks _overly_ generic, to the point of losing touch with the grounding of reality. This is where we get typeclasses like `Functor` and `Applicative`, which seem so abstract to new users as to not actually mean anything at all. I suspect this is part of where Haskell's "ivory tower" reputation comes from.

We maintain that generics are useful and, at times, quite elegant. Of course, this process takes time to internalize. Luckily, generics are largely optional in Haskell. So we recommend taking it bit by bit (pun not intended).

```admonish info title="A good rule of thumb"
If it's hard to think generically, it's okay to start out by writing a function using concrete data types. Often times, when you're writing a function, you have a specific use case in mind, so just use those concrete types.

Then, once you've written your function, identify every function you use in your function, and check the requirements (constraints + types) of those functions. Then use as generic a type as will allow those functions to type check.
```

## One final example
We present one final example. Say we want to write a generic function that accepts an input and outputs its 3rd bit value

```
getThirdBit :: Signed 4 -> Bit
getThirdBit num = (pack num) !! 3
```

This certainly gets the job done. But nothing about `pack` or `!` requires it to be a signed number.

```
getThirdBit :: BitPack a => a -> Bit
getThirdBit input = (pack input) ! 3
```

But this will not type-check, because `getThirdBit` allows types that are two bits or smaller. This may be what we want, but we have to be explicit in how we handle it.

We have two options:
1) have a sensible default value if the type is too small or
2) restrict the function to only be usable on types that are 3 bits wide or more.

In practice, we would pick one or the other. However, for education's sake, we show both

Allow any size, set a default
```
getThirdBitOrDefault :: BitPack a => a -> Bit -> Bit
getThirdBitOrDefault input default =
    if (bitsize input > 3)
        then (pack input) ! 3
        else default
```

Only allow types that are 3 bits or larger, so no default needed
```
getThirdBit :: (BitPack a, 3 <= BitSize) => a -> Bit
getThirdBit input = (pack input) ! 3
```