# Function polymorphism

One of Haskell's guiding principles is: don't use a specific type when a generic type would do.

But what do we mean by that?

## Polymorphism by example

Consider this Clash code

```
isEven :: BitVector 4 -> Bool
isEven a = (mod a 2) == 0
```

Now this code works perfectly well. It typechecks, compiles, and synthesizes. However, if we wanted to use the function on a `BitVector 8`, we would need to either
1. change the type signature of the function or
2. `resize` the `BitVector 8` into a `BitVector 4` before passing it into the function.

However, there's an easier solution to this problem.

Haskell allows (and encourages) functions to be polymorphic. This is probably one of the biggest mental barriers to writing good Haskell code. Not because it's particularly difficult, but because we're used to reasoning about _concrete things_ and not _abstract things with properties_.

**Circling back to our example**

Haskell allows us to use `type variables` in our type signatures to abstractly represent types. You can recognize `type variables` because they always start with a lower case character.

In our above example, we can substitute in a generic `n` for the concrete type-level `4`.
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

**But is this well-defined for any `n`?**

If you're anything like me, the above statement sets off mild alarm bells in your head. Any `n`? How do we know if it's well behaved?

This may seem like a vacuous statement, but: functions are composed of one or more other functions. To see if this function is well-defined, you simply need to check that the constraints of all internal functions are respected.

Because `mod` and `==` are defined on `BitVector`s of any length, per their type signature, we should be good to go.

Luckily, we don't need to do this hand-checking every time. Haskell's type-checking verifies this all for us.

**Introducing constraints**

To see this in action, let's look at an example that doesn't type check

```
subtractVectors :: Vec n a -> Vec m a -> Vec n a
subtractVectors vec1 vec2 = fmap (-) vec1 vec2
```

This doesn't type check for a couple reasons:
1. Since vec1 is of length `n` and vec2 is of length `m`, and nothing in the type system that these are the same length, defining the pair-wise subtraction of them is not well-defined. What should happen if they're not the same length.
2. Since both vec1 and vec2 hold elements of type `a`, but we don't know if `a` has a well-defined `-` function, we cannot guarantee that this operation is well defined.

To fix this, we can define
1. the two vectors have the same length
2. Users can only use this function on types of `a` that have the operation `-` defined.

Here's a fixed version:

```
subtractVectors :: <!--hl-->Num a =><!--/hl--> Vec n a -> Vec <!--hl-->n<!--/hl--> a -> Vec n a
subtractVectors vec1 vec2 = fmap (-) vec1 vec2
```

Notice we didn't change the function behavior at all: we simple restricted the usage of the function to well-defined values.

However, we can also use type variables more strongly. We can also do this

```
evenBits :: BitPack a => a -> Bool
evenits input = isEven (pack input)
```

Where `a` can be any type.

Haskell syntax is
`funcName :: Constraint1, ... => Type1 -> Type2 -> ... -> OutputType`

```admonish info
A good rule of thumb is:

If it's hard to think generically, it's okay to start out by writing a function using concrete data types. Often times, when you're writing a function, you have a specific use case in mind, so just use those types.

Then, once you've written your function, identify every function you use in your function, and check the requirements (constraints + types) of those functions. Then use as generic a type as will allow those functions to type check.
```

**Example of turning a monomorphic function into a polymorphic function**

For example, say I want to write a function that checks if my BitVector has more 1s or 0s.

I start with
```
myFunc :: BitVector 8 -> Bool
myFunc bv = (ones bv) > (zeroes bv)
```
Now that I've written my function, I check the types of `ones`, `zeroes`, and `>` (remember, `>` is a function too):
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

**Another example**

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

We have two options:
1) have a sensible default value if the type is too small or
2) restrict the function to only be usable on types that are 3 bits wide or more.

In practice, we would pick one or the other. However, for education's sake, we show both

Allow any size, set a default
```
getThirdBitOrDefault :: BitPack a => a -> Bit -> Bit
getThirdBitOrDefault input default =
    if (bitsize input > 3)
        then (pack input) !! 3
        else default
```

Only allow types that are 3 bits or larger, so no default needed
```
getThirdBit :: BitPack a, BitSize a >= 3 => a -> Bit
getThirdBit input = (pack input) !! 3
```

## But doesn't Clash need to know the size of everything at compile time?

Here's a Clash rule of thumb:

The type of the `topEntity` need to be monomorphic, but the types of the functions that we define need not be.

How does that work?

The inputs of our topEntity need to be monomorphic:

And when we define a function application onto our function, it forces Clash to _monomorphize_ the function to a specific type.

This is how we get the best of both worlds: we can define circuits polymorphically, but when we instantiate them, we force Clash to figure out all the types and thereby know the size of every wire at compile time.

## Why do we care about making functions polymorphic?

There's nothing in Haskell (or Clash) that requires you to generalize your function types. Your code will still compile and work as intended.

However, there are a few reasons why generalizing your functions is a good idea:
1. It allows you to reuse the same logic on multiple types. For example, you may want to use the same logic multiple times in different parts of the circuit. Or, you write a circuit for one size, and then requirements change and it expects the number of wires to double.
2. As you get more used to Haskell, you'll start looking at the type signature of functions as a quick reference for what they do. Therefore, one generally encodes only things relevant to the function in the types. This makes it easier for others to understand your function.
3. It can make your function implementation cleaner, because it forces you to figure out what part you actually care about and what is just noise.
4. When you start using higher-order functions, or functions that take other functions, polymorphism becomes important in decoupling _the structure of computation_ from the _computation being done_.

Over time, you may find yourself naturally writing polymorphically (and even start thinking that way)!

Of course, our ability (and enjoyment) to write polymorphic functions depends heavily on how easy it is to define exactly what types we want our functions to accept and return. Luckily, Haskell has a pretty simple yet robust way for us to do this: `constraints`. We will cover this in the next section.