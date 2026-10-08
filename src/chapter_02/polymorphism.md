# Function polymorphism

One of Haskell's guiding principles is: don't use a specific type when a generic type would do.

But what do we mean by that?

## Polymorphism by example

Consider this Clash code

```
isEven :: BitVector 4 -> Bool
isEven a = (mod a 2) == 0
```

Now this code works perfectly well. It typechecks, compiles, and synthesizes. However, if we wanted to use the function on a `BitVector 8`, we would need to either
1. change the type signature of the function to accept `BitVector 8` instead
2. `resize` the `BitVector 8` into a `BitVector 4` before passing it into the function.

Both are possible. However, there's an easier solution to this problem.

Haskell allows (and encourages) functions to be polymorphic. This is probably one of the biggest mental barriers to writing good Haskell code. Not because it's particularly difficult, but because we as engineers are used to reasoning about _concrete things_ and not _abstract things with properties_.

> Polymorphism means "many forms" and describes the ability of a single function, interface, or object to work with different data types or take on different behaviors.

Haskell enables polymorphism in functions through the use of _type variables_.

**Circling back to our example**

Haskell allows us to use type variables in our type signatures to abstractly represent types. You can recognize type variables because they always start with a lower case character.

If we look at our definition of `BitVector`, we can see it's polymorphic over an arbitrary `n` (assuming `n` is a type-level natural number)

```
data BitVector (n :: Nat)
```

In our above example of `isEven` above, we can substitute in a generic type variable `n` for the concrete type-level `4`.
```
isEven :: BitVector n -> Bool
isEven a = (mod a 2) == 0
```

We can then use this function on any sized bitvector:

```
>>> isEven (4 :: BitVector 4)
True
>>> isEven (7 :: BitVector 8)
False
>>> isEven (333 :: BitVector 100000)
False
```

**But is this well-defined for any `n`?**

The above statement "we can then use this function on any sized bitvector" might set off alarm bells. Any `n`? How do we know if the function is well behaved for all `n`?

This may seem like a vacuous statement, but: functions are composed of one or more other functions. **To see if this function is well-defined, you simply need to check that the type signatures of all internal functions are respected.**

Internally, `isEven` uses two functions: `mod` and `==`. We can look at the type signature of each function:
- `mod :: BitVector n -> BitVector n -> BitVector n` (from Integral instance)
- `(==) :: BitVector n -> BitVector n -> Bool` (from Eq instance)

Because `mod` and `==` are defined on `BitVector`s of any length, per their type signature, we should be good to go.

## How do we synthesize polymorphic circuits?

That's the neat thing: you don't.

Remember, Clash needs to know the size of every part of the circuit at compile time. Otherwise Clash will not know how many wires to create.

We can make a polymorphic function into a monomorphic function through _monomorphization_. Which is a fancy way of saying substitute all type variables with concrete types.

We've actually already done this with our above examples
```
>>> isEven (4 :: BitVector 4)
True
```

In this case, when we applied `(4 :: BitVector 4)` to `BitVector n -> Bool`, we monomorphized the circuit to `BitVector 4 -> Bool`.

From this, we discover a common pattern in Clash. One typically defines functions polymorphically, but the _topEntity_ must apply specific types to these function to monomorphize them. This allows Clash to figure out all the types and thereby know the size of every wire at compile time.


## If we have to monomorphize anyway, why should we care about making functions polymorphic?

There's nothing in Haskell (or Clash) that requires you to generalize your function types. Your code will still compile and work as intended.

However, there are a few reasons why generalizing your functions is a good idea:
1. It allows you to reuse the same logic on multiple types. For example, you may want to use the same logic multiple times in different parts of the circuit. Or, you write a circuit for one size, and then requirements change and it expects the number of wires to double.
2. As you get more used to Haskell, you'll start looking at the type signature of functions as a quick reference for what they do. Therefore, one generally encodes only things relevant to the function in the types. This makes it easier for others to understand your function.
3. It can make your function implementation cleaner, because it forces you to figure out what part you actually care about and what is just noise.
4. When you start using higher-order functions, or functions that take other functions, polymorphism becomes important in decoupling _the structure of computation_ from the _computation being done_. An example we have already seen is `map`.

Over time, you may find yourself naturally writing polymorphically (and even start thinking that way)!

Of course, our ability (and enjoyment) to write polymorphic functions depends heavily on how easy it is to define exactly what types we want our functions to accept and return. Luckily, Haskell has a pretty simple yet robust way for us to do this: `constraints`. We will cover this in the next section.