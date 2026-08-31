# Unsigned, Signed, Bool




## Unsigned
We often want to work with data not as raw bits but as unsigned numbers.

Unsigned numbers work similarly to `BitVector`s in Clash. This is because Clash allows `BitVector`s largely to be treated as unsigned numbers. However, there are reasons one might prefer `Unsigned` over `BitVector` (or vice-versa):
1. Unsigned has a semantic meaning to it. If you're counting or doing arithmetic, Unsigned should be preferred because it gives information on what the type is being used for. If it's just a collection of bits, use `BitVector`.
2. Some Clash functions only accept `Unsigned`, due to the reasoning of 1.

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

</details>
<details>
<summary><code>Bits (Unsigned n)</code></summary>

</details>
<details>
<summary><code>Num (Unsigned n)</code></summary>

</details>
<details>
<summary><code>Integral (Unsigned n)</code></summary>

</details>
<details>
<summary><code>BitPack (Unsigned n)</code></summary>

</details>
<details>
<summary><code>Eq (Unsigned n)</code></summary>

</details>
<details>
<summary><code>Ord (Unsigned n)</code></summary>

</details>
````

We can explore `Unsigned` using the methods provided in some of the typeclass instances.

**More examples:**
<details>

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

</details>

## Signed

Clash also supports signed numbers.

````admonish example title="Signed"
`data Signed (n :: Nat)`

Arbitrary-width signed integer represented by `n` bits, including the sign bit.

Uses standard 2-complements representation. Meaning that, given n bits, a `Signed n` number has a range of: `[-(2^(n-1)) .. 2^(n-1)-1]` for `n > 0`. When `n = 0`, both the min and max bound are `0`.

**Examples**
```
>>> 3 :: Signed 2
-1
>>> 3 :: Signed 16
3
>>> 3 :: Signed 1
-1
>>> -3 :: Signed 8
1
```
````

```
clashi> let x = 3 :: Signed 8
clashi> pack x
0b0000_0011
clashi> let x = -3 :: Signed 8
clashi> pack x
0b1111_1101
```

## Bool
