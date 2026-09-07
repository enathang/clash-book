# Map, Zip, Fold

We have already seen how to apply functions to _things_. But sometimes we'd like to apply a function to _a collection of things_.

## Map
Map applies a function to each element of a `Vector`. The output type need not be the same as the input type.

````admonish example title="Map"
<details>
<summary><code class="language-haskell">map :: (a -> b) -> Vec n a -> Vec n b </code></summary>
</details>
````

**Examples**
```
>>> let x = 3 :> 4 :> 5 :> Nil :: Vec 3 (Unsinged 8)
>>> map (+1) x
4 :> 5 :> 6 :> Nil
>>> map isEven x
False :> True :> False :> Nil
>>> -- We can also compose maps together
>>> map (*2) (map (+1) x)
8 :> 10 :> 12 :> Nil
```

## Zip
Zip allows us to combine two vectors into a third vector. Both input vectors need to be the same length, but the vectors don't need to be the same type.

There are actually multiple different `zip` functions that are all variation of the same general theme. We cover the main one here.

```` admonish example title="Zip"
<details>
<summary><code class="language-haskell">zipWith :: (a -> b -> c) -> Vec n a -> Vec n b -> Vec n c </code></summary>
</details>
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

Unlike `Map` and `Zip`, the output of your fold can change based on which direction (left or right) you apply the function.

```` admonish example title="Fold"
<details>
<summary><code class="language-haskell">foldr :: (a -> b -> b) -> b -> Vec n a -> b</code></summary>
</details>
<details>
<summary><code class="language-haskell">foldl :: forall b a n. (b -> a -> b) -> b -> Vec n a -> b </code></summary>
</details>
<details>
<summary><code class="language-haskell">fold :: forall n a. (a -> a -> a) -> Vec (n + 1) a -> a </code></summary>
</details>
````

## Why isn't map/zip/fold defined for tuples as well?

Despite tuples, like vecs, being designed to hold multiple values, map/zip/fold are defined only for vecs. Why?

There are a couple reasons for this, but one main reason is that tuples can hold different types of elements. Because of this, you would need to specify a function for each element of the tuple, ie

```
mapOnTuple :: (a -> b) -> (c -> d) -> (e -> f) -> (a, c, e) -> (b, d, f)
```

There's nothing wrong with this function, but it ceases to be a `map` function and becomes an "apply functions to elements of a tuple" helper function.