# Crash course on Haskell syntax

This book uses Haskell syntax from the beginning. It attempts to start with only basic Haskell syntax, and introduce more advanced Haskell syntax throughout the chapters.

This section provides a basic overview of how to read Haskell syntax. The reader is not expected to memorize this section before moving on. This section is more of a cheat sheet for the reader to come back to and reference until they become familiar with Haskell syntax.

## Haskell variables

```
-- This is a comment
variable = 5

{-
 - This is a multi-line comment.
 -
 - Haskell typically uses camelCase for naming variables and functions.
 -}
otherVariable = 6
```

## Haskell types
Haskell types always begin with a capital letter.

Some common Haskell types are: `Int`, `Integer`, `Bool`, `Char`, `String`, `[]` (`List`), `()` (`Tuple`).

However, not everything that begins with a capital letter is a Haskell type. The best way to tell if something is a type is if it's part of a type annotation.

**Type annotations**

Haskell type signatures are annotated with `::`
```
variable = 5 :: Integer
```

It is more common to provide a separate type signature above the declaration
```
variable :: Integer
variable = 5
```

These type signatures can be included in expressions, with parentheses to reduce ambiguity
```
variable = (5 :: Integer) + (6 :: Integer)
```

Haskell is strongly typed, meaning it will throw compile-time errors if types do not match

```
-- This will not compile, since `5` is of type Integer and `True` is of type Bool
variable = (5 :: Integer) + True
```


## Haskell functions
Haskell functions can take any number of arguments, but only return one value.

They have the general structure
```
-- This is the type signature of the function, with
-- the function declaration below it
functionName :: Constraint1, ... => InputType1 -> InputType2 -> ... -> OutputType
functionName input1 input2 = outputExpression
```

Don't worry about `Constraint1` for now. We will cover them in a later chapter.

**Example**

Here, the function takes two `Integer`s and returns a `Bool`.
```
myFunction :: Integer -> Integer -> Bool
myFunction a b = a == b
```

Since it's often useful to be able to return multiple things from a function, a function can return a tuple. Since the tuple is only one "thing", Haskell is fine with it, but the tuple can contain multiple things inside it.
```
-- This function still returns one value, but the value
-- is composed of multiple inner values
divideAndMod :: Integer -> Integer -> (Integer, Integer)
divideAndMod a b = (a / b, a % b)
```

**Type variables**

Haskell also allows you to declare type annotations with `type variables`. These are lower case and usually one letter (`a`, `b`, `n`, etc.)

For example, here's a function pulled from Haskell's `List` library

`reverse :: [a] -> [a]`

This means the function can work over multiple types. We will cover them in a later chapter, but you will see them everywhere in Haskell code (especially the documentation) so we mention them here. 


## Function application
To call a function in Haskell with arguments, you typically write the function name first and then the parameters. This is similar to most other languages.
```
myFunction :: Integer -> Integer -> Bool
myFunction a b = a == b

result = myFunction 1 2 -- Notice the pattern <functionName> <arg1> <arg2> ...
```

There are a few Haskell functions which break this trend. These are called `infix` functions. You've already seen one: `==`. Others include `>`, `<`, `+`, and most of the other ones you would expect from other languages.

Of course, we can also nest expressions within other expressions

```
myFunction :: Integer -> Integer -> Bool
myFunction a b = a == b

result = myFunction (1 + 1) (myOtherFunction 3)
```

## Other Haskell details
If you need to set a variable but never use it, it's best practice to prefix with an `_`.

```
returnSecondArg :: Integer -> Integer -> Integer
returnSecondArg _a b = b    -- `_` would also work instead of `_a`
```

Functions that take in two parameters can be made infix by surrounding it with `\```
```
xor 3 3
x `xor` 3
```
This is a common practice in Haskell code.

## The REPL
Haskell comes with a REPL (Read-Evaluate-Print Loop) program. The REPL is quite useful as a quick feedback loop on the results of expressions (or if the expression even type checks in the first place).

This book will often present code snippets as they would appear in the REPL. This allows 1. the book to write correct Haskell in shorter programs and 2. the reader to evaluate the expressions and play around with them for learning purposes.

When code is in the REPL, it is preceded by `>>>`. If the expression returns anything, it is printed on the next line.

Repl example:
```
>>> 1 + 2
3
```

## Conclusion
We have only covered the basics of Haskell syntax. However I firmly believe that this basic syntax, plus a few more features we introduce in the next chapters, are the only syntax required to work with Clash.

If you look at Haskell code written by some Haskell users, it can seem like a series of arcane symbols. However, most of these symbols are shorthand for code we could otherwise write using the above syntax. These shorthands are optional and you should only use them if you want to.

Remember, you can (and should) return to this section as many times as you want. Let's go!