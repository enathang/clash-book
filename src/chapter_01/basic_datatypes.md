# Basic data types and functions

In Haskell and most other programming languages, values define _things_ and functions define _transformations_ on those things. In Clash, this is true as well. However, how the code gets translated into hardware may be unintuitive to new HDL users.

In most HDLs (including Clash), functions get turned into physical logic gates and values become bits that flow over the wires of the logic gates. This might feel counterintuitive, because we are used to thinking of values as concrete and functions as abstract and not vice versa. However, it turns out this is a very natural way of modeling hardware.

In the next few sections, we will cover the basic data types of Clash and their corresponding functions. From these basic data types and functions, we can create more complex functions until we have a computation graph (aka a circuit) that performs the computation we want.