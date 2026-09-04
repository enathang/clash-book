# Chapter 2: Generalizing circuits

We learned in the previous chapter how to create circuits in Clash. We even saw some of the more Haskell-y ways of writing circuits, including custom data types and higher order functions (such as `map`).

However, we have done little to distinguish Clash from other HDLs. That's perfectly okay - familiarity is good and there aren't many ways to write low-level circuits anyway.

In this chapter, we cover one of the things Clash is naturally good at: generalizing circuit definitions across different data types and sizes. We will also introduce a few new Haskell concepts, such as `constraints`, that are required to properly understand both this chapter and Chapter 3: Sequential logic.