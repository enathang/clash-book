# Unsigned, Signed, Bool

We often want to work with data not as raw bits but as numbers. This is true in hardware and software.

Luckily, we as a society have developed (and agreed-upon) abstractions to allow us to work with numbers and let the compiler handle translating them into bits. Clash provides a handful of popular options out of the box, and allows the user to define more if they wish. We will look at two of the most popular in this section: `Unsigned n` and `Signed n`.


## Unsigned
An `Unsigned n` is a representation of an unsigned number using `n` bits.

````admonish example title="Unsigned"
`data Unsigned (n :: Nat)`

Arbitrary-width unsigned integer represented by n bits.

Given n bits, an `Unsigned n` number has a range of: `[0 .. 2^n-1]`.

**Examples**
```
>>> 3 :: Unsigned 2
3
>>> 3 :: Unsigned 16
3
>>> 3 :: Unsigned 1
1
>>> -3 :: Unsigned 1
1
```

**Notable instances**
<details>
<summary><code>Resize Unsigned</code></summary>

+ <code>resize :: Unsigned a -> Unsigned b</code>
+ <code>extend :: Unsigned a -> Unsigned (b + a)</code>
+ <code>zeroExtend :: Unsigned a -> Unsigned (b + a)</code>
+ <code>signExtend :: Unsigned a -> Unsigned (b + a)</code>
+ <code>truncateB :: Unsigned (a + b) -> Unsigned a</code>
</details>
<details>
<summary><code>Bits (Unsigned n)</code></summary>

+ <code>(.&.) :: Unsigned n -> Unsigned n -> Unsigned n</code>
+ <code>(.|.) :: Unsigned n -> Unsigned n -> Unsigned n</code>
+ <code>xor :: Unsigned n -> Unsigned n -> Unsigned n</code>
+ <code>complement :: Unsigned n -> Unsigned n</code>
+ <code>shift :: Unsigned n -> Int -> Unsigned n</code>
+ <code>rotate :: Unsigned n -> Int -> Unsigned n</code>
+ <code>zeroBits :: Unsigned n</code>
+ <code>bit :: Int -> Unsigned n</code>
+ <code>setBit :: Unsigned n -> Int -> Unsigned n</code>
+ <code>clearBit :: Unsigned n -> Int -> Unsigned n</code>
+ <code>complementBit :: Unsigned n -> Int -> Unsigned n</code>
+ <code>testBit :: Unsigned n -> Int -> Bool</code>
+ <code>bitSizeMaybe :: Unsigned n -> Maybe Int</code>
+ <code>bitSize :: Unsigned n -> Int</code>
+ <code>isSigned :: Unsigned n -> Bool</code>
+ <code>shiftL :: Unsigned n -> Int -> Unsigned n</code>
+ <code>unsafeShiftL :: Unsigned n -> Int -> Unsigned n</code>
+ <code>shiftR :: Unsigned n -> Int -> Unsigned n</code>
+ <code>unsafeShiftR :: Unsigned n -> Int -> Unsigned n</code>
+ <code>rotateL :: Unsigned n -> Int -> Unsigned n</code>
+ <code>rotateR :: Unsigned n -> Int -> Unsigned n</code>
+ <code>popCount :: Unsigned n -> Int</code>
</details>
<details>
<summary><code>Num (Unsigned n)</code></summary>

+ <code>(+) :: Unsigned n -> Unsigned n -> Unsigned n</code>
+ <code>(-) :: Unsigned n -> Unsigned n -> Unsigned n</code>
+ <code>(*) :: Unsigned n -> Unsigned n -> Unsigned n</code>
+ <code>negate :: Unsigned n -> Unsigned n</code>
+ <code>abs :: Unsigned n -> Unsigned n</code>
+ <code>signum :: Unsigned n -> Unsigned n</code>
+ <code>fromInteger :: Integer -> Unsigned n</code>
</details>
<details>
<summary><code>Integral (Unsigned n)</code></summary>

