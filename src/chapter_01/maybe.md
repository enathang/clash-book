# Maybe, Tuple

Clash also supports a number of Haskell built-in data types. In fact, Clash supports every Haskell data type that is 1. known-size at compile time 2. derives a BitPack instance. Here, we look at three common data types.


## Maybe a
````admonish example
`data Maybe a`

The Maybe type encapsulates an optional value. A value of type `Maybe a` either contains a value of type `a` (represented as `Just a`), or it is empty (represented as `Nothing`). Using Maybe is a good way to deal with errors or exceptional cases without resorting to drastic measures such as error.

**Constructors**

* `Nothing`	 
* `Just a`
````

In Clash, `Maybe a` is often used to represent data that may or may not be valid at a given cycle (we will get into cycles and sequential logic later). In hardware, `Maybe a` is represented by `1` bit that can be considered a "valid" or "tag" bit.

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

## Tuples
Tuples are one of the standard Haskell workhorses. Often times, it's useful to group values together. Since Haskell only allows one return type for a function, tuples are often used when we want to return multiple values from a function.

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