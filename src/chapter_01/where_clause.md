# Where clause

Most of the Haskell expressions we have seen fit on a single line. In fact, _any_ Haskell expression can be written on one line.

That does not mean it's convenient or ergonomic to do so. Often, we want to declare intermediary variables and sub-expressions for our computation. These sub-expressions make the code easier to read, refactor, and annotate with types.

Haskell has the `where` clause, which fufills this exact purpose. The best way to understand the `where` clause is to see it in action.

```
myFunc :: Bit -> Bit -> Bool
myFunc a b c = e
 where
  d = a .|. b
  e = c .&. d
```

Note in the above example, these variables are all locally scoped to the `where` clause. This means they cannot be accessed outside of the function.

We can even define functions and other `where` clauses inside a `where` clause

```
myFunc :: Bit -> Bit -> Bool
myFunc a b c = e
 where
  d = a .|. b .|. e
   where
    e = c .&. d
```

If you find yourself writing multiple duplicate `where` clauses, it's probably worth factoring out into a separate function.

Where clauses also make it possible to do computations on the ouput of itself. This both becomes incredibly useful when we get to Chapter 3: Sequential logic, and also acts as an easy way to introduce combinational loops into your code by accident.