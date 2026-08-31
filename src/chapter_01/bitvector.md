# Bit, BitVector, and BitSize

When writing hardware designs, we often want to work with raw binary. After all, it is the primitive layer of digital logic and what all of our digital designs are synthesized down to.

We introduce the basic building block of every circuit, the `Bit`. We then introduce probably the most common types you will use in Clash: `BitVector n`. We also explain how Clash keeps track of sizes on the type level.
## What is a `Bit`
A bit is a binary value: a `high (1)` or a `low (0)`.

````admonish example title="Bit"
`data Bit`

A single bit

**Constructors**
```
>>> high
1
>>> low
0
```
````

**Examples:**
```
>>> high
1
>>> low
0
```

The type system in Haskell is pretty different to other languages. Without going into too much detail, one important part of any data type is what *type class instances* are defined with it. These define common functions for that data type.

A general rule of thumb is: when you want to know what something *is*, look at the data type. When you want to know what you can do with it, then look at the type classes.

So let's look at a few handpicked classes:

````admonish example title="Bit typeclasses"
**Notable type classes**
<details>
<summary><code>Bits Bit</code></summary>

+ <code>(.&.) :: Bit -> Bit -> Bit</code>
+ <code>(.|.) :: Bit -> Bit -> Bit</code>
+ <code>xor :: Bit -> Bit -> Bit</code>
+ <code>complement :: Bit -> Bit</code>
+ <code>shift :: Bit -> Int -> Bit</code>
+ <code>rotate :: Bit -> Int -> Bit</code>
+ <code>zeroBits :: Bit</code>
+ <code>bit :: Int -> Bit</code>
+ <code>setBit :: Bit -> Int -> Bit</code>
+ <code>clearBit :: Bit -> Int -> Bit</code>
+ <code>complementBit :: Bit -> Int -> Bit</code>
+ <code>testBit :: Bit -> Int -> Bool</code>
+ <code>bitSizeMaybe :: Bit -> Maybe Int</code>
+ <code>bitSize :: Bit -> Int</code>
+ <code>isSigned :: Bit -> Bool</code>
+ <code>shiftL :: Bit -> Int -> Bit</code>
+ <code>unsafeShiftL :: Bit -> Int -> Bit</code>
+ <code>shiftR :: Bit -> Int -> Bit</code>
+ <code>unsafeShiftR :: Bit -> Int -> Bit</code>
+ <code>rotateL :: Bit -> Int -> Bit</code>
+ <code>rotateR :: Bit -> Int -> Bit</code>
+ <code>popCount :: Bit -> Int</code>
</details>

<details>
<summary><code>Num Bit</code></summary>

+ <code>(+) :: Bit -> Bit -> Bit</code>
+ <code>(-) :: Bit -> Bit -> Bit</code>
+ <code>(*) :: Bit -> Bit -> Bit</code>
+ <code>negate :: Bit -> Bit</code>
+ <code>abs :: Bit -> Bit</code>
+ <code>signum :: Bit -> Bit</code>
+ <code>fromInteger :: Integer -> Bit</code>
</details>

<details>
<summary><code>Integral Bit</code></summary>

+ <code>quot :: Bit -> Bit -> Bit</code>
+ <code>rem :: Bit -> Bit -> Bit</code>
+ <code>div :: Bit -> Bit -> Bit</code>
+ <code>mod :: Bit -> Bit -> Bit</code>
+ <code>quotRem :: Bit -> Bit -> (Bit, Bit)</code>
+ <code>divMod :: Bit -> Bit -> (Bit, Bit)</code>
+ <code>toInteger :: Bit -> Integer</code>
</details>

<details>
<summary><code>Eq Bit</code></summary>

+ <code>(==) :: Bit -> Bit -> Bool</code>
+ <code>(/=) :: Bit -> Bit -> Bool</code>
</details>

<details>
<summary><code>Ord Bit</code></summary>

+ <code>compare :: Bit -> Bit -> Ordering</code>
+ <code>(&lt;) :: Bit -> Bit -> Bool</code>
+ <code>(&lt;=) :: Bit -> Bit -> Bool</code>
+ <code>(&gt;) :: Bit -> Bit -> Bool</code>
+ <code>(&gt;=) :: Bit -> Bit -> Bool</code>
+ <code>max :: Bit -> Bit -> Bit</code>
+ <code>min :: Bit -> Bit -> Bit</code>
</details>