+ <code>quot :: Unsigned n -> Unsigned n -> Unsigned n</code>
+ <code>rem :: Unsigned n -> Unsigned n -> Unsigned n</code>
+ <code>div :: Unsigned n -> Unsigned n -> Unsigned n</code>
+ <code>mod :: Unsigned n -> Unsigned n -> Unsigned n</code>
+ <code>quotRem :: Unsigned n -> Unsigned n -> (Unsigned n, Unsigned n)</code>
+ <code>divMod :: Unsigned n -> Unsigned n -> (Unsigned n, Unsigned n)</code>
+ <code>toInteger :: Unsigned n -> Integer</code>
</details>
<details>
<summary><code>BitPack (Unsigned n)</code></summary>

+ <code>pack :: Unsigned n -> BitVector n</code>
+ <code>unpack :: BitVector n -> Unsigned n</code>
+ <code>maybeUnpack :: BitVector n -> Maybe (Unsigned n)</code>
</details>
<details>
<summary><code>Eq (Unsigned n)</code></summary>

+ <code>(==) :: Unsigned n -> Unsigned n -> Bool</code>
+ <code>(/=) :: Unsigned n -> Unsigned n -> Bool</code>
</details>
<details>
<summary><code>Ord (Unsigned n)</code></summary>

+ <code>compare :: Unsigned n -> Unsigned n -> Ordering</code>
+ <code>(&lt;) :: Unsigned n -> Unsigned n -> Bool</code>
+ <code>(&lt;=) :: Unsigned n -> Unsigned n -> Bool</code>
+ <code>(&gt;) :: Unsigned n -> Unsigned n -> Bool</code>
+ <code>(&gt;=) :: Unsigned n -> Unsigned n -> Bool</code>
+ <code>max :: Unsigned n -> Unsigned n -> Unsigned n</code>
+ <code>min :: Unsigned n -> Unsigned n -> Unsigned n</code>
</details>
````
As you can see in the last two examples above, overflows and underflows are allowed. If you don't want to allow overflows and underflows, you can use the `abc` type, which we will cover in a later chapter.

We can also perform math on `Unsigned` exactly as we would expect
```
>>> (3 :: Unsigned 8) + (4 :: Unsigned 8)
7
>>> let f a b = (div (a + b) 2) :: Unsigned 4 -> Unsigned 4 -> Unsigned 4
>>> f (3 :: Unsigned 4) (5 :: Unsigned 4)
4
```

We may want to convert between `Unsigned n` of different sizes. We can use the `resize` function of the `Resize` class for this

```
>>> let y = 3 :: Unsigned 4
3
>>> (resize y) :: Unsigned 4
3
```

We may also want to convert between `Unsigned n` and `BitVector n`. To do this, we introduce and use a new typeclass called `BitPack`, which exposes a `pack` and `unpack` function

```
>>> 3 :: Unsigned 4
3
>>> pack (3 :: Unsigned 4)
0b0011

>>> 5 :: BitVector 4
0b0101
>>> unpack (5 :: BitVector 4) :: Unsigned 4
5
```

More examples:

```
clashi> let x = minBound :: Unsigned 8   -- From Bounded
clashi> x
0
clashi> let y = maxBound :: Unsigned 8
clashi> y
255

clashi> pack y                           -- From BitPack
0b1111_1111
clashi> x == y+1                         -- From Eq(==), Num(+)
True

clashi> let z = resize x :: Unsigned 16  -- From Resize
clashi> z
255
clashi> pack z
0b0000_0000_1111_1111
```

## Signed

Clash also supports signed numbers using two's-complement.

````admonish example title="Signed"
`data Signed (n :: Nat)`

Arbitrary-width signed integer represented by `n` bits, including the sign bit.

