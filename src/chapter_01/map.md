# Map, Zip, Fold

We have already seen how to apply functions to _things_. But sometimes we'd like to apply a function to _a collection of things_.

## Map
Map applies a function to each element of a `Vec n a` creating a new vector. The new vector is always the same size. The output type need not be the same as the input type.

````admonish example title="Map"
<!-- admonish-link href="https://hackage-content.haskell.org/package/clash-prelude-1.10.1/docs/Clash-Sized-Vector.html#v:map" text="See doc on Hackage >" -->

<code class="language-haskell">map :: (a -> b) -> Vec n a -> Vec n b </code>

"map f xs" is the vector obtained by applying f to each element of xs, i.e.,

```
map f (x1 :> x2 :>  ... :> xn :> Nil) == (f x1 :> f x2 :> ... :> f xn :> Nil)
```

and corresponds to the following circuit layout

![](https://raw.githubusercontent.com/clash-lang/clash-compiler/master/clash-prelude/doc/map.svg)
````


**Examples**
```
>>> let x = 3 :> 4 :> 5 :> Nil :: Vec 3 (Unsigned 8)

>>> -- Map always takes a unary (one parameter) function
>>> map (+1) x
4 :> 5 :> 6 :> Nil

>>> -- The output type of the vector can be different than the input type
>>> map isEven x
False :> True :> False :> Nil

>>> -- We can also compose maps together
>>> map (*2) (map (+1) x)
8 :> 10 :> 12 :> Nil
```

## Zip
Zip allows us to combine two vectors into a third vector. Both input vectors need to be the same length, but the vectors don't need to be the same type.

There are actually multiple different `zip` functions that operate on different input structures. We cover the most common use case here: zipping two vectors together.

```` admonish example title="zipWith"
<!-- admonish-link href="https://hackage-content.haskell.org/package/clash-prelude-1.10.2/docs/Clash-Sized-Vector.html#v:zipWith" text="See doc on Hackage >" -->
`zipWith :: (a -> b -> c) -> Vec n a -> Vec n b -> Vec n c`

zipWith generalizes zip by zipping with the function given as the first argument, instead of a tupling function. For example, "zipWith (+)" applied to two vectors produces the vector of corresponding sums.

```
zipWith f (x1 :> x2 :> ... xn :> Nil) (y1 :> y2 :> ... :> yn :> Nil) == (f x1 y1 :> f x2 y2 :> ... :> f xn yn :> Nil)
```

"zipWith f xs ys" corresponds to the following circuit layout:

![](https://hackage-content.haskell.org/package/clash-prelude-1.10.1/docs/doc/zipWith.svg)

_(See all zip functions on [Hackage](https://hackage-content.haskell.org/package/clash-prelude-1.10.2/docs/Clash-Sized-Vector.html#g:16))_
````


**Examples**
```
>>> let x = 3 :> 4 :> 5 :> Nil :: Vec 3 (Unsigned 8)
>>> let y = 6 :> 7 :> 8 :> Nil :: Vec 3 (Unsigned 8)
>>> zip (+) x y
9 :> 11 :> 13 :> Nil
>>>
>>> -- Zipping vectors of differing lengths results in a type error
>>> let u = replicate 4 1 :: Vec 4 (Unsigned 8)
>>> zip (+) x u
TypeError
>>>
>>> -- But zipping vectors of the same length works, as long as the function typechecks
>>> let v = replicate 3 True :: Vec 3 (Bool)
>>> zip (\a b -> isEven a && b)
False :> True :> False :> Nil
```

## Fold

Folds take in a vector, a reduction function, and an initial value. It returns the value after applying that function to each element in the vector.

Unlike `Map` and `Zip`, fold outputs a singular value. In some other languages, the `fold` function is renamed `reduce` due to this reduction-of-dimension property.

```` admonish example title="Folds with an initial value"
<details>
<summary><code class="language-haskell">foldr :: (a -> b -> b) -> b -> Vec n a -> b</code></summary>

foldr, applied to a binary operator, a starting value (typically the right-identity of the operator), and a vector, reduces the vector using the binary operator, from right to left:

```
foldr f z (x1 :> ... :> xn1 :> xn :> Nil) == x1 `f` (... (xn1 `f` (xn `f` z))...)
foldr r z Nil                             == z
```

```
>>> foldr (/) 1 (5 :> 4 :> 3 :> 2 :> Nil)
1.875
```

"foldr f z xs" corresponds to the following circuit layout:

![](https://hackage-content.haskell.org/package/clash-prelude-1.10.1/docs/doc/foldr.svg)

**NB:** "foldr f z xs" produces a linear structure, which has a depth, or delay, of `O(length xs)`. Use fold if your binary operator f is associative, as "fold f xs" produces a structure with a depth of `O(log_2(length xs))`.
</details>
<details>
<summary><code class="language-haskell">foldl :: forall b a n. (b -> a -> b) -> b -> Vec n a -> b </code></summary>

foldl, applied to a binary operator, a starting value (typically the left-identity of the operator), and a vector, reduces the vector using the binary operator, from left to right:

```
foldl f z (x1 :> x2 :> ... :> xn :> Nil) == (...((z `f` x1) `f` x2) `f`...) `f` xn
foldl f z Nil                            == z
```

```
>>> foldl (/) 1 (5 :> 4 :> 3 :> 2 :> Nil)
8.333333333333333e-3
```

"foldl f z xs" corresponds to the following circuit layout:

![](https://hackage-content.haskell.org/package/clash-prelude-1.10.1/docs/doc/foldl.svg)

**NB:** "foldl f z xs" produces a linear structure, which has a depth, or delay, of `O(length xs)`. Use fold if your binary operator f is associative, as "fold f xs" produces a structure with a depth of `O(log_2(length xs))`.

</details>

````

```` admonish example title="Folds without an initial value"

<details>
<summary><code class="language-haskell">fold :: forall n a. (a -> a -> a) -> Vec (n + 1) a -> a </code></summary>

fold is a variant of foldr1 and foldl1, but instead of reducing from right to left, or left to right, it reduces a vector using a tree-like structure. The depth, or delay, of the structure produced by "fold f xs", is hence `O(log_2(length xs))`, and not `O(length xs)`.

NB: The binary operator "f" in "fold f xs" must be associative.

```
fold f (x1 :> x2 :> ... :> xn1 :> xn :> Nil) == ((x1 `f` x2) `f` ...) `f` (... `f` (xn1 `f` xn))
fold f (x1 :> Nil)                           == x1
fold f Nil                                   == TYPE ERROR
```

```
>>> fold (+) (5 :> 4 :> 3 :> 2 :> 1 :> Nil)
15
```

"fold f xs" corresponds to the following circuit layout:

![](https://hackage-content.haskell.org/package/clash-prelude-1.10.1/docs/doc/fold.svg)

</details>

<details>
<summary><code class="language-haskell">foldr1 :: (a -> a -> a) -> Vec (n + 1) a -> a </code></summary>

foldr1 is a variant of foldr that has no starting value argument, and thus must be applied to non-empty vectors.

```
foldr1 f (x1 :> ... :> xn2 :> xn1 :> xn :> Nil) == x1 `f` (... (xn2 `f` (xn1 `f` xn))...)
foldr1 f (x1 :> Nil)                            == x1
foldr1 f Nil                                    == TYPE ERROR
```
```
>>> foldr1 (/) (5 :> 4 :> 3 :> 2 :> 1 :> Nil)
1.875
```

"foldr1 f xs" corresponds to the following circuit layout:

![](https://hackage-content.haskell.org/package/clash-prelude-1.10.1/docs/doc/foldr1.svg)

**NB:** "foldr1 f z xs" produces a linear structure, which has a depth, or delay, of `O(length xs)`. Use fold if your binary operator f is associative, as "fold f xs" produces a structure with a depth of `O(log_2(length xs))`.

</details>

<details>
<summary><code class="language-haskell">foldr1 :: (a -> a -> a) -> Vec (n + 1) a -> a </code></summary>

foldl1 is a variant of foldl that has no starting value argument, and thus must be applied to non-empty vectors.

```
foldl1 f (x1 :> x2 :> x3 :> ... :> xn :> Nil) == (...((x1 `f` x2) `f` x3) `f`...) `f` xn
foldl1 f (x1 :> Nil)                          == x1
foldl1 f Nil                                  == TYPE ERROR
```
```
>>> foldl1 (/) (1 :> 5 :> 4 :> 3 :> 2 :> Nil)
8.333333333333333e-3
```

"foldl1 f xs" corresponds to the following circuit layout:

![](https://hackage-content.haskell.org/package/clash-prelude-1.10.1/docs/doc/foldl1.svg)


**NB:** "foldl1 f z xs" produces a linear structure, which has a depth, or delay, of `O(length xs)`. Use fold if your binary operator f is associative, as "fold f xs" produces a structure with a depth of `O(log_2(length xs))`.
</details>
````

## Real world example: FIR filter

A FIR (Finite Inpulse Response) filter is a filter that de-noises input. The output is a sum of a weighted average of the previous several clock cycle inputs. In practice, this means if the input is high for one clock cycle, the input is not registered, but if the input is high for a number of clock cycles, the input is registered.

![](https://wirelesspi.com/wp-content/uploads/2016/08/figure-introduction-fir-filter.png)

_Image courtesy of wirelesspi_

Since we have not yet covered sequential logic (and thus have no concept of clock cycles), we show a simplified version of the filter where all inputs come in on the same cycle. We will revisit this example in a later chapter.

```
firFilter :: Vec 4 (BitVector 3) -> BitVector 4
firFilter inputs = weightedSum
 where
  -- Create weights of 1 :> 2 :> 3 :> 4 :> Nil
  weights = iterateI (+1) 1

  -- Since we want to be careful about overflow, we first resize
  -- the inputs from BitVector 3 to BitVector 4, then do the math
  weightedSum = fold (+) (zipWith (*) weights (map resize inputs))
```

The above function contains few type signatures. Once you get used to Haskell, and you build up an intuition of what the type checker will and will not infer, you can omit many of the types (but not all!). However, for a beginner, we recommend adding redundant type annotations. See our section [Pitfall: Not adding enough type annotations](./adding_type_annotations.md) for more information.

Here's the same example with more type information:

```
firFilter :: Vec 4 (BitVector 3) -> BitVector 4
firFilter inputs = weightedSum
 where
  weights :: Vec 4 (BitVector 4)
  weights = iterateI (+1) 1

  resizedInputs :: Vec 4 (BitVector 4)
  resizedInputs = map resize inputs

  weightedSum :: BitVector 4
  weightedSum = fold (+) (zipWith (*) weights resizedInputs)
```

Of course, the fun doesn't stop there. For a (much) more complex example of what you can use higher-order functions for, you can take a look at the [Clash systolic array](https://clash-lang.org/blog/2018-07-25-systolic-arrays/) blog post. This example shows the abstraction power of separating your computation structure from the computation being done.

## Why isn't map/zip/fold defined for tuples as well?

Despite tuples, like vecs, being designed to hold multiple values, map/zip/fold are defined only for vecs. Why?

There are a few reasons for this, but one reason is that tuples can hold different types of elements. Because of this, you would need to specify a function for each element of the tuple, ie

```
mapOnTuple :: (a -> b) -> (c -> d) -> (e -> f) -> (a, c, e) -> (b, d, f)
```

There's nothing wrong with this function, but it ceases to be a `map` function and becomes an "apply functions to elements of a tuple" helper function.