# Pattern matching

Pattern matching is a programming language construct that has gained popularity in the last decade or so. Basically, it allows you to
1. case match on the value you have and
2. easily access fields within those values (called _destructuring_).

Pattern matching comes in two main forms in Haskell:
1. Multiple function definitions

```
myFunc :: Bool -> Integer -> Integer
myFunc True n = -n
myFunc False n = n
```

2. a `case` statement

```
myFunc :: Bool -> Integer -> Integer
myFunc shouldNegate n =
    case y of
        True -> -n
        False -> n
```


Instead of
```
addPair :: (Integer, Integer) -> Integer
addPair pair = (fst pair) + (snd pair)
```
We can write
```
addPair :: (Integer, Integer) -> Integer
addPair (x, y) = x + y
```