Uses standard 2-complements representation. Meaning that, given n bits, a `Signed n` number has a range of: `[-(2^(n-1)) .. 2^(n-1)-1]` for `n > 0`. When `n = 0`, both the min and max bound are `0`.

**Examples**
```
>>> 3 :: Signed 8
3
>>> -3 :: Signed 8
-3
>>> 3 :: Signed 16
3
>>> -3 :: Signed 2
1
```

**Notable instances**

<details>
<summary><code>Resize Signed</code></summary>

+ <code>resize :: Signed a -> Signed b</code>
+ <code>extend :: Signed a -> Signed (b + a)</code>
+ <code>zeroExtend :: Signed a -> Signed (b + a)</code>
+ <code>signExtend :: Signed a -> Signed (b + a)</code>
+ <code>truncateB :: Signed (a + b) -> Signed a</code>
</details>
<details>
<summary><code>Bits (Signed n)</code></summary>

+ <code>(.&.) :: Signed n -> Signed n -> Signed n</code>
+ <code>(.|.) :: Signed n -> Signed n -> Signed n</code>
+ <code>xor :: Signed n -> Signed n -> Signed n</code>
+ <code>complement :: Signed n -> Signed n</code>
+ <code>shift :: Signed n -> Int -> Signed n</code>
+ <code>rotate :: Signed n -> Int -> Signed n</code>
+ <code>zeroBits :: Signed n</code>
+ <code>bit :: Int -> Signed n</code>
+ <code>setBit :: Signed n -> Int -> Signed n</code>
+ <code>clearBit :: Signed n -> Int -> Signed n</code>
+ <code>complementBit :: Signed n -> Int -> Signed n</code>
+ <code>testBit :: Signed n -> Int -> Bool</code>
+ <code>bitSizeMaybe :: Signed n -> Maybe Int</code>
+ <code>bitSize :: Signed n -> Int</code>
+ <code>isSigned :: Signed n -> Bool</code>
+ <code>shiftL :: Signed n -> Int -> Signed n</code>
+ <code>unsafeShiftL :: Signed n -> Int -> Signed n</code>
+ <code>shiftR :: Signed n -> Int -> Signed n</code>
+ <code>unsafeShiftR :: Signed n -> Int -> Signed n</code>
+ <code>rotateL :: Signed n -> Int -> Signed n</code>
+ <code>rotateR :: Signed n -> Int -> Signed n</code>
+ <code>popCount :: Signed n -> Int</code>
</details>
<details>
<summary><code>Num (Signed n)</code></summary>

+ <code>(+) :: Signed n -> Signed n -> Signed n</code>
+ <code>(-) :: Signed n -> Signed n -> Signed n</code>
+ <code>(*) :: Signed n -> Signed n -> Signed n</code>
+ <code>negate :: Signed n -> Signed n</code>
+ <code>abs :: Signed n -> Signed n</code>
+ <code>signum :: Signed n -> Signed n</code>
+ <code>fromInteger :: Integer -> Signed n</code>
</details>
<details>
<summary><code>Integral (Signed n)</code></summary>

+ <code>quot :: Signed n -> Signed n -> Signed n</code>
+ <code>rem :: Signed n -> Signed n -> Signed n</code>
+ <code>div :: Signed n -> Signed n -> Signed n</code>
+ <code>mod :: Signed n -> Signed n -> Signed n</code>
+ <code>quotRem :: Signed n -> Signed n -> (Signed n, Signed n)</code>
+ <code>divMod :: Signed n -> Signed n -> (Signed n, Signed n)</code>
+ <code>toInteger :: Signed n -> Integer</code>
</details>
<details>
<summary><code>BitPack (Signed n)</code></summary>

+ <code>pack :: Signed n -> BitVector n</code>
+ <code>unpack :: BitVector n -> Signed n</code>
+ <code>maybeUnpack :: BitVector n -> Maybe (Signed n)</code>
</details>
<details>
<summary><code>Eq (Signed n)</code></summary>

