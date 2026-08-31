# Vec


Haskell programs often use Lists to represent ordered collections of elements. However, Lists are dynamically-sized and unknown size at compile time. They can even be infinite size in Haskell! Clash datatypes, since they're just Haskell data types, work perfectly fine with Lists.

```
>>> let x = {3, 4, 5} :: [BitVector 8]
```

However, we cannot **synthesize** them to hardware.

To solve this, Clash introduces `Vec n a`, which operates similarly to a list but always has a defined size.

````admonish example
data `Vec :: Nat -> Type -> Type` where

Fixed size vectors.

* Lists with their length encoded in their type
* Vector elements have an ASCENDING subscript starting from `0` and ending at `length - 1`.

Constructors

* `Nil :: Vec 0 a`
* `Cons :: a -> Vec n a -> Vec (n + 1) a`


**Examples:**
```
>>> let x = 3 :> 4 :> 5 :> Nil :: Vec 3 (BitVector 8)
>>> x
0b0000_0011 :> 0b0000_0100 :> 0b0000_0101 :> Nil
>>> x !! 0
0b0000_0011
clashi> x !! 3
*** Exception: Clash.Sized.Vector.(!!): index 3 is larger than maximum index 2
```
````

Since `Vec` is one of the most-used Clash types (the other being `BitVector`), we will provide extra examples for reference on their usage.
