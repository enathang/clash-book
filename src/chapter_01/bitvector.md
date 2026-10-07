# Bit, BitVector

When writing hardware designs, we often want to work with raw binary. After all, it is the primitive building block of digital logic and what all of our digital designs are synthesized down to.

In this section, we introduce the basic building block of every circuit: the `Bit`. We also explore what _typeclasses_ Bit implements. We then introduce probably the most common type you will use in Clash: `BitVector n`.
## What is a `Bit`
A bit is a binary value: a `high (1)`, a `low (0)`, or an `undefined (.)`. We can use the `Bit` type to hold these values.

````admonish example title="Bit"
<!-- admonish-link href="https://hackage.haskell.org/package/clash-prelude/docs/Clash-Sized-BitVector.html#t:Bit" text="See doc on Hackage >" -->
`data Bit`

A single bit.

**Examples**
```
>>> high
1
>>> low
0
```
````

Okay, but how do we do things with it?

The type system in Haskell is pretty different to other languages. Without going into too much detail, one important part of any data type is what *type class instances* are defined with it. Type classes define common functions that the data type can implement. They work similarly to Java's interfaces or Rust's traits.

A general rule of thumb is: when you want to know what something *is*, look at the data type. When you want to know *what you can do with it*, then look at
1. library functions that use that type
2. the type classes that type implements

So let's look at a few handpicked classes that Bit implements:

````admonish example title="Bit typeclass instances"
<!-- admonish-link href="https://hackage.haskell.org/package/clash-prelude/docs/Clash-Sized-BitVector.html#t:Bit" text="See doc on Hackage >" -->
**Notable typeclass instances**
<details>
<summary><code>Bits Bit</code></summary>

+ <code>(.&.) :: Bit -> Bit -> Bit</code>
+ <code>(.|.) :: Bit -> Bit -> Bit</code>
+ <code>xor :: Bit -> Bit -> Bit</code>
+ <code>complement :: Bit -> Bit</code>
+ <code>shift :: Bit -> Int -> Bit</code>
+ <code>rotate :: Bit -> Int -> Bit</code>
+ <code>setBit :: Bit -> Int -> Bit</code>
+ <code>clearBit :: Bit -> Int -> Bit</code>
+ <code>complementBit :: Bit -> Int -> Bit</code>
+ <code>testBit :: Bit -> Int -> Bool</code>
+ _Truncated for brevity. See all methods on [Hackage](https://hackage.haskell.org/package/clash-prelude/docs/Clash-Sized-BitVector.html#t:Bit)._
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

If you're still confused by typeclasses, that's natural. They are one of Haskell's early learning curves. We elaborate on them in the [Appendix](../appendix/typeclasses.md), or feel free to continue reading anyway.

**Examples using type classes**

We can use any of the functions in the type classes above to work with Bits
```
>>> high .&. low        -- From Bits class
0
>>> xor high low        -- From Bits class
1
>>> xor high (xor high low)
0
>>> high == high        -- From Eq class
True
```

We recommend you take a minute and explore some of the type classes.

Of course, we can also define our own functions over the `Bit` type

```
>>> let f a b c = xor (a .&. b) c
>>> f high high high
0
```
**Synthesizing hardware from `Bit`**

Everything we have done so far, including applying functions, is just Haskell. Remember, Clash code **is** Haskell code. The power of Clash is that we can also use the Clash compiler to translate this Haskell code into a hardware description.

We call the process of turning Clash code into HDL **synthesis**.

We provide a few examples of Clash code below with their synthesized outputs. We encourage you to guess the hardware outputs before checking your answers.
<details>
<summary><strong>Example 1</strong></summary>

Input:
```
func :: Bit -> Bit
func a = a
```

Output
````admonish quote title="Synthesized output" collapsible=true
```mermaid
flowchart LR
    classDef hidden fill:none,stroke:none
    a[" "]:::hidden -->|a| o[" "]:::hidden
```

Well, that's not very interesting. The circuit simply passes the input through to the output.
````
</details>

<details>
<summary><strong>Example 2</strong></summary>

Input:
```
func :: Bit -> Bit -> Bit -> Bit
func a b c = xor (a .&. b) c
```

Output
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
</details>

<details>
<summary><strong>Example 3</strong></summary>

Input:
```
let f a b = c
  where
   c = (a .|. b) .|. c
```

**Output**
````admonish quote title="Synthesized output" collapsible=true
Congrats, you created your first combinational loop in Clash! Clash will compile this design. 

![](img/bit-example3-v2.svg)

Combinational loops are almost always bad :) For more information, take a look at [Common pitfall: Combinational loop](./combinational_loop.md).
````
</details>

````admonish exercise title="Exercise: Building a safe" collapsible=true
Your boss has hired you to design a digital safe for them. The safe has 4 switches `a`, `b`, `c`, `d`. The output signal is either `high` (unlocked) or `low` (locked).

```
safeKeypad :: Bit -> Bit -> Bit -> Bit -> Bit
safeKeypad a b c d = undefined    -- Implement me!
```

Unfortunately, your boss has already assigned passwords to their employees. Your job is to implement the digital safe such that any of the passwords unlock the safe, but the safe stays locked otherwise.

