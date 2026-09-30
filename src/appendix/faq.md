# Clash FAQs

**Clash General FAQs**

<details>

<summary><strong>Question:</strong> Why should I care about Clash?</summary>

**Answer:**
I wouldn't say that you should necessarily care about Clash. I DO think you should care about the new HDLs coming out. Options include:
- Chisel
- Spade
- HardCaml

From a theoretical perspective, they offer a lot of interesting features from a language design persepctive.

From an engineering perspective, they offer better layers of abstraction and nicer ergonomics to work with.

Clash is simply one of the options. Personally, I think Clash has some nice features that make it enjoyable to work with. Whether you agree with me or not is totally up to you. If you take nothing else away from this book, you should take away that these languages are interesting and you should explore at least ONE of them.
</details>
<details><summary><strong>Question:</strong> Why Haskell?</summary>

**Answer:**
It doesn't have to be Haskell. I would say you want the following properties in an HDL:
- strong typing: so that mismatches of data types are caught at compile time rather than silently inserted
- some mechanisms for abstraction: to be able to write circuits using higher layers of abstraction. Popular options include generic types and higher-order functions, but they can be anything.
- first class support with a popular language: this makes writing tests for your HDL and debugging much easier
- be simple(ish): All things being equal, simplicity is good.
- Language constructs users are already familiar with.

Haskell fits this bill. It is also a suprisingly old language (~30 years), so the language features have stood the test of time. Of course, other options exist. Chisel is based in Scala and Spare is inspired by Rust. But we think Haskell turns out to be a pretty natural fit as an HDL.

You have the rest of the book to decide if you agree.

</details>

<details>
<summary><strong>Question:</strong> What subset of Haskell is synthesizable by Clash?</summary>

**Short answer:** Any Haskell construct that is (or can be simplified to) known-size at compile time.

**Long answer:** A hardware circuit is statically sized. For the Clash compiler to translate Haskell to a hardware circuit, the Haskell code must be known-size at compile time.

This means the following features ARE supported:
- polymorphic function definitions: this allows writing of generic library functions. However, to be instantiated, they must be instantiated with specific types at compile-time.
- Structural recursion

The following features ARE NOT supported:
- value-based recursion (or recursion the Haskell compiler cannot unroll at compile time)
- lists, `Integer`s, or other data types that are not statically-sized (Clash provides statically-sized alternatives for convenience)
- IO monads and other features that don't have a hardware equivalent.

I'd also refer you to [this response](../introduction/introduction_to_clash.md) by Christiaan Baaij.

</details>

<details>
<summary><strong>Question:</strong> What is the relationship between Clash and Bluespec/Lava?</summary>

**Short answer:** All are Haskell related. Bluespec does HLS, Clash does not. Lava is an embedded language within Haskell, Clash directly translates Haskell.

**Long answer:** To fill in later.

</details>

**Clash Language FAQs**

<details>
<summary><strong>Question:</strong> Is Clash a language or a DSL (domain specific language)?</summary>

**Short answer:** A language (but both terms are probably acceptable).

**Long answer:** A DSL is a language that is restricted to a specific problem domain. The definition of _specific problem domain_, however, is open to interpretation. Clash is restricted to the specific problem domain of circuit description. So by that definition, Clash is a DSL. But Verilog and VHDL are too (or perhaps they are restricted to "circuit description and simulation"). So by definition all HDLs are DSLs.

But the term DSL is generally used to refer to smaller languages like BNF and AWK. So by that definition, Clash is much more expressive than a DSL. 

Perhaps it's best to describe Clash relative to other languages: whatever you think languages like Verilog and VHDL are, as well as other languages such as MatLab and R, Clash is too.
</details><details>
<summary><strong>Question:</strong> Is Clash an embedded language/eDSL?</summary>

**Short answer:** No.

**Long answer:** This is a common misconception, and it's easy to see why: we describe Clash as a subset of Haskell. But a subset language is notably different to an embedded language.

An _embedded language_ is a language whose grammatical constructs are instantiated by running the host language.

