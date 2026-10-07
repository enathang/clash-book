# Typeclasses

There are two main forms of abstraction modern programming languages have used: _inheritance_ and _composition_. Haskell and its typeclasses sit in the _composition_ category.

## The three things: types, typeclasses, and instances

Composition in Haskell is actually quite straightforward. The main confusion comes from:
1. trying to mentally map _inheritance_ onto _composition_ rather than just learning _composition_ from scratch
2. the naming of the _composition_ terms that overlap with _inheritance_ names, but meaning something different.

Therefore, we define the main terms below

- type: a data type
    - examples: `Bit`, `BitVector`, `Maybe a`
- typeclass: a typeclass defines a set of methods
    - examples: `Show`, `Eq`
- instance: a code sample that defines how a type implements the typeclass methods. Therefore, an instance is always specific to a (type, typeclass) pair.
    - example: `(Show, Bit) = ...`

**Example: Show**

Type: [Maybe](https://hackage-content.haskell.org/package/base-4.22.0.0/docs/Data-Maybe.html#t:Maybe)

```
data Bit =
  -- | The constructor, 'Bit', and  the fields, 'unsafeMask#' and 'unsafeToInteger#', are not
  -- synthesizable.
  Bit { unsafeMask#      :: {-# unpack #-} !Word
      , unsafeToInteger# :: {-# unpack #-} !Word
      }
  deriving (Data, Generic)
```

Typeclass: [Show](https://hackage-content.haskell.org/package/base-4.22.0.0/docs/Text-Show.html#t:Show)

```
class  Show a  where
    {-# MINIMAL showsPrec | show #-}

    -- | Convert a value to a readable 'String'.
    showsPrec :: Int    -- ^ the operator precedence of the enclosing
                        -- context (a number from @0@ to @11@).
                        -- Function application has precedence @10@.
              -> a      -- ^ the value to be converted to a 'String'
              -> ShowS

    -- | A specialised variant of 'showsPrec', using precedence context
    -- zero, and returning an ordinary 'String'.
    show      :: a   -> String

    -- | The method 'showList' is provided to allow the programmer to
    -- give a specialised way of showing lists of values.
    -- For example, this is used by the predefined 'Show' instance of
    -- the 'Char' type, where values of type 'String' should be shown
    -- in double quotes, rather than between square brackets.
    showList  :: [a] -> ShowS

    showsPrec _ x s = show x ++ s
    show x          = shows x ""
    showList ls   s = showList__ shows ls s
```

Instance: [Show (Maybe a)]

```
instance Show Bit where
  show (Bit 0 b) =
    case testBit b 0 of
      True  -> "1"
      False -> "0"
  show (Bit _ _) = "."
```


![](./img/haskell-typeclass.svg)