# Numerical polymorphism

In the last section, we explored type variables and specifying constraints. In this section, we will explore how to specify constraints between two or more type variables.


## Numerical constraints
However, Haskell also comes with a number of built-in constraints specifically for type-level numbers:

```
f :: a ~ b => a -> a

f :: a `Mod` b ~ 0 => a -> a
```

## Expanding the constraint solver with type plugins
Haskell's constraint solver is part of its type checker. This makes sense, since the constraint solver needs to run whenever we try and figure out if a type can be substituted in for another type.

Haskell in many ways is a theoretically-driven language. However, here it chooses to make a practical tradeoff. The time the type checker takes to run is proportional to how many rules are in the constraint solver. More ways of potentially resolving constraints == longer run time. Since the vast majority of Haskell code uses Class resolution but **not** complex math on the type level, the math resolution in the Haskell constraint solver is underpowered.

Put another way, **there are constraints that can be expressed, which are true, but the typechecker cannot natively solve them** (either because it doesn't have the mathematical rule built-in or because it stops after a certain depth of constraint solving.)

This is a perfectly agreeable tradeoff for most Haskell users: giving up something they didn't use for faster type checking. Turns out, it's very useful to be able to do this type level math for Clash.

Luckily, Haskell allows plugins to the type checker, which extend its capabilities. In fact, Clash provides _three_ out of the box.

* ghc-typelits-natnormalise
* ghc-typelits-knownnat
* ghc-typelits-extra

But even these three plugins don't support the full spectrum of type level math. It might be your calling to write the next one!

## Numerical constraints (with Clash's typechecker plugins)
