# Map, Zip, Fold

## Map

````admonish example title="Map"

<details>
<summary><code class="language-haskell">map :: (a -> b) -> Vec n a -> Vec n b </code></summary>
</details>
<details>
<summary><code class="language-haskell">zipWith :: (a -> b -> c) -> Vec n a -> Vec n b -> Vec n c </code></summary>
</details>
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

## Zip

## Fold

## Why isn't map/zip/fold defined for tuples as well?