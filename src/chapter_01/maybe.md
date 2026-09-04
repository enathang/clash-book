# Maybe
We have so far looked at data types that are numbers. However, we can also define richer data types and Clash can still synthesize them into hardware.

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