This difference can be easily seen when comparing Clash to an actual embedded HDL: Chisel. Let's say we want to write a mux that branches when `x == 3`:

<!-- tabs: Haskell | Clash -->
<div>
The code is the exact same for Haskell and Clash, because the Haskell code is directly parsed and translated.

```
-- Haskell
if x == 3
  then -- Do something
  else -- Do something else
```

</div>
<div>
The code is the exact same for Haskell and Clash, because the Haskell code is directly parsed and translated.

```
-- Clash
if x == 3
  then -- Do something
  else -- Do something else
```

</div>

<!-- tabs: Scala | Chisel (same syntax) | Chisel (correct implementation) -->
<div>
Our Scala code looks quite similar to our Haskell and Clash code. So far so good.

```
// Scala
if (x == 3) {
  // Do something
} else {
  // Do something else
}
```
</div>
<div>
However, if we write Chisel the same way we would write Scala, we will end up taking EITHER branch 1 or branch 2. This is because in an embedded language, the computation graph is not a direct translation of the code. Rather, the output graph is built up in-memory by side effects of executing the language.

Here, at runtime, the code would evaluate `x` and see which branch it should take. 

```
// Chisel (since none of the function have a side effect of creating a Chisel
//         circuit, the code does not result in any output circuit.)
if (x == 3) {
  // Do something
} else {
  // Do something else
}
```

This makes embedded languages powerful because you can have a lot of compile-time power on how to instantiate your circuits. For example, you can easily choose a circuit implementation based on compile-time parameters.

But it CAN also make embedded languages un-ergonomic to work with because the embedded language needs to derive new function names and operations not already taken by the host language. You can see this in the next panel.

</div>
<div>

Here is how we would write our desired logic in Chisel. Note that `when` and `.otherwise` are defined Chisel functions. They operate the same as `if` and `else` except they have the side effect of also instantiating a mux into the in-memory execution graph Chisel constructs. 

```
// Chisel
when (x === 3.U) {
  // Do something
} .otherwise {
  // Do something else
}
```

At the end of the program, since the circuit graph only exists in program memory, you need to translate it and print it out.

```
object Main extends App {
  println(
    ChiselStage.emitSystemVerilog(
      new Blinky(1000)
    )
  )
}
```

</div>

</details>
<details>
<summary><strong>Question:</strong> Is the Clash compiler a compiler or a transpiler?</summary>

**Short answer:** a compiler.

**Long answer:** Both a compiler and transpiler take in code in one language and output code in a different language. The distinction between the two is whether the output language is a level of abstraction lower than the input language.

- Example of a compiler: Java -> JVM bytecode
- Example of a transpiler: Java -> Python

So the question is: is the output of the Clash compiler less abstract than the input?

The input Clash code can be polymorphic and contain a number of other abstractions. The output Verilog/VHDL is monomorphic. Therefore, the Clash compiler is a compiler.

**Follow up question:** But doesn't Verilog and VHDL have some support for generics etc.?

Yes. But they work differently than Clash's generics, and Clash does not output Verilog/VHDL generics. Therefore, technically the Clash compiler is a compiler that compiles Clash code to a _subset_ of Verilog/VHDL code. If Clash did support translating source code to Verilog/VHDL's generics, then it would be better described as a transpiler. However, since Clash and Verilog/VHDL generics work so differently, this would be practically impossible.

</details>

<details>
<summary><strong>Question:</strong> Does Clash do HLS (high-level synthesis)?</summary>

**Short answer:** No.

**Long answer:** High level synthesis allows the user to write a description of a circuit, usually untimed, and the compiler automatically determines what operations happens when (called scheduling) and what physical circuits perform this operation (called binding).

The easiest rule-of-thumb for whether a language uses HLS is "do I have to place all the registers myself?" If the answer is no, the languages does (or can do) HLS. If the answer is yes, the language does not do HLS.

Clash requires you to place all the registers youself and therefore does not do HLS.

</details>