+ <code>(==) :: Signed n -> Signed n -> Bool</code>
+ <code>(/=) :: Signed n -> Signed n -> Bool</code>
</details>
<details>
<summary><code>Ord (Signed n)</code></summary>

+ <code>compare :: Signed n -> Signed n -> Ordering</code>
+ <code>(&lt;) :: Signed n -> Signed n -> Bool</code>
+ <code>(&lt;=) :: Signed n -> Signed n -> Bool</code>
+ <code>(&gt;) :: Signed n -> Signed n -> Bool</code>
+ <code>(&gt;=) :: Signed n -> Signed n -> Bool</code>
+ <code>max :: Signed n -> Signed n -> Signed n</code>
+ <code>min :: Signed n -> Signed n -> Signed n</code>
</details>
````

```
clashi> let x = 3 :: Signed 8
clashi> pack x
0b0000_0011
clashi> let x = -3 :: Signed 8
clashi> pack x
0b1111_1101
>>> resize x :: Signed 16
```


## Bool
While booleans are not numbers, they are core-enough to the language that I wanted to mention them somewhere.

````admonish example title="Bool"
`data Bool = False | True`

A boolean.

**Examples**
```
>>> False
False
>>> True
True
>>> True .&. False
False
```

**Notable instances**

<details>
<summary><code>Bits Bool</code></summary>

+ <code>(.&.) :: Bool -> Bool -> Bool</code>
+ <code>(.|.) :: Bool -> Bool -> Bool</code>
+ <code>xor :: Bool -> Bool -> Bool</code>
+ <code>complement :: Bool -> Bool</code>
+ <code>shift :: Bool -> Int -> Bool</code>
+ <code>rotate :: Bool -> Int -> Bool</code>
+ <code>zeroBits :: Bool</code>
+ <code>bit :: Int -> Bool</code>
+ <code>setBit :: Bool -> Int -> Bool</code>
+ <code>clearBit :: Bool -> Int -> Bool</code>
+ <code>complementBit :: Bool -> Int -> Bool</code>
+ <code>testBit :: Bool -> Int -> Bool</code>
+ <code>bitSizeMaybe :: Bool -> Maybe Int</code>
+ <code>bitSize :: Bool -> Int</code>
+ <code>isSigned :: Bool -> Bool</code>
+ <code>shiftL :: Bool -> Int -> Bool</code>
+ <code>unsafeShiftL :: Bool -> Int -> Bool</code>
+ <code>shiftR :: Bool -> Int -> Bool</code>
+ <code>unsafeShiftR :: Bool -> Int -> Bool</code>
+ <code>rotateL :: Bool -> Int -> Bool</code>
+ <code>rotateR :: Bool -> Int -> Bool</code>
+ <code>popCount :: Bool -> Int</code>
</details>
<details>
<summary><code>BitPack Bool</code></summary>

+ <code>pack :: Bool -> BitVector 1</code>
+ <code>unpack :: BitVector 1 -> Bool</code>
+ <code>maybeUnpack :: BitVector 1 -> Maybe Bool</code>
</details>
<details>
<summary><code>Eq Bool</code></summary>

+ <code>(==) :: Bool -> Bool -> Bool</code>
+ <code>(/=) :: Bool -> Bool -> Bool</code>
</details>
<details>
<summary><code>Ord Bool</code></summary>

+ <code>compare :: Bool -> Bool -> Ordering</code>
+ <code>(&lt;) :: Bool -> Bool -> Bool</code>
+ <code>(&lt;=) :: Bool -> Bool -> Bool</code>
+ <code>(&gt;) :: Bool -> Bool -> Bool</code>
+ <code>(&gt;=) :: Bool -> Bool -> Bool</code>
+ <code>max :: Bool -> Bool -> Bool</code>
+ <code>min :: Bool -> Bool -> Bool</code>
</details>
````