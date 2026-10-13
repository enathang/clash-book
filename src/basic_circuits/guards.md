# Guards

So far, we have only seen `if ... then ... else` clauses. However, we may want to branch off a value with multiple branches. Haskell does **not** have an `else if` or `elif` that you commonly see in other languages. That means we have to do this

```
if n == 0
  then ...
  else if n == 1
    then ...
    else if n == 2
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
  | input == 2 = ...
  | otherwise = ...    -- `otherwise` is a catch-all statement, similar to _ for pattern matching
```

Note, similar to pattern matching, guards are simply a nicer way of writing the same logic. We can express the exact same logic with a chain of `if ... then ... else ...`. Guards simply make the code easier to write and read.

**Where we can use guards**

We can use guard statements in both variables and functions.

In a function
```
myFunc :: Signed 16 -> String
myFunc n
  | n == 0 = "n is zero"
  | n % 2 == 0 = "n is even"
  | otherwise = "n is odd"
```

In a variable
```
myFunc :: Signed 16 -> String
myFunc n = outputString
 where
  outputString
    | n == 0 = "n is zero"
    | n % 2 == 0 = "n is even"
    | otherwise = "n is odd"
```

**Advanced guards**

Haskell has a few additional syntactic niceties we can use with guard statements.

We can naturally use `&&` to AND any two boolean values. In guard statements, we can also use a comma.

```
fizzbuzz :: Integer -> String
fizzbuzz n
  | n % 3 == 0, n % 5 == 0 = "fizzbuzz"
  | n % 3 == 0 = "fizz"
  | n % 5 == 0 = "buzz"
  | otherwise = show n
```

If we want to go crazy, we can even do pattern matching _inside_ a guard statement using `<-`

```
describeMaybeN :: Maybe (Unsigned 8) -> String
describeMaybeN maybeN
  | Just n <- maybeN, n % 2 == 0 = "N is even"
  | Just n <- maybeN = "N is odd"
  | otherwise = "N is Nothing"
```

Since guard statements and pattern matching can sometimes both be used to implement the same logic, it's up to personal preference which approach is better.

However, an important distinction is that pattern matching can only operate on the structure of values, while guards can directly apply conditionals to the values themselves.

````admonish exercise title="Exercise: Guarding the warehouse" collapsible=true
You are a security chief of a mid-level warehouse. Recently, you've heard reports of a serial intruder using...unorthodox methods of entry. It seems this intruder is hiding themselves in cardboard boxes to sneak past security guards. You decide to re-train your guards to check for this new method of stealth.

Your boxes look like this:
```
-- A box contains the booleans isOpen, weight (kg), declaredValue, trackingNumber
data Box = Box Bool (Unsigned 8) (Unsigned 8) (Unsigned 64)
```

Specifically, you decide the following security measures are appropriate (in order of priority):
1. If the box's tracking number ends in a `7`, check it. `7` is your lucky number, after all.
1. If the box is already open, let it through.
2. If the box's declared value is over 100, let it through. You don't want to mess with the boss's merchandise.
2. If the box is closed and weighs more than 30kg (~66lbs), check it
3. Otherwise, let it through.

Rewrite your old function using these new rules
```
allowThrough :: Box -> Bool
allowThrough box = True   -- Todo: Rewrite me!
```
````