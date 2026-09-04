# Common pitfall: Not adding enough type annotations to your code (at least when starting)

The Haskell type checker is pretty good at inferring types. However, when there is a mismatch of types in your code, the type checker can report it in a part of your code you weren't expecting.

The following three statements are all true:
* Haskell is a strongly-typed language, meaning every function has a type and must be checked at compile time. If two types do not line up, the compiler will throw an error and not finish compiling.
* Haskell has type inference. This means that if the compiler can deduce, through a set of logic rules, what type a thing should be, it can anotate that type for you so you don't need to explicitly annotate it yourself.
* The order of type inference rules in Haskell can seem somewhat arbitrary. Meaning, if you have two explicitly typed variables that go through a few functions with implicit typing, the compiler may solve this type chain in any way it wishes until it can go no further, and then throw an error. This means, in practice, you can get a type error in a place you weren't expecting and go "wait, why does the compiler think this is type `x` when it should be of type `y`?