The valid employee passwords are
```
0100
1100
1110
1111
1000
1001
1010
1011
```
````

**Conclusion**

In all honesty, while `Bit` is an important data type, you don't end up using it in Clash a lot. You often want to work with collections of `Bit`s, which is more easily represented in Clash as `BitVector n`.

## What is a `BitVector n`
Typically, it's useful to represent a collection of bits together. A `BitVector n` is a vector of `n` bits.


```admonish example title="BitVector"
<!-- admonish-link href="https://hackage.haskell.org/package/clash-prelude/docs/Clash-Sized-BitVector.html#t:BitVector" text="See doc on Hackage >" -->
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
+ <code>setBit :: BitVector n -> Int -> BitVector n</code>
+ <code>clearBit :: BitVector n -> Int -> BitVector n</code>
+ <code>complementBit :: BitVector n -> Int -> BitVector n</code>
+ <code>testBit :: BitVector n -> Int -> Bool</code>
+ _Truncated for brevity. See all methods on [Hackage](https://hackage.haskell.org/package/clash-prelude/docs/Clash-Sized-BitVector.html#t:BitVector)._
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

Let's take a look at a few examples to build up an intuition.

**Examples:**
```
>>> 3 :: BitVector 8
0b0000_0011
>>> 3 :: BitVector 16
0b0000_0000_0000_0011
>>> 3 :: BitVector 1
0b1
```

Pretty straightforward, right?

Similar to `Bit`, we can use any of the methods defined in the typeclasses that `BitVector` implements, along with other functions the `Clash.Prelude` library exports.

```
>>> let x = 3 :: BitVector 8
>>> let y = 4 :: BitVector 8
>>> x + y                        -- Uses Num
0b0000_0111
>>> let f a b = (mod a b) <= a   -- Uses Integral, Ord
>>> f x y
True
>>> resize x :: BitVector 16    -- Uses Resize
0b0000_0000_0000_0011
```

**Type level sizing**

One important part of the `BitVector n` definition is that
> "`n` is defined on the type level".

This means that when you declare a type (or Clash infers a type), the size `n` of the `BitVector n` is part of the type. Which means if Clash is expecting a certain sized BitVector and you give it something else, it will throw a type error.

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
>>> let resized_y = resize y :: BitVector 8
>>> x + resized_y
0b0000_0111
```

```admonish warning title="Different from Verilog/VHDL"
This is one of the many places Clash differs from Verilog/VHDL

+ Verilog will implicitly extend narrow values into wider values and truncate wider values into narrow values. These sometimes generate warnings, depending on the tool, but never errors.
+ VHDL will error on assigning vectors of different lengths, but will resize operands implicitly on certain numeric_std arithmetic operators (like `+` on `unsigned`).

One of Haskell's guiding principles, which Clash inherits, is that a strong type system reduces bugs and increases correctness.
```

**Synthesizing hardware for `BitVector n`**

<details>
<summary><strong>Example 1</strong></summary>

Input:
```
f :: BitVector 3 -> BitVector 3
f a = a
```

Output
````admonish quote title="Synthesized output" collapsible=true

![](img/bitvector-example1-v2.svg)

It's identical to the `Bit` version of the same function, except with three wires instead of one.

````
</details>

<details>
<summary><strong>Example 2</strong></summary>

Input:
```
f :: BitVector 3 -> BitVector 3 -> BitVector 3
f a b = mod a b
```

Output
````admonish quote title="Synthesized output" collapsible=true

![](img/bitvector-example2-v2.svg)

````
</details>

<details>
<summary><strong>Example 3</strong></summary>

Input:
```
f :: BitVector 3 -> BitVector 5 -> BitVector 3
f a b = output
 where
  c = (resize a) + b
  d = a ! 0 .&. b ! 0
  output =
    if ((c > (4 :: BitVector 5)) .&. d)
        then 0
        else a
```

Output
````admonish quote title="Synthesized output" collapsible=true

Does this circuit do anything useful? Probably not. But it demonstrates how we can express more complex circuits in Clash.

![](img/bitvector-example3-v4.svg)


````

</details>

````admonish exercise title="Exercise: Checking account numbers" collapsible=true
Your boss has put you on a new task: checking account numbers of the invoices your company receives. Some of them are fake!

An account number is made up of 12 binary digits with the following structure:

`[CompanyId(0:2)][AccountId(3:11)]`

The following are known, good `companyId`s:
- `001`: ACME Corp
- `101`: Umbrella Corp
- `111`: Rainbow Inc

The following are rules for `accountId`:
- the leftmost digit must be a `0`
- the rightmost digit must be a `1`
- No three sequential bits may be the same

Since there's no existing way to handle these invoices, your boss asks you to do this by hand. However, after doing several dozen by hand, you think there must be an easier way of doing this work!

```
verifyAccountId :: BitVector 12 -> Bit
verifyAccountId accountNum = undefined   -- Implement me!
```
````

**Conclusion**

`BitVector n` is ubiquitous in Clash code. However, we often want to represent values not as a bundle of wires, but at a higher level of abstraction. In the next section, we'll look at how Clash handles numbers.

But before that, a _quiz_:

{{#quiz ./quizzes/bitvector.toml}}