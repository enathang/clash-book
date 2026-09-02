# Maybe, Tuple

## Maybe a

In Clash, `Maybe a` is often used to represent data that may or may not be present. In hardware, `Maybe a` is represented by `1` bit that can be considered a "valid" or "tag" bit.

````admonish example
`data Maybe a`

The Maybe type encapsulates an optional value. A value of type `Maybe a` either contains a value of type `a` (represented as `Just a`), or it is empty (represented as `Nothing`). Using Maybe is a good way to deal with errors or exceptional cases without resorting to drastic measures such as error.

**Constructors**

* `Nothing`	 
* `Just a`
````

`Maybe` is an example of a parametric type. A parametric type takes in another type as part of its type signature. So these are all unique types:
```
Maybe Bool         -- Values are: Nothing, Just False, Just True
Maybe (Unsigned 8) -- Values are: Nothing, Just 0, Just 1, ..., Just 255
```

```
clashi> pack (Just True)
0b11
clashi> pack (Just (3 :: BitVector 8))
0b1_0000_0011
clashi> pack (Nothing :: Maybe Bool)
0b0.
clashi> pack (Nothing :: Maybe (BitVector 8))
0b0_...._....
```

When this valid bit is `0`, Clash makes no guarantee what the other bits are. This is represented by `undefined` internally, or a `.` in the output.

`Maybe` is often used in Clash as part of sequential logic, to indicate a value may be present on some cycles but not others. But we will cover sequential logic in a later chapter.

## Tuples
Tuples are one of the standard Haskell workhorses. Unlike most other types in Haskell, tuples are embedded into the Haskell language itself.

````admonish example
```
(a, b)
(a, b, c)
(a, b, c, d)
(a, b, c, d, ...)
```

**Examples**
```
>>> let x = (True, False)
>>> let y = (True, 0 :: Unsigned 8)
>>> let z = (3 :: Unsigned 4, (4 :: Signed 4, True))
```
````


Often times, it's useful to group values together. Since Haskell only allows one return type for a function, tuples are often used when we want to return multiple values from a function.

Example from `Integral` class:
```
quotRem :: Bit -> Bit -> (Bit, Bit) 
```

Tuples are also quite useful because the internal values can be of different types to each other.

Example from `Counter` class:
```
countSuccOverflow :: Bit -> (Bool, Bit) 
```

Tuples can be synthesized in Clash and have no footprint overhead.