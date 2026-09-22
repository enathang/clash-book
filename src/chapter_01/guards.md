# Guards

So far we have only seen `if ... then ... else` clauses. However, we may want to branch off a value with multiple branches. Haskell does **not** have an `else if` or `elif` that you commonly see in other languages. That means we have to do this

```
if n == 1
  then ...
  else if n == 2
    then ...
    else if n == 3
      then ...
      else ...
```

Luckily for our sanity, Haskell provides a slightly different way for us to write the same logic: guards.

**Example**

Here's the same logic above rewritten as a guard statement

```
input
  | input == 0 = ...
  | input == 1 = ...
  | otherwise = ...
```

Note, similar to pattern matching, guards are simply a nicer way of writing the same logic. We can express the exact same logic with a chain of `if ... then ... else ...`. Guards simply make the code easier to write and read.