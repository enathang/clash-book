# Pattern matching

Pattern matching is a programming language feature that has gained popularity in the last decade or so. The most prominent language example is Rust. 

Pattern matching allows you to
1. case match on the value you have and
2. easily access fields within those values (called _destructuring_).

Notably, pattern matching does not make the language _more expressive_. Any code that would use a pattern match can also be written without one. Pattern matching is simply a convenience feature. But it turns out it's pretty convenient.

## Pattern matching to destructure values
Here's an example of code that is a prime candidate for pattern matching
```
-- Without pattern matching, we bind the input value and later access the inner values
addPair :: (Integer, Integer) -> Integer
addPair pair = (fst pair) + (snd pair)
```

In pattern matching, you can substitute the structure (called a pattern) of a variable for the variable itself.

```
-- With pattern matching, we immediately bind the input's inner values
addPair :: (Integer, Integer) -> Integer
addPair (x, y) = x + y
```

You can also destructure values within `where` clauses

```
addPair pair = sum
 where
  (x, y) = pair
  sum = x+y
```

If you don't care about some of the values during destructuring, you can use `_` or `_varName` to ignore it.
```
getSecond :: (Integer, Integer) -> Integer
getSecond (_, y) = y
```

## Pattern matching to select control path
Often times, we may want to write code that varies the execution path based on what the input is.

The secret sauce of pattern matching is that we can fix certain inner values of patterns to be
1) sub-patterns and/or
2) concrete values

This allows us to create multiple patterns, and let the compiler _match_ the value to the pattern.

Here's an example without pattern matching, where we return the value of the input if it's a `Just a`. Otherwise, we return a default value of `0`.

```
numberOrDefault :: Maybe Integer -> Integer
numberOrDefault input =
    case input of
        isJust input -> fromJust input
        isNothing input -> 0
```

We can rewrite the case statement using pattern matching. As a reminder, it doesn't make our language more powerful, it just saves some binding of extra variables.

```
numberOrDefault :: Maybe Integer -> Integer
numberOrDefault input =
    case input of
        Just value -> value
        Nothing -> 0
```

Of course, it's possible to either
1) specify patterns that overlap and/or
2) miss valid patterns

**Overlapping patterns**

In the case of overlapping patterns, the compiler will pick the first definition it matches.

For example
```
countTrue :: (Bool, Bool) -> Integer
countTrue input =
    case input of
        (True, _) -> 1
        (_, True) -> 1
        (True, True) -> 2 -- This pattern will never match because the (True, _) will always match first
        (_, _) -> 0
```

Luckily, Haskell will produce a warning if it detects a pattern match is unreachable.

We can fix it by reordering the patterns
```
countTrue :: (Bool, Bool) -> Integer
countTrue input =
    case input of
        (True, True) -> 2 -- Always tries to match first
        (True, _) -> 1
        (_, True) -> 1
        (_, _) -> 0
```

**Missing patterns**

In the case of missing patterns, the compiler will check and (helpfully) throw a compilation error.

In this example, we forgot the case where both inputs are `False`.
```
countTrue :: (Bool, Bool) -> Integer
countTrue input =
    case input of
        (True, True) -> 2
        (True, _) -> 1
        (_, True) -> 1
```

If we want a default case, we can use `_` which will match any pattern

```
numberOrDefault :: Maybe Integer -> Integer
numberOrDefault input =
    case input of
        Just value -> value
        _ -> 0
```


## Pattern matching to select function definition
Many times, if we have logic that depends on the input type to a function, we end up writing functions that have the rough structure
```
myFunc input1 input2 =
  case (input1, input2) of
    ...
```

This is perfectly fine and valid Haskell. However, because it's such a common pattern, Haskell provides a special alternative way of writing this logic.

You can define a function multiple times, and pattern match directly on the inputs.

We can rewrite both of our earlier examples this way

```
numberOrDefault :: Maybe Integer -> Integer
numberOrDefault (Just value) = value
numberOrDefault Nothing = 0
```
```
countTrue :: (Bool, Bool) -> Integer
countTrue (True, True) = 2
countTrue (True, _) = 1
countTrue (_, True) = 1
countTrue _ = 0
```

In fact, we already saw an example of this earlier when we looked at the implementation of `fmap` for `Maybe`

```
-- | @since base-2.01
instance  Functor Maybe  where
    fmap _ Nothing       = Nothing
    fmap f (Just a)      = Just (f a)
```

## Bonus: Can I bind a value and destructure it at the same time?

Yes, you can. Here's an example

```
numberOrDefault :: Maybe Integer -> Integer
numberOrDefault input@(Just value) = value
numberOrDefault input@Nothing = 0
```