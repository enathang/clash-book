# Custom data types and and BitPack

Haskell's rich type system encourages us to define our own types as well. As we will see, as long as our types are a known size at compile time, Clash can synthesize them into hardware.

## What is the `BitPack` class?

BitPack is a Haskell typeclass. It defines the conversion between a Haskell type and the output hardware layout.

````admonish example title="BitPack class"
```
class KnownNat (BitSize a) => BitPack a where
```

Convert data to/from a BitVector. This allows functions to be defined on the underlying representation of data, while exposing a nicer API using pack / unpack at the boundaries

**Associated functions**

* `pack :: a -> BitVector (BitSize a)`
* `unpack :: BitVector (BitSize a) -> a`

**Associated types**

* `BitSize`

````

This function says: given an `a`, output its representation in bits (or in HDL, wires).
Example:
```
>>> pack (Just True)
0b11
```

This function says: given a representation in bits of the same size as a, turn it into a.

## How BitPack is derived for data types

```
data MyType
  = A (BitVector 32)
  | B (BitVector 16)
  | C (BitVector 16) (BitVector 8)
 deriving (Generic, BitPack)
```

The equation Clash uses to derive BitPack is as follows:

`clog2 (constructor_count) + max_field_size`

Which in this case is `log2(3) + max(32, 16, 16+8) = 2 + 32 = 34`

which can be considered

Example:
```
>>> pack (Just (3 :: BitVector 8))
0b100000011
```

## Revisiting `Just`
Now that we know how Clash generates `BitPack` instances, we can review `Maybe a` and see how Clash automatically encodes this information.

And now, a _quiz_:

{{#quiz ./quizzes/bitpack.toml}}

