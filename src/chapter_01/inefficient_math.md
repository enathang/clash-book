# Common pitfall: Inefficient math

If you come from the software world (as I did), you instinctively believe that all basic math operations are equal. Each operation takes one clock cycle in the CPU. In hardware, this is quite far from the truth (in a number of ways).

Though these symbols (`+`, `-`, `*`, `/`, `%`, `^`) all take up one character on our screen, in hardware they generate vastly different size circuits (and can scale widely depending on the input sizes).

**Example: Addition**

**Example: Division**

**Example: Modulo**

**Example: Rotation**

**Example: Floating point**

Don't even get me started.

**Avoiding the pitfall**

Take heart, all hope is not lost! Over time, you'll build up a natural instinct for mapping operations to their hardware output.

In the mean time, I would recommend focusing on making the feedback loop as small as possible. Write a small circuit, synthesize the output, and see the resource usage. Then modify it slightly and re-synthesize it. The longer you go in-between generating the output, the more likely you'll have introduced something without realizing the implications, and will have to track it down.