<details>
<summary><code>BitPack Bit</code></summary>

+ <code>pack :: Bit -> BitVector 1</code>
+ <code>unpack :: BitVector 1 -> Bit</code>
+ <code>maybeUnpack :: BitVector 1 -> Maybe Bit</code>
</details>

````

**Examples:**
```
>>> high .&. low      -- From Bits class
0
>>> xor high low        -- From Bits class
1
>>> xor high (xor high low)
0
>>> high == high        -- From Eq class
True
```

We recommend you take a minute and explore some of the type classes.

Of course, we can also define our own functions

```
clashi> let f a b c = xor (a .&. b) c
clashi> f high high high
0
```

````admonish quote title="Synthesized output" collapsible=true
```mermaid
flowchart LR
    a((a)) --> AND
    b((b)) --> AND
    AND(["AND"]) --> XOR
    c((c)) --> XOR
    XOR{{"XOR"}} --> out(("s"))
```
````

In all honesty, while `Bit` is an important data type, you will probably use it a lot less than its big sibling: `BitVector n`.

## What is a `BitVector n`
A `BitVector n` is a vector of `n` `bits`.

Before we look at the technical definition, let's take a look at a few examples.

**Examples:**
```
>>> 3 :: BitVector 8
0b0000_0011
>>> 3 :: BitVector 16
0b0000_0000_0000_0011
>>> 3 :: BitVector 1
0b1
```

```admonish example title="BitVector"
`data BitVector (n :: Nat)`

A vector of `n` bits, where `n` is defined on the type level

* Bit indices are descending
* Num instance performs unsigned arithmetic.

**Instances:**

<details>
<summary><code>Bits (BitVector n)</code></summary>

+ <code>(.&.) :: BitVector n -> BitVector n -> BitVector n</code>
+ <code>(.|.) :: BitVector n -> BitVector n -> BitVector n</code>
+ <code>xor :: BitVector n -> BitVector n -> BitVector n</code>
+ <code>complement :: BitVector n -> BitVector n</code>
+ <code>shift :: BitVector n -> Int -> BitVector n</code>
+ <code>rotate :: BitVector n -> Int -> BitVector n</code>
+ <code>zeroBits :: BitVector n</code>
+ <code>bit :: Int -> BitVector n</code>
+ <code>setBit :: BitVector n -> Int -> BitVector n</code>
+ <code>clearBit :: BitVector n -> Int -> BitVector n</code>
+ <code>complementBit :: BitVector n -> Int -> BitVector n</code>
+ <code>testBit :: BitVector n -> Int -> Bool</code>
+ <code>bitSizeMaybe :: BitVector n -> Maybe Int</code>
+ <code>bitSize :: BitVector n -> Int</code>
+ <code>isSigned :: BitVector n -> Bool</code>
+ <code>shiftL :: BitVector n -> Int -> BitVector n</code>
+ <code>unsafeShiftL :: BitVector n -> Int -> BitVector n</code>
+ <code>shiftR :: BitVector n -> Int -> BitVector n</code>
+ <code>unsafeShiftR :: BitVector n -> Int -> BitVector n</code>
+ <code>rotateL :: BitVector n -> Int -> BitVector n</code>
+ <code>rotateR :: BitVector n -> Int -> BitVector n</code>
+ <code>popCount :: BitVector n -> Int</code>
</details>

<details>
<summary><code>Num (BitVector n)</code></summary>

+ <code>(+) :: BitVector n -> BitVector n -> BitVector n</code>
+ <code>(-) :: BitVector n -> BitVector n -> BitVector n</code>
+ <code>(*) :: BitVector n -> BitVector n -> BitVector n</code>
+ <code>negate :: BitVector n -> BitVector n</code>
+ <code>abs :: BitVector n -> BitVector n</code>
+ <code>signum :: BitVector n -> BitVector n</code>
+ <code>fromInteger :: Integer -> BitVector n</code>
</details>

<details>
<summary><code>Integral (BitVector n)</code></summary>

+ <code>quot :: BitVector n -> BitVector n -> BitVector n</code>
+ <code>rem :: BitVector n -> BitVector n -> BitVector n</code>
+ <code>div :: BitVector n -> BitVector n -> BitVector n</code>
+ <code>mod :: BitVector n -> BitVector n -> BitVector n</code>
+ <code>quotRem :: BitVector n -> BitVector n -> (BitVector n, BitVector n)</code>
+ <code>divMod :: BitVector n -> BitVector n -> (BitVector n, BitVector n)</code>
+ <code>toInteger :: BitVector n -> Integer</code>
</details>

<details>
<summary><code>Eq (BitVector n)</code></summary>

+ <code>(==) :: BitVector n -> BitVector n -> Bool</code>
+ <code>(/=) :: BitVector n -> BitVector n -> Bool</code>
</details>

<details>
<summary><code>Ord (BitVector n)</code></summary>

+ <code>compare :: BitVector n -> BitVector n -> Ordering</code>
+ <code>(&lt;) :: BitVector n -> BitVector n -> Bool</code>
+ <code>(&lt;=) :: BitVector n -> BitVector n -> Bool</code>
+ <code>(&gt;) :: BitVector n -> BitVector n -> Bool</code>
+ <code>(&gt;=) :: BitVector n -> BitVector n -> Bool</code>
+ <code>max :: BitVector n -> BitVector n -> BitVector n</code>
+ <code>min :: BitVector n -> BitVector n -> BitVector n</code>
</details>

<details>
<summary><code>BitPack (BitVector n)</code></summary>

+ <code>pack :: BitVector n -> BitVector n</code>
+ <code>unpack :: BitVector n -> BitVector n</code>
+ <code>maybeUnpack :: BitVector n -> Maybe (BitVector n)</code>
</details>

<details>
<summary><code>Resize BitVector</code></summary>

+ <code>resize :: BitVector a -> BitVector b</code>
+ <code>extend :: BitVector a -> BitVector (b + a)</code>
+ <code>zeroExtend :: BitVector a -> BitVector (b + a)</code>
+ <code>signExtend :: BitVector a -> BitVector (b + a)</code>
+ <code>truncateB :: BitVector (a + b) -> BitVector a</code>
</details>

```

But what does it mean for `n` to be defined on the type level?

It means that when you declare a type (or Clash infers a type), the size of the `BitVector` is encoded in the type. Which means

```
>>> let x = 3 :: BitVector 8
>>> let y = 4 :: BitVector 9
>>> x + y
<interactive>:86:5: error: [GHC-83865]
    • Couldn't match type ‘9’ with ‘8’
      Expected: BitVector 8
        Actual: BitVector 9
    • In the second argument of ‘(+)’, namely ‘y’
      In the expression: x + y
      In an equation for ‘it’: it = x + y
```

```admonish warning title="Different from Verilog/VHDL"
This is one place Clash is different from Verilog/VHDL. Verilog and VHDL will `0`-extend different width numbers to make them match. Clash will throw a type error and force the designer to explicitly handle the conversion (perhaps through `resize`) or use a different function.

One of Haskell's guiding principles, which Clash inherits, is that a strong type system reduces bugs and increases correctness.
```


This is because numbers in pure Haskell (as in many other languages) are not explicit in their sizing. For example, saying `let x = 3` does not tell the compiler whether `x` should be represented with `8` bits, `unum` bits, etc. One reason for this is because the compiler can change the amount of memory it uses to store `x`. However, when we're using the same language to model hardware, the number of wires used to store the size of a variable needs to be known ahead of time.


Compile example =>
```
f :: BitVector 3 -> BitVector 3
f input = output
```

````admonish quote title="Synthesized output" collapsible=true
```mermaid
flowchart LR
    a((a)) --> AND
    b((b)) --> AND
    AND(["AND"]) --> XOR
    c((c)) --> XOR
    XOR{{"XOR"}} --> out(("s"))
```
````

## Conclusion
`BitVector` is ubiquitous in Clash code. However, we often times want to represent values not as a bundle of wires, but as a bundle of wires **that mean something**. In the next section, we'll look at how Clash handles numbers.
