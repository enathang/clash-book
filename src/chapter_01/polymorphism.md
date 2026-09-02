# Polymorphism

One of Haskell's guiding principles is: don't use a specific type when a generic type would do.

But what do we mean by that?

Consider this Clash code

```
isEven :: BitVector 4 -> Bool
isEven a = (mod a 2) == 0
```

Now this code works perfectly well. However, if we wanted to use it on a `BitVector 8`, we would either need to 1. change the type signature of the function or 2. `resize` the `BitVector 8` into a `BitVector 4` before passing it into the function.

Haskell allows (and encourages) functions to be polymorphic. This is probably one of the hardest mental barriers to writing good Haskell code.


Because `mod` and `==` are well-defined on `BitVector`s of any length, we can make `n` a `type variable`.
```
isEven :: BitVector n -> Bool
isEven a = (mod a 2) == 0
```

We can then use this function on any sized bitvector:

```
>>> isEven (4 :: BitVector 4)
True
>>> isEven (7 :: BitVector 8)
False
>>> isEven (333 :: BitVector 100000)
False
```

However, we can also use type variables more strongly. We can also do this

```
evenBits :: BitPack a => a -> Bool
evenits input = isEven (pack input)
```

Where `a` can be any type.

Haskell syntax is
`funcName :: Constraint1, ... => Type1 -> Type2 -> ... -> OutputType`

A good rule of thumb is:
It's hard to think generically, so it's okay to start out by writing a function with concrete data types. Often times, when you're writing a function, you have a specific use case in mind, so just use those types.
Then, once you've written your function, identify every function you use in your function, and check the requirements of those functions. Then use as generic a type as will allow those functions to type check.

For example, say I want to write a function that checks if my BitVector has more 1s or 0s.

I start with
```
myFunc :: BitVector 8 -> Bool
myFunc bv = (ones bv) > (zeroes bv)
```
Now that I've written my function, I check the types of `ones`, `zeroes`, and `<` (remember, it's a function too!):
```
>>> :t ones
BitVector n -> BitVector n
>>> :t zeroes
BitVector n -> BitVector n
>>> :t (>)
Ord a => a -> a -> Bool
```
Therefore, our function can become
```
myFunc :: Ord (BitVector n) => BitVector n -> BitVector n -> Bool
myFunc bv = (ones bv) > (zeroes bv)
```

But since the definition of `BitVector n` includes `Ord`, specifying `Ord` is redundant and we can simply the type signature to

```
myFunc :: BitVector n -> BitVector n -> Bool
myFunc bv = (ones bv) > (zeroes bv)
```

Here's another example, which takes in a generic type and output it's 3rd bit value

```
getThirdBit :: Signed 4 -> Bit
getThirdBit num = (pack num) !! 3
```

This certainly gets the job done. But nothing about `pack` or `!!` requires it to be a signed number.

```
getThirdBit :: BitPack a => a -> Bit
getThirdBit input = (pack input) !! 3
```

But this will not type-check, because `getThirdBit` allows types that are two bits or smaller. This may be what we want, but we have to be explicit in how we handle it.

We have two options: 1) have a sensible default value if the type is too small or 2) restrict the function to only be usable on types that are 3 bits wide or more. We show both

```
getThirdBitOrDefault :: BitPack a => a -> Bit -> Bit
getThirdBitOrDefault input default =
    if (bitsize input > 3)
        then (pack input) !! 3
        else default
```

```
getThirdBit :: BitPack a, BitSize a >= 3 => a -> Bit
getThirdBit input = (pack input) !! 3
```