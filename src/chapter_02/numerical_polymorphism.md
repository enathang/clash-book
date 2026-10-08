# Numerical polymorphism

In the last section, we explored type variables and specifying typeclass constraints. In this section, we will explore another type of constraint: numeric constraints.


## Numerical constraints
Haskell provides the ability to specify numbers on the type level. These are typically used in Clash code to specify the size of various types, such as `Vec n a`, `BitVector n`, `Unsigned n`, etc. We can also add constraints for which type-level numbers are valid.

Haskell comes with three built-in constraints specifically for type-level numbers:

- `(n < m)`, which means the type-level `n` must be less than `m`
- `(n <= m)`, which means the type-level `n` must be less than or equal to `m`
- `(n ~ m)`, which means `n` and `m` must be the same type (and therefore the same type-level number)

_(Note: `n` and `m` are typically used to represent type-level numbers, but there's nothing stopping you from naming them something else.)_

These type level numbers, because they are types, can be type variables, concrete types, or a mix of the two. For example, we can look at our function from the previous section. The function uses both `3` and the type variable `BitSize a`.

```
getThirdBit :: (BitPack a, 3 <= BitSize a) => a -> Bit
getThirdBit input = (pack input) ! 3
```

We can also express multiple constraints on one type-level number. Say we wanted to restrict our function to only accept inputs that were `3` or more bits wide but less than `16`. We would do that as follows

```
getThirdBit :: (BitPack a, 3 <= BitSize a, BitSize a < 16) => a -> Bit
getThirdBit input = (pack input) ! 3
```

If we instead wanted to restrict our function to only accept inputs that were _exactly_ `3` bits wide, we could instead do

```
getThirdBit :: (BitPack a, 3 ~ BitSize a) => a -> Bit
getThirdBit input = (pack input) ! 3
```

One thing to keep in mind: the constraints `(n < m)` and `(n <= m)` are valid constraints but the code `(n > m)` and `(n >= m)` are amusingly NOT valid constraints. Haskell reserves the symbols `>` and `>=` for other purposes. It's just a quirk of Haskell syntax, nothing more.

## Type level math
On their own, numerical constraints are only somewhat useful. They can specify basic relationships between numbers. However, Haskell also supports a number of type-level math operations, which alongside our constraints allow us to specify a much richer set of relationships between the type-level numbers.

These are the type-level math operations supported out of the box by Haskell:
- `n + m`: Addition
- `n * m`: Multiplication
- `n ^ m`: Exponentiation
- `n - m`: Subtraction
- `Div n m`: Division
- `Mod n m`: Modulus
- `Log2 n`: Log

In addition, Clash uses Haskell's type-checker plugins to add a few additional type-level math functions:
- `CLog n m`: Ceiling log
- `DivRU n m`: Division (rounding up)
- `GCD n m`: Greatest common divisor
- `LCM n m`: Least common multiple

Before we explain when to use these functions, let's unpack what we mean when we say "Clash expands Haskell's type checker".

## Expanding the constraint solver with type plugins
Haskell's constraint solver is part of its type checker. This makes sense, since the constraint solver needs to run whenever we try and figure out if a type can be substituted in for another type.

Haskell in many ways is a theoretically-driven language. However, here it chooses to make a practical tradeoff. The time the type checker takes to run is proportional to how many rules are in the constraint solver. More ways of potentially resolving constraints == longer run time. Since the vast majority of Haskell code uses Class resolution but **not** complex math on the type level, the math resolution in the Haskell constraint solver is underpowered.

Put another way, **there are constraints that can be expressed, which are true, but the typechecker cannot natively solve them** (either because it doesn't have the mathematical rule built-in or because it stops after a certain depth of constraint solving.)

For a concrete example, Haskell does not recognize `(1 + n)` and `(n + 1)` as being the same type.

This is a perfectly agreeable tradeoff for most Haskell users: giving up something they didn't use for faster type checking. Turns out, it's very useful to be able to do this type level math for Clash.

Luckily, Haskell allows plugins to the type checker, which extend its capabilities. In fact, Clash provides _three_ out of the box.

* ghc-typelits-natnormalise
* ghc-typelits-knownnat
* ghc-typelits-extra

But even these three plugins don't support the full spectrum of type level math. It might be your calling to write the next one!

## The usefulness of type-level math
Like polymorphism in Haskell, type-level math is not required to write Haskell/Clash. But there certainly are places it comes in handy. We present two below:

**Case 1:** To ensure polymorphic functions typecheck

Clash provides a set of functions for working with `Vec`s. One of which is `head`:

`head :: Vec (n + 1) a -> a`

The type signature of the function guarantees the input to `head` is a `Vec` of at least size `1`. That way, one cannot call `head` on a empty `Vec`. But how do we guarantee that we only pass a `Vec` of size `1` or more to it?

Well, there are only two ways of passing a `Vec` into `head`:
1. we pass in a literal Vec
2. we accept the vector as a variable input

If we pass in a literal Vec, it's easy for Haskell to check the size of the vector. If we accept the vector as a variable input, how do we ensure the variable input is always size `1` or more? Well, we just do the same thing recursively: we specify the vector input must be at least size `1`.

**Case 2:** To ensure _only_ resource-efficient representations are able to be instantiated

This case is different to the previous case. In the previous case, we wanted to restrict polymorphic inputs to only inputs that were well-defined on our function. In this case, we are intentionally restricting our polymorphic inputs to a _subset_ of well-defined inputs that also create resource-efficient representations in hardware. This allows us to prevent users of our functions from accidentally shooting themselves in the foot.

For example, division by a power of `2` in hardware is much smaller than division by any other number.