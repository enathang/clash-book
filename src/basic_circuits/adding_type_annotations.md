# Common pitfall: Not adding enough type annotations to your code (at least when starting out)

```admonish bug title="Not enough type annotations"
Pitfall symptoms:
- You're constantly fighting the Haskell type checker
- You keep going "wait, why does the compiler think this is type `x` when it should be of type `y`"?
```

The Haskell type checker is pretty good at inferring types. However, when there is a mismatch of types in your code, the type checker can report it in a part of your code you weren't expecting.

Here's an example:
```
clashi> :{
clashi| f :: Vec 4 (BitVector 4) -> Vec 4 (BitVector 4) -> Vec 8 (BitVector 4)
clashi| f vec1 vec2 = outputVec
clashi|  where
clashi|   extendedVec = vec1 ++ (singleton 1)   -- The actual bug is here
clashi|   combinedVec = extendedVec ++ vec2
clashi|   outputVec = map (+1) combinedVec.     -- The type mismatch occurs here
clashi| :}
<interactive>:15:24: error: [GHC-83865]
    • Couldn't match type ‘9’ with ‘8’
      Expected: Vec 8 (BitVector 4)
        Actual: Vec (5 + 4) (BitVector 4)
    • In the second argument of ‘map’, namely ‘combinedVec’
      In the expression: map (+ 1) combinedVec
      In an equation for ‘outputVec’: outputVec = map (+ 1) combinedVec
```
_(AN: I just came up with this example off the top of my head. It doesn't do a great job of demonstrating the issue. I'll find a better one later)._

**How to solve**

Thankfully, the solution is pretty easy. One can basically perform binary search on the un-annotated intermediary values until you find the issue.

```
clashi> :{
clashi| f :: Vec 4 (BitVector 4) -> Vec 4 (BitVector 4) -> Vec 8 (BitVector 4)
clashi| f vec1 vec2 = outputVec
clashi|  where
clashi|   extendedVec = vec1 ++ (singleton 1)
clashi|   combinedVec = extendedVec ++ vec2 :: Vec 8 (BitVector 4) -- With the type annotation, we reduce the chain of type inference we need to examine
clashi|   outputVec = map (+1) combinedVec
clashi| :}
```

**Why this happens**

The following three statements are all true:
* Haskell is a strongly-typed language, meaning every function has a type and must be checked at compile time. If two types do not line up, the compiler will throw an error and not finish compiling.
* Haskell has type inference. This means that if the compiler can deduce, through a set of logic rules, what type a thing should be, it can infer that type for you so you don't need to explicitly annotate it yourself.
* The order of type inference rules in Haskell can seem somewhat arbitrary. Meaning, if you have two explicitly typed variables that go through a few functions with implicit typing, the compiler may solve this type chain in any way it wishes until it can go no further, and then throw an error. This means, in practice, you can get a type error in a place you weren't expecting and go "wait, why does the compiler think this is type `x` when it should be of type `y`"?
