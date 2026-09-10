# Introduction to Clash

Clash is a bit difficult to describe. As Christiaan Baaij, one of the co-creators of Clash and my former boss, puts it in a HackerNews comment[^1]:

>  One of the original authors of Clash here.
>
>I was always torn on how to describe Clash to an audience whose background I don’t know up front: is it a hardware description ‘language’, or, is it a set of tools, libraries and scaffolding to use Haskell as a method for circuit description?
>
>So yes, Clash is just Haskell. Although it is Haskell with certain GHC language extensions enabled by default plus a type-checking plugin for reasoning about type-level natural numbers.
>
>That’s because the Clash compiler can only translate a semantic subset of Haskell to circuits. We use types to determine how big the circuit will become (fixed-length lists, fixed-depth trees, fixed-width numerics, etc.). So the semantic subset part means that Clash will not translate Haskell programs where the recursion depth is unknown at compile time, nor things like mutation (whether it’s ST or IO) or other I/O like actions.
>
>Finally, why we’ve kept the “Clash is a functional hardware description language” is that unlike approaches such as nMigen, Chisel, Spinal, the Clash compiler translates the actual Haskell source code to VHDL/(System)Verilog. It uses the GHC Haskell compiler to do all the parsing, type-checking and “desugaring”. This means that with Clash you can use all of Haskell’s syntax to describe how the circuit operates, including if-expressions, case-expressions, etc. In the other approaches I mentioned you usually have to use some sort of ‘when’-function to describe run-time choice. So those approaches to me feel more like a “use-language-X-as-a-tool-for-circuit-description”, while Clash, again to me, does really feel more like a hardware description ‘language’

[^1]: https://news.ycombinator.com/item?id=